/**
 * Backend API client.
 *
 * Backend URL is read from NEXT_PUBLIC_API_URL (defaults to http://localhost:4000).
 * All product price fields are integer cents on the wire; this module adapts
 * them to dollars and normalizes tier casing for the frontend.
 *
 * Every fetch silently falls back to the local mock catalog if the backend
 * is unreachable, so dev works regardless of whether backend is running.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Tier = "Tournament" | "Club" | "Practice";
export type Feather = "Goose" | "Duck" | "Nylon";

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
  tier: Tier | null;
};

export type ProductFilter = {
  tier?: Tier[];
  brand?: string[];
  feather?: string[];
  speed?: string[];
};

// ── Raw shapes returned by the backend (mirrors Prisma) ──
type BackendBrand = { id: string; name: string; slug: string };

type BackendProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice?: number | null;
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
  tier?: "TOURNAMENT" | "CLUB" | "PRACTICE";
};

function normalizeTier(t: BackendProduct["tier"]): Tier | null {
  if (t === "TOURNAMENT") return "Tournament";
  if (t === "CLUB") return "Club";
  if (t === "PRACTICE") return "Practice";
  return null;
}

function adaptProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand?.name ?? "—",
    description: p.description ?? "",
    price: p.price / 100,
    salePrice: p.salePrice != null ? p.salePrice / 100 : null,
    stock: p.stock,
    imageUrl: p.imageUrl,
    feather: p.featherType,
    speed: p.speed,
    tier: normalizeTier(p.tier),
  };
}

// ── Single fetch wrapper with backend or mock fallback ──

async function tryFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const json = await tryFetch<{ product: BackendProduct }>(`${API_URL}/api/products/${slug}`);
  if (json?.product) return adaptProduct(json.product);

  // Fallback to mock — kept in separate module to avoid circular import in adapter.
  const { getMockProductBySlug } = await import("./products");
  return getMockProductBySlug(slug);
}

export async function getProducts(filter?: ProductFilter): Promise<Product[]> {
  // Backend supports tier + brand as query params; feather/speed filtered locally.
  const url = new URL(`${API_URL}/api/products`);
  if (filter?.tier?.length === 1) url.searchParams.set("tier", filter.tier[0]);
  if (filter?.brand?.length === 1) {
    url.searchParams.set("brand", filter.brand[0].toLowerCase());
  }

  const json = await tryFetch<{ products: BackendProduct[] }>(url.toString());
  let list: Product[];
  if (json?.products) {
    list = json.products.map(adaptProduct);
  } else {
    const { MOCK_PRODUCTS } = await import("./products");
    list = MOCK_PRODUCTS;
  }

  return applyFilter(list, filter);
}

function applyFilter(list: Product[], f?: ProductFilter): Product[] {
  if (!f) return list;
  return list.filter((p) => {
    if (f.tier?.length && (!p.tier || !f.tier.includes(p.tier))) return false;
    if (f.brand?.length && !f.brand.some((b) => p.brand.toLowerCase() === b.toLowerCase())) return false;
    if (f.feather?.length && (!p.feather || !f.feather.includes(p.feather))) return false;
    if (f.speed?.length && (!p.speed || !f.speed.includes(p.speed))) return false;
    return true;
  });
}

export function fmtPrice(dollars: number): string {
  return "$" + dollars.toFixed(2);
}

// Legacy named export for the product page — kept for back-compat with the
// older lib/api.ts API. New callers should use getProductBySlug.
export const fetchProductBySlug = getProductBySlug;
