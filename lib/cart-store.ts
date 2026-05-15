"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  meta: string;
  imageUrl: string | null;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (slug: string, qty: number) => void;
  removeLine: (slug: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) =>
        set((s) => {
          const qty = line.qty ?? 1;
          const existing = s.lines.find((l) => l.slug === line.slug);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.slug === line.slug ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...line, qty }] };
        }),
      setQty: (slug, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.slug !== slug)
              : s.lines.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        })),
      removeLine: (slug) =>
        set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "battyhub-cart" },
  ),
);

export function useCartTotals() {
  const lines = useCart((s) => s.lines);
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 9;
  const tax = Math.round(subtotal * 0.0875 * 100) / 100;
  const total = subtotal + shipping + tax;
  return { lines, subtotal, shipping, tax, total };
}
