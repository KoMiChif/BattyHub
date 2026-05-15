import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../lib/env.js";

export type JwtPayload = {
  sub: string;
  role: "CUSTOMER" | "ADMIN";
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === "string") throw new Error("Invalid token");
  return decoded as JwtPayload;
}
