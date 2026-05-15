/**
 * Backend API client.
 *
 * Backend URL is read from NEXT_PUBLIC_API_URL (defaults to http://localhost:4000).
 * All product price fields are integer cents on the wire.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// ── Raw shapes returned by the backend (mirrors Prisma) ──
export type BackendBrand = {
  id: string;
  name: string;
  slug: string;
};

export type BackendProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number; // cents
  currency: string;
  stock: number;
  imageUrl: string | null;
  featherType: string | null;
  speed: string | null;
  brand: BackendBrand | null;
  brandId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // pending schema additions — read defensively
  tier?: "TOURNAMENT" | "CLUB" | "PRACTICE";
  salePrice?: number | null;
};

// ── Frontend-friendly shape ──
export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number; // dollars
  salePrice: number | null;
  stock: number;
  imageUrl: string | null;
  feather: string | null;
  speed: string | null;
  tier: "Tournament" | "Club" | "Practice" | null;
};

function centsToDollars(cents: number): number {
  return cents / 100;
}

function normalizeTier(t: BackendProduct["tier"]): Product["tier"] {
  if (t === "TOURNAMENT") return "Tournament";
  if (t === "CLUB") return "Club";
  if (t === "PRACTICE") return "Practice";
  return null;
}

export function adaptProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand?.name ?? "—",
    description: p.description ?? "",
    price: centsToDollars(p.price),
    salePrice: p.salePrice != null ? centsToDollars(p.salePrice) : null,
    stock: p.stock,
    imageUrl: p.imageUrl,
    feather: p.featherType,
    speed: p.speed,
    tier: normalizeTier(p.tier),
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const json = (await res.json()) as { product: BackendProduct };
    return adaptProduct(json.product);
  } catch {
    return null;
  }
}

export async function fetchProducts(query?: { brand?: string }): Promise<Product[]> {
  try {
    const url = new URL(`${API_URL}/api/products`);
    if (query?.brand) url.searchParams.set("brand", query.brand);
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const json = (await res.json()) as { products: BackendProduct[] };
    return json.products.map(adaptProduct);
  } catch {
    return [];
  }
}

export function fmtPrice(dollars: number): string {
  return "$" + dollars.toFixed(2);
}
