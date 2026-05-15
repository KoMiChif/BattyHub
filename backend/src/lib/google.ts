import { OAuth2Client } from "google-auth-library";
import { env } from "./env.js";
import { HttpError } from "../middleware/error.js";

let client: OAuth2Client | null = null;

function getClient(): OAuth2Client {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new HttpError(503, "Google sign-in is not configured on the server");
  }
  if (!client) client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  return client;
}

export type GoogleProfile = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  avatarUrl: string | null;
};

/**
 * Verify a Google ID token (the `credential` returned by GIS' One Tap / button)
 * and return the trusted profile fields. Throws HttpError if invalid.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const c = getClient();
  let payload;
  try {
    const ticket = await c.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID!,
    });
    payload = ticket.getPayload();
  } catch {
    throw new HttpError(401, "Invalid Google credential");
  }
  if (!payload || !payload.sub || !payload.email) {
    throw new HttpError(401, "Google credential missing required claims");
  }
  return {
    googleId: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified ?? false,
    name: payload.name ?? null,
    avatarUrl: payload.picture ?? null,
  };
}
