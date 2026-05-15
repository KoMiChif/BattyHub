/**
 * URL ↔ ProductFilter helpers.
 *
 * Multi-value filters serialize as comma-separated lists in a single query
 * param: `?tier=Tournament,Club&brand=YONEX`. This keeps URLs compact and
 * makes it trivial to toggle individual values by rewriting the param.
 */
import type { ProductFilter, Tier } from "./api";

export type SearchParams = Record<string, string | string[] | undefined>;

function csv(v: string | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.flatMap((x) => x.split(",").filter(Boolean));
  return v.split(",").filter(Boolean);
}

const VALID_TIERS: Tier[] = ["Tournament", "Club", "Practice"];

export function parseFilter(params: SearchParams): ProductFilter {
  const tier = csv(params.tier).filter((t): t is Tier =>
    VALID_TIERS.includes(t as Tier),
  );
  return {
    tier: tier.length ? tier : undefined,
    brand: csv(params.brand).length ? csv(params.brand) : undefined,
    feather: csv(params.feather).length ? csv(params.feather) : undefined,
    speed: csv(params.speed).length ? csv(params.speed) : undefined,
  };
}

/** Toggle `value` in/out of the comma-separated param, returning a new search-string. */
export function toggleParam(
  current: SearchParams,
  key: "tier" | "brand" | "feather" | "speed",
  value: string,
): string {
  const existing = csv(current[key]);
  const next = existing.includes(value)
    ? existing.filter((v) => v !== value)
    : [...existing, value];

  const merged: Record<string, string> = {};
  for (const [k, v] of Object.entries(current)) {
    if (k === key) continue;
    if (Array.isArray(v)) merged[k] = v.join(",");
    else if (v) merged[k] = v;
  }
  if (next.length) merged[key] = next.join(",");

  const qs = new URLSearchParams(merged).toString();
  return qs ? "?" + qs : "";
}

/** Remove all filter params, preserving any non-filter params (e.g. sort). */
export function clearAll(current: SearchParams): string {
  const preserved: Record<string, string> = {};
  for (const [k, v] of Object.entries(current)) {
    if (k === "tier" || k === "brand" || k === "feather" || k === "speed") continue;
    if (Array.isArray(v)) preserved[k] = v.join(",");
    else if (v) preserved[k] = v;
  }
  const qs = new URLSearchParams(preserved).toString();
  return qs ? "?" + qs : "";
}

export function countActive(f: ProductFilter): number {
  return (
    (f.tier?.length ?? 0) +
    (f.brand?.length ?? 0) +
    (f.feather?.length ?? 0) +
    (f.speed?.length ?? 0)
  );
}
