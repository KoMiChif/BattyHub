import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/error.js";
import { requireStripe } from "../lib/stripe.js";

export const ordersRouter: Router = Router();

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  shipping: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

ordersRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.sub },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

ordersRouter.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: String(req.params.id) },
      include: { items: { include: { product: true } } },
    });
    if (!order || order.userId !== req.user!.sub) {
      throw new HttpError(404, "Order not found");
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

ordersRouter.post(
  "/checkout",
  requireAuth,
  validateBody(checkoutSchema),
  async (req, res, next) => {
    try {
      const { items, shipping } = req.body as z.infer<typeof checkoutSchema>;

      const productIds = items.map((i) => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds }, isActive: true },
      });
      if (products.length !== productIds.length) {
        throw new HttpError(400, "One or more products are unavailable");
      }

      let total = 0;
      const orderItems = items.map((line) => {
        const product = products.find((p) => p.id === line.productId)!;
        if (product.stock < line.quantity) {
          throw new HttpError(400, `Not enough stock for ${product.name}`);
        }
        total += product.price * line.quantity;
        return {
          productId: product.id,
          quantity: line.quantity,
          unitPrice: product.price,
          productName: product.name,
        };
      });

      const order = await prisma.$transaction(async (tx) => {
        for (const line of items) {
          await tx.product.update({
            where: { id: line.productId },
            data: { stock: { decrement: line.quantity } },
          });
        }
        return tx.order.create({
          data: {
            userId: req.user!.sub,
            totalAmount: total,
            shippingLine1: shipping.line1,
            shippingLine2: shipping.line2,
            shippingCity: shipping.city,
            shippingState: shipping.state,
            shippingPostal: shipping.postalCode,
            shippingCountry: shipping.country,
            items: { create: orderItems },
          },
          include: { items: true },
        });
      });

      const stripe = requireStripe();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: orderItems.map((i) => ({
          price_data: {
            currency: "usd",
            unit_amount: i.unitPrice,
            product_data: { name: i.productName },
          },
          quantity: i.quantity,
        })),
        metadata: { orderId: order.id },
        success_url: "http://localhost:3000/orders/success?order_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/orders/cancel",
      });

      res.status(201).json({ order, checkoutUrl: session.url });
    } catch (err) {
      next(err);
    }
  },
);
