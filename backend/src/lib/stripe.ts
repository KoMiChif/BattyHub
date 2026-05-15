import Stripe from "stripe";
import { env } from "./env.js";

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
  : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return stripe;
}
