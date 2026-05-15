"use client";

import type { AuthUser } from "./auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

async function postJson<T>(path: string, body: unknown): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        (json && typeof json.error === "string" && json.error) ||
        (json && typeof json.message === "string" && json.message) ||
        `Request failed (${res.status})`;
      return { data: null, error: msg };
    }
    return { data: json as T, error: null };
  } catch {
    return { data: null, error: "Could not reach the server. Is the backend running?" };
  }
}

export function login(email: string, password: string) {
  return postJson<AuthResponse>("/api/auth/login", { email, password });
}

export function register(email: string, password: string, name?: string) {
  return postJson<AuthResponse>("/api/auth/register", { email, password, name });
}

export function loginWithGoogle(credential: string) {
  return postJson<AuthResponse>("/api/auth/google", { credential });
}

export async function fetchMe(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { user: AuthUser };
    return json.user;
  } catch {
    return null;
  }
}
