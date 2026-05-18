import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { MobileFilterTrigger } from "@/components/MobileFilterDrawer";
import { getProducts, type Product, type Tier } from "@/lib/api";
import {
  parseFilter,
  toggleParam,
  clearAll,
  countActive,
  type SearchParams,
} from "@/lib/filters";
import styles from "./page.module.css";

const TIERS: Tier[] = ["Tournament", "Club", "Practice"];
const BRANDS = ["YONEX", "RSL", "VICTOR", "LI-NING"];
const FEATHERS = ["Goose", "Duck", "Nylon"];
const SPEEDS = ["75", "76", "77", "78"];
const SPEED_LABELS: Record<string, string> = {
  "75": "75 · cold",
  "76": "76 · standard",
  "77": "77 · warm",
  "78": "78 · hot",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filter = parseFilter(sp);
  const activeCount = countActive(filter);

  // Pull all products for facet counts, then filter for display.
  const allProducts = await getProducts();
  const products = await getProducts(filter);

  const counts = {
    tier: countBy(allProducts, (p) => p.tier),
    brand: countByLower(allProducts, (p) => p.brand),
    feather: countBy(allProducts, (p) => p.feather),
    speed: countBy(allProducts, (p) => p.speed),
  };

  const heading =
    filter.tier?.length === 1
      ? `${filter.tier[0]}.`
      : filter.tier?.length
        ? "Selected."
        : "Shop.";
  const crumb =
    filter.tier?.length === 1 ? `Shop / ${filter.tier[0]}` : "Shop / All shuttles";

  return (
    <div>
      <Nav />

      <section className={styles.titleRow}>
        <div className={styles.crumb}>{crumb}</div>
        <div className={styles.titleH1Row}>
          <h1 className={styles.h1}>{heading}</h1>
          <span className={`bh-tnum ${styles.skuCount}`}>{products.length} SKUs</span>
        </div>
      </section>

      <div className={styles.mobileFilterBar}>
        <MobileFilterTrigger
          sp={sp}
          filter={filter}
          counts={counts}
          activeCount={activeCount}
        />
        <span className={styles.mobileFilterBtn} aria-disabled>
          Sort: Newest
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </div>

      <section className={styles.layout}>
        <aside className={styles.filterRail}>
          <FilterGroup
            title="Tier"
            param="tier"
            options={TIERS.map((t) => ({ value: t, label: t, count: counts.tier[t] ?? 0 }))}
            sp={sp}
            active={filter.tier ?? []}
          />
          <FilterGroup
            title="Feather"
            param="feather"
            options={FEATHERS.map((f) => ({ value: f, label: f, count: counts.feather[f] ?? 0 }))}
            sp={sp}
            active={filter.feather ?? []}
          />
          <FilterGroup
            title="Speed"
            param="speed"
            options={SPEEDS.map((s) => ({
              value: s,
              label: SPEED_LABELS[s],
              count: counts.speed[s] ?? 0,
            }))}
            sp={sp}
            active={filter.speed ?? []}
          />
          <FilterGroup
            title="Brand"
            param="brand"
            options={BRANDS.map((b) => ({
              value: b,
              label: b,
              count: counts.brand[b.toLowerCase()] ?? 0,
            }))}
            sp={sp}
            active={filter.brand ?? []}
          />
        </aside>

        <div>
          <div className={styles.sortBar}>
            <ActiveChips sp={sp} filter={filter} />
            <span className={styles.sortLabel}>
              Sort:&nbsp;Newest
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </div>

          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className={styles.productGrid}>
              {products.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function countBy<K extends string | null>(
  items: Product[],
  fn: (p: Product) => K,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of items) {
    const k = fn(p);
    if (k == null) continue;
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function countByLower(items: Product[], fn: (p: Product) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of items) {
    const k = fn(p).toLowerCase();
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

type FilterOption = { value: string; label: string; count: number };

function FilterGroup({
  title,
  param,
  options,
  sp,
  active,
}: {
  title: string;
  param: "tier" | "brand" | "feather" | "speed";
  options: FilterOption[];
  sp: SearchParams;
  active: string[];
}) {
  return (
    <div className={styles.filterGroup}>
      <div className={styles.filterGroupTitle}>{title}</div>
      <ul>
        {options.map((opt) => {
          const isChecked = active.includes(opt.value);
          const href = `/shop${toggleParam(sp, param, opt.value)}`;
          return (
            <li key={opt.value}>
              <Link
                href={href}
                scroll={false}
                className={`${styles.filterItem} ${isChecked ? styles.filterItemChecked : ""}`}
              >
                <span className={styles.filterLabel}>
                  <span
                    className={`${styles.filterCheckbox} ${isChecked ? styles.filterCheckboxChecked : ""}`}
                  >
                    {isChecked && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#fff" strokeWidth="1.5" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </span>
                <span className={`bh-tnum ${styles.filterCount}`}>{opt.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ActiveChips({
  sp,
  filter,
}: {
  sp: SearchParams;
  filter: ReturnType<typeof parseFilter>;
}) {
  const chips: { key: "tier" | "brand" | "feather" | "speed"; value: string }[] = [];
  for (const v of filter.tier ?? []) chips.push({ key: "tier", value: v });
  for (const v of filter.feather ?? []) chips.push({ key: "feather", value: v });
  for (const v of filter.speed ?? []) chips.push({ key: "speed", value: `Speed ${v}` });
  for (const v of filter.brand ?? []) chips.push({ key: "brand", value: v });

  if (chips.length === 0) {
    return (
      <div className={styles.chips}>
        <span style={{ color: "var(--bh-gray-400)" }}>No filters applied</span>
      </div>
    );
  }

  return (
    <div className={styles.chips}>
      {chips.map((c) => {
        const rawValue = c.key === "speed" ? c.value.replace("Speed ", "") : c.value;
        const removeHref = `/shop${toggleParam(sp, c.key, rawValue)}`;
        return (
          <Link key={`${c.key}-${c.value}`} href={removeHref} scroll={false} className={styles.chip}>
            {c.value} <span style={{ marginLeft: 6, opacity: 0.7 }}>×</span>
          </Link>
        );
      })}
      <Link href={`/shop${clearAll(sp)}`} scroll={false} className={styles.clearLink}>
        Clear
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "80px 0",
        textAlign: "center",
        color: "var(--bh-gray-400)",
      }}
    >
      <div style={{ fontSize: 18, marginBottom: 8, color: "#000" }}>No shuttles match.</div>
      <div style={{ fontSize: 14 }}>Try removing a filter — the catalog is small for now.</div>
    </div>
  );
}
