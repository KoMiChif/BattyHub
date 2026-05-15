/**
 * Local mock catalog — used as fallback when the backend is unreachable
 * in dev. Shape is adapted to match the canonical `Product` from lib/api.ts
 * so consumers never need to know whether data came from API or mock.
 */
import type { Product } from "./api";

type Raw = {
  slug: string;
  brand: string;
  name: string;
  price: number; // dollars
  sale?: number;
  tier: "Tournament" | "Club" | "Practice";
  speed: 75 | 76 | 77 | 78;
  feather: "Goose" | "Duck" | "Nylon";
  stock?: number;
};

const RAW: Raw[] = [
  { slug: "yonex-aerosensa-50",  brand: "YONEX",   name: "Aerosensa 50",       price: 44, tier: "Tournament", speed: 77, feather: "Goose" },
  { slug: "yonex-aerosensa-40",  brand: "YONEX",   name: "Aerosensa 40",       price: 36, tier: "Tournament", speed: 77, feather: "Goose" },
  { slug: "rsl-tourney-no1",     brand: "RSL",     name: "Tourney No. 1",      price: 38, tier: "Tournament", speed: 77, feather: "Goose" },
  { slug: "victor-master-no1",   brand: "VICTOR",  name: "Master No. 1",       price: 40, tier: "Tournament", speed: 77, feather: "Goose", sale: 32 },
  { slug: "lining-a90",          brand: "LI-NING", name: "A+90 Tournament",    price: 36, tier: "Tournament", speed: 77, feather: "Goose" },
  { slug: "yonex-aerosensa-30",  brand: "YONEX",   name: "Aerosensa 30",       price: 26, tier: "Club",       speed: 77, feather: "Goose" },
  { slug: "rsl-classic-tourney", brand: "RSL",     name: "Classic Tourney",    price: 22, tier: "Club",       speed: 77, feather: "Goose" },
  { slug: "victor-champion-no3", brand: "VICTOR",  name: "Champion No. 3",     price: 19, tier: "Club",       speed: 77, feather: "Duck" },
  { slug: "yonex-aerosensa-20",  brand: "YONEX",   name: "Aerosensa 20",       price: 18, tier: "Practice",   speed: 77, feather: "Duck" },
  { slug: "lining-a30",          brand: "LI-NING", name: "A+30 Training",      price: 16, tier: "Practice",   speed: 77, feather: "Duck" },
  { slug: "yonex-mavis-350",     brand: "YONEX",   name: "Mavis 350 (Nylon)",  price: 13, tier: "Practice",   speed: 76, feather: "Nylon" },
  { slug: "yonex-mavis-2000",    brand: "YONEX",   name: "Mavis 2000 (Nylon)", price: 16, tier: "Practice",   speed: 76, feather: "Nylon" },
];

export const MOCK_PRODUCTS: Product[] = RAW.map((r) => ({
  id: r.slug,
  slug: r.slug,
  name: r.name,
  brand: r.brand,
  description: "",
  price: r.price,
  salePrice: r.sale ?? null,
  stock: r.stock ?? 50,
  imageUrl: null,
  feather: r.feather,
  speed: String(r.speed),
  tier: r.tier,
}));

export function getMockProductBySlug(slug: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export const CATEGORIES: { name: "Tournament" | "Club" | "Practice"; tag: string; tone: "dark" | "light" | "mid" }[] = [
  { name: "Tournament", tag: "BWF approved · Goose feather", tone: "dark" },
  { name: "Club",       tag: "Goose & premium duck",          tone: "light" },
  { name: "Practice",   tag: "Duck & nylon · high volume",    tone: "mid" },
];
