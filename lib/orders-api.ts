"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type CheckoutPayload = {
  items: { productId: string; quantity: number }[];
  customer: { email: string; name?: string };
  shipping: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
};

export type CheckoutResponseOrder = {
  id: string;
  totalAmount: number;
  currency: string;
};

export type CheckoutResponse = {
  order: CheckoutResponseOrder;
  checkoutUrl: string;
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderListItem = {
  id: string;
  status: OrderStatus;
  totalAmount: number; // cents
  currency: string;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number; // cents
  }[];
};

async function readError(res: Response): Promise<string> {
  const json = await res.json().catch(() => ({}));
  if (json && typeof json.error === "string") return json.error;
  if (json && typeof json.message === "string") return json.message;
  return `Request failed (${res.status})`;
}

export async function postCheckout(
  payload: CheckoutPayload,
  token: string | null,
): Promise<{ data: CheckoutResponse | null; error: string | null }> {
  try {
    const res = await fetch(`${API_URL}/api/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { data: null, error: await readError(res) };
    const data = (await res.json()) as CheckoutResponse;
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: "Could not reach the server. Is the backend running?",
    };
  }
}

export async function listMyOrders(
  token: string,
): Promise<{ data: OrderListItem[] | null; error: string | null }> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) return { data: null, error: "Session expired" };
    if (!res.ok) return { data: null, error: await readError(res) };
    const json = (await res.json()) as { orders: OrderListItem[] };
    return { data: json.orders ?? [], error: null };
  } catch {
    return {
      data: null,
      error: "Could not reach the server. Is the backend running?",
    };
  }
}

export function centsToUsd(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}
