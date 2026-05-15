import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/error.js";
import { verifyGoogleIdToken } from "../lib/google.js";

export const authRouter: Router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body as z.infer<typeof registerSchema>;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new HttpError(409, "Email already registered");

    const user = await prisma.user.create({
      data: { email, password: await hashPassword(password), name },
      select: { id: true, email: true, name: true, role: true },
    });
    const token = signToken({ sub: user.id, role: user.role });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpError(401, "Invalid credentials");
    if (!user.password) {
      // Account exists but was created via OAuth — point user to Google sign-in.
      throw new HttpError(
        401,
        "This account uses Google sign-in. Use the Google button to continue.",
      );
    }
    if (!(await verifyPassword(password, user.password))) {
      throw new HttpError(401, "Invalid credentials");
    }
    const token = signToken({ sub: user.id, role: user.role });
    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
});

const googleSchema = z.object({
  credential: z.string().min(1),
});

authRouter.post("/google", validateBody(googleSchema), async (req, res, next) => {
  try {
    const { credential } = req.body as z.infer<typeof googleSchema>;
    const profile = await verifyGoogleIdToken(credential);

    if (!profile.emailVerified) {
      throw new HttpError(401, "Google account email is not verified");
    }

    // Find by googleId first, then fall back to email. If found by email
    // but no googleId yet, link the existing password account.
    const existing =
      (await prisma.user.findUnique({ where: { googleId: profile.googleId } })) ??
      (await prisma.user.findUnique({ where: { email: profile.email } }));

    let user;
    if (existing) {
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          googleId: existing.googleId ?? profile.googleId,
          name: existing.name ?? profile.name,
          avatarUrl: existing.avatarUrl ?? profile.avatarUrl,
        },
        select: { id: true, email: true, name: true, role: true },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          googleId: profile.googleId,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
        },
        select: { id: true, email: true, name: true, role: true },
      });
    }

    const token = signToken({ sub: user.id, role: user.role });
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (!user) throw new HttpError(404, "User not found");
    res.json({ user });
  } catch (err) {
    next(err);
  }
});
