import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { HttpError } from "../middleware/error.js";

export const productsRouter: Router = Router();

const tierEnum = z.enum(["TOURNAMENT", "CLUB", "PRACTICE"]);

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
  salePrice: z.number().int().nonnegative().nullable().optional(),
  currency: z.string().default("USD"),
  stock: z.number().int().nonnegative().default(0),
  imageUrl: z.string().url().optional(),
  tier: tierEnum.default("CLUB"),
  featherType: z.string().optional(),
  speed: z.string().optional(),
  brandId: z.string().optional(),
  isActive: z.boolean().default(true),
});

function parseTier(input: unknown): "TOURNAMENT" | "CLUB" | "PRACTICE" | undefined {
  if (typeof input !== "string") return undefined;
  const upper = input.toUpperCase();
  return upper === "TOURNAMENT" || upper === "CLUB" || upper === "PRACTICE" ? upper : undefined;
}

productsRouter.get("/", async (req, res, next) => {
  try {
    const { brand, active, tier } = req.query;
    const tierFilter = parseTier(tier);
    const products = await prisma.product.findMany({
      where: {
        ...(brand ? { brand: { slug: String(brand) } } : {}),
        ...(tierFilter ? { tier: tierFilter } : {}),
        ...(active === undefined ? { isActive: true } : { isActive: active === "true" }),
      },
      include: { brand: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:slug", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { brand: true, reviews: { include: { user: { select: { name: true } } } } },
    });
    if (!product) throw new HttpError(404, "Product not found");
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

productsRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(productSchema),
  async (req, res, next) => {
    try {
      const product = await prisma.product.create({ data: req.body });
      res.status(201).json({ product });
    } catch (err) {
      next(err);
    }
  },
);

productsRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  validateBody(productSchema.partial()),
  async (req, res, next) => {
    try {
      const product = await prisma.product.update({
        where: { id: String(req.params.id) },
        data: req.body,
      });
      res.json({ product });
    } catch (err) {
      next(err);
    }
  },
);

productsRouter.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: String(req.params.id) },
      data: { isActive: false },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
