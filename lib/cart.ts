/**
 * Cart formatting helpers. Cart state itself lives in lib/cart-store.ts (Zustand).
 */
export function fmtUsd(n: number): string {
  return "$" + n.toFixed(2);
}
