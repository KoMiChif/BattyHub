export type Tier = "Tournament" | "Club" | "Practice";
export type Feather = "Goose" | "Duck" | "Nylon";

export type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  sale?: number;
  tier: Tier;
  speed: 75 | 76 | 77 | 78;
  feather: Feather;
};

export const PRODUCTS: Product[] = [
  { id: "as-50",         brand: "YONEX",   name: "Aerosensa 50",       price: 44, tier: "Tournament", speed: 77, feather: "Goose" },
  { id: "as-40",         brand: "YONEX",   name: "Aerosensa 40",       price: 36, tier: "Tournament", speed: 77, feather: "Goose" },
  { id: "rsl-tourney-1", brand: "RSL",     name: "Tourney No. 1",      price: 38, tier: "Tournament", speed: 77, feather: "Goose" },
  { id: "victor-master", brand: "VICTOR",  name: "Master No. 1",       price: 40, tier: "Tournament", speed: 77, feather: "Goose", sale: 32 },
  { id: "lining-a90",    brand: "LI-NING", name: "A+90 Tournament",    price: 36, tier: "Tournament", speed: 77, feather: "Goose" },
  { id: "as-30",         brand: "YONEX",   name: "Aerosensa 30",       price: 26, tier: "Club",       speed: 77, feather: "Goose" },
  { id: "rsl-classic",   brand: "RSL",     name: "Classic Tourney",    price: 22, tier: "Club",       speed: 77, feather: "Goose" },
  { id: "victor-champ",  brand: "VICTOR",  name: "Champion No. 3",     price: 19, tier: "Club",       speed: 77, feather: "Duck" },
  { id: "as-20",         brand: "YONEX",   name: "Aerosensa 20",       price: 18, tier: "Practice",   speed: 77, feather: "Duck" },
  { id: "lining-a30",    brand: "LI-NING", name: "A+30 Training",      price: 16, tier: "Practice",   speed: 77, feather: "Duck" },
  { id: "mavis-350",     brand: "YONEX",   name: "Mavis 350 (Nylon)",  price: 13, tier: "Practice",   speed: 76, feather: "Nylon" },
  { id: "mavis-2000",    brand: "YONEX",   name: "Mavis 2000 (Nylon)", price: 16, tier: "Practice",   speed: 76, feather: "Nylon" },
];

export const CATEGORIES: { name: Tier; tag: string; count: number; tone: "dark" | "light" | "mid" }[] = [
  { name: "Tournament", tag: "BWF approved · Goose feather",   count: 18, tone: "dark" },
  { name: "Club",       tag: "Goose & premium duck",           count: 24, tone: "light" },
  { name: "Practice",   tag: "Duck & nylon · high volume",     count: 19, tone: "mid" },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === slug);
}
