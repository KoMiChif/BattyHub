import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, type Tier } from "@/lib/products";
import styles from "./page.module.css";

type Search = { tier?: string; sort?: string };

const TIERS: { label: Tier; count: number }[] = [
  { label: "Tournament", count: 18 },
  { label: "Club", count: 24 },
  { label: "Practice", count: 19 },
];

const FEATHERS = [
  { label: "Goose", count: 32 },
  { label: "Duck", count: 18 },
  { label: "Nylon", count: 11 },
];

const SPEEDS = [
  { label: "75 · cold", count: 6 },
  { label: "76 · standard", count: 22 },
  { label: "77 · warm", count: 28 },
  { label: "78 · hot", count: 5 },
];

const BRANDS = [
  { label: "YONEX", count: 24 },
  { label: "RSL", count: 14 },
  { label: "Victor", count: 11 },
  { label: "Li-Ning", count: 8 },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { tier } = await searchParams;
  const activeTier = (tier as Tier) || "Tournament";
  const filtered = PRODUCTS.filter((p) => p.tier === activeTier);
  const tierCount = TIERS.find((t) => t.label === activeTier)?.count ?? filtered.length;

  return (
    <div>
      <Nav cartCount={0} />

      <section className={styles.titleRow}>
        <div className={styles.crumb}>Shop / {activeTier}</div>
        <div className={styles.titleH1Row}>
          <h1 className={styles.h1}>{activeTier}.</h1>
          <span className={`bh-tnum ${styles.skuCount}`}>{tierCount} SKUs</span>
        </div>
      </section>

      <div className={styles.mobileFilterBar}>
        <button className={styles.mobileFilterBtn}>
          Filter
          <span className="bh-tnum" style={{ fontSize: 11, color: "#fff", background: "#000", padding: "1px 6px" }}>2</span>
        </button>
        <button className={styles.mobileFilterBtn}>
          Sort: Newest
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <section className={styles.layout}>
        <aside className={styles.filterRail}>
          <FilterGroup
            title="Tier"
            items={TIERS.map((t) => ({ ...t, checked: t.label === activeTier }))}
          />
          <FilterGroup
            title="Feather"
            items={FEATHERS.map((f, i) => ({ ...f, checked: i === 0 }))}
          />
          <FilterGroup
            title="Speed"
            items={SPEEDS.map((s, i) => ({ ...s, checked: i === 2 }))}
          />
          <FilterGroup title="Brand" items={BRANDS} />
        </aside>

        <div>
          <div className={styles.sortBar}>
            <div className={styles.chips}>
              <span className={styles.chip}>{activeTier}</span>
              <span className={styles.chip}>Speed 77</span>
              <a className={styles.clearLink}>Clear</a>
            </div>
            <div className={styles.sortLabel}>
              Sort:&nbsp;Newest
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className={styles.productGrid}>
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          <div className={styles.pagination}>
            <span className={`${styles.pageNum} ${styles.pageNumActive}`}>1</span>
            <span className={styles.pageNum}>2</span>
            <span className={styles.pageNum}>3</span>
            <span style={{ marginLeft: 8 }}>→</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

type FilterItem = { label: string; count: number; checked?: boolean };

function FilterGroup({ title, items }: { title: string; items: FilterItem[] }) {
  return (
    <div className={styles.filterGroup}>
      <div className={styles.filterGroupTitle}>{title}</div>
      <ul>
        {items.map((it) => (
          <li
            key={it.label}
            className={`${styles.filterItem} ${it.checked ? styles.filterItemChecked : ""}`}
          >
            <span className={styles.filterLabel}>
              <span className={`${styles.filterCheckbox} ${it.checked ? styles.filterCheckboxChecked : ""}`}>
                {it.checked && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                )}
              </span>
              {it.label}
            </span>
            <span className={`bh-tnum ${styles.filterCount}`}>{it.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
