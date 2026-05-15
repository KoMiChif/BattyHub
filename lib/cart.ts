export type CartLine = {
  id: string;
  brand: string;
  name: string;
  meta: string;
  price: number;
  qty: number;
};

export const SAMPLE_CART: CartLine[] = [
  { id: "as-50",       brand: "YONEX", name: "Aerosensa 50",    meta: "Tournament · Speed 77 · 1 tube of 12", price: 44, qty: 4 },
  { id: "rsl-classic", brand: "RSL",   name: "Classic Tourney", meta: "Club · Speed 77 · 1 tube of 12",       price: 22, qty: 3 },
  { id: "mavis-350",   brand: "YONEX", name: "Mavis 350 Nylon", meta: "Practice · Speed 76 · 6-pack",         price: 13, qty: 2 },
];

export function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US") + ".00";
}

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const shipping = 0;
  const tax = Math.round(subtotal * 0.0875);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}
