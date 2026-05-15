import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PlaceImg } from "@/components/PlaceImg";
import { getProduct, PRODUCTS } from "@/lib/products";
import styles from "./page.module.css";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

const SPEC_ROWS: [string, string][] = [
  ["Speed", "77 grain · standard warm"],
  ["Feather", "Goose · grade A first-cut"],
  ["BWF Approved", "Yes · ITTF tournament legal"],
  ["Tube Count", "12 shuttles per tube"],
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div>
      <Nav cartCount={0} />

      <section className={styles.crumb}>
        Shop / {product.tier} / {product.name}
      </section>

      <section className={styles.layout}>
        <div className={styles.gallery}>
          <PlaceImg ratio="1/1" glyph="shuttle" />
          <div className={styles.thumbs}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`${styles.thumb} ${i === 0 ? styles.thumbActive : ""}`}>
                <PlaceImg ratio="1/1" glyph="shuttle" tone={i === 1 ? "mid" : "light"} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.brand}>{product.brand}</div>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={`bh-tnum ${styles.price}`}>${product.price}.00</div>

          <p className={styles.desc}>
            {product.brand}&apos;s {product.tier.toLowerCase()}-grade shuttle. Hand-selected{" "}
            {product.feather.toLowerCase()} feathers — stable trajectory, true {product.speed} speed for
            indoor halls 60–75°F.
          </p>

          <table className={styles.specTable}>
            <tbody>
              {SPEC_ROWS.map(([k, v]) => (
                <tr key={k} className={styles.specRow}>
                  <td className={styles.specKey}>{k}</td>
                  <td className={`bh-tnum ${styles.specVal}`}>{v}</td>
                </tr>
              ))}
              <tr className={styles.specRow}>
                <td className={styles.specKey}>Cork</td>
                <td className={styles.specVal}>Portuguese cork base</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.tubeGroup}>
            <div className="bh-label">Quantity · 1 tube of 12</div>
            <div className={styles.tubeButtons}>
              <button className={`${styles.tubeBtn} ${styles.tubeBtnActive}`}>
                <span className={styles.tubeBtnLabel}>1 tube</span>
                <span className={`bh-tnum ${styles.tubeBtnPrice}`}>${product.price}.00</span>
              </button>
              <button className={styles.tubeBtn}>
                <span className={styles.tubeBtnLabel}>4 tubes</span>
                <span className={`bh-tnum ${styles.tubeBtnPrice}`}>${product.price * 4 - 8} · save $8</span>
              </button>
              <button className={styles.tubeBtn}>
                <span className={styles.tubeBtnLabel}>Case (10)</span>
                <span className={`bh-tnum ${styles.tubeBtnPrice}`}>${product.price * 10 - 44} · save $44</span>
              </button>
            </div>
          </div>

          <div className={styles.qtyRow}>
            <div className={styles.qty}>
              <button aria-label="Decrease quantity">−</button>
              <span className={`bh-tnum ${styles.qtyVal}`}>1</span>
              <button aria-label="Increase quantity">+</button>
            </div>
            <button className="bh-btn bh-btn--lg" style={{ flex: 1 }}>
              Add to Cart — ${product.price}
            </button>
          </div>

          <div className={styles.assurances}>
            <span>✓ Free shipping over $99</span>
            <span>✓ Climate-matched speed</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
