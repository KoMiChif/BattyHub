import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { PlaceImg } from "@/components/PlaceImg";
import { RacketGlyph } from "@/components/glyphs";
import { CATEGORIES } from "@/lib/products";
import { getProducts } from "@/lib/api";
import styles from "./page.module.css";

export default async function Home() {
  const all = await getProducts();
  const featured = all.slice(0, 4);
  const tierCounts: Record<string, number> = {};
  for (const p of all) {
    if (p.tier) tierCounts[p.tier] = (tierCounts[p.tier] ?? 0) + 1;
  }
  return (
    <div>
      <div className={styles.utilityBar}>
        <span>Free shipping over $99 — ships in 48h from LA</span>
        <span className="right">EN · USD</span>
      </div>

      <section className={styles.hero}>
        <Nav transparent />
        <div className={styles.heroInner}>
          <div className={styles.heroBg}>
            <div className={styles.heroGlyph}>
              <RacketGlyph rotate={-22} opacity={0.18} color="#fff" />
            </div>
          </div>
          <div className={styles.heroContent}>
            <div>
              <div className={styles.heroKicker}>
                Drop 06 — Aerosensa 50 · Tournament Series
              </div>
              <h1 className={styles.heroTitle}>
                Built for<br />the smash.
              </h1>
              <div className={styles.heroCta}>
                <Link href="/shop">
                  <button
                    className="bh-btn bh-btn--lg"
                    style={{ background: "#fff", color: "#000", borderColor: "#fff" }}
                  >
                    Shop Now →
                  </button>
                </Link>
                <span className={styles.heroSubcopy}>From $129. Ships free in 48h.</span>
              </div>
            </div>
            <div className={styles.heroSpec}>
              <div>
                Feather · Goose<br />
                Speed · 77 grain<br />
                BWF · Approved
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Shop the<br />categories.
          </h2>
          <Link href="/shop" className={styles.sectionLink}>See all →</Link>
        </div>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/shop?tier=${c.name}`}
              style={{ display: "block", color: "inherit" }}
            >
              <PlaceImg ratio="4/5" glyph="shuttle" tone={c.tone} />
              <div style={{ paddingTop: 20 }}>
                <div className={styles.categoryCardTitleRow}>
                  <h3 className={styles.categoryCardTitle}>{c.name}</h3>
                  <span className={`bh-tnum ${styles.categoryCardCount}`}>
                    {tierCounts[c.name] ?? 0} SKUs
                  </span>
                </div>
                <div className={styles.categoryCardTag}>{c.tag}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            This week&apos;s<br />picks.
          </h2>
          <Link href="/shop" className={styles.sectionLink}>Shop all →</Link>
        </div>
        <div className={styles.featuredGrid}>
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} size="sm" />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.brandTitle}>
          Lower prices.<br />
          Cleaner site.<br />
          Faster checkout.
        </h2>
        <div className={styles.brandStats}>
          <div>
            <div className={`bh-tnum ${styles.brandStatNum}`}>~22%</div>
            <p className={styles.brandStatLabel}>below tournament MSRP</p>
          </div>
          <div>
            <div className={`bh-tnum ${styles.brandStatNum}`}>1</div>
            <p className={styles.brandStatLabel}>page checkout, no account required</p>
          </div>
          <div>
            <div className={`bh-tnum ${styles.brandStatNum}`}>48h</div>
            <p className={styles.brandStatLabel}>ship-out from LA, no air freight delays</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
