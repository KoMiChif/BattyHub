import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PlaceImg } from "@/components/PlaceImg";
import { AddToCart } from "@/components/AddToCart";
import { getProductBySlug, fmtPrice } from "@/lib/api";
import { MOCK_PRODUCTS } from "@/lib/products";
import styles from "./page.module.css";

export const revalidate = 60;

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const tierLabel = product.tier ?? product.brand;
  const description =
    product.description ||
    `${product.brand}'s ${(product.tier ?? "tournament").toLowerCase()}-grade shuttle. ` +
      `Hand-selected ${(product.feather ?? "feather").toLowerCase()} feathers — ` +
      `stable trajectory, true ${product.speed ?? "77"} speed for indoor halls 60–75°F.`;

  const specRows: [string, string][] = [
    ["Speed", `${product.speed ?? "77"} grain · standard warm`],
    ["Feather", `${product.feather ?? "Goose"} · grade A first-cut`],
    ["BWF Approved", "Yes · ITTF tournament legal"],
    ["Tube Count", "12 shuttles per tube"],
  ];

  return (
    <div>
      <Nav />

      <section className={styles.crumb}>
        Shop / {tierLabel} / {product.name}
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
          <div className={`bh-tnum ${styles.price}`}>
            {product.salePrice != null ? (
              <>
                <span
                  style={{
                    color: "var(--bh-gray-400)",
                    textDecoration: "line-through",
                    fontSize: "0.7em",
                    marginRight: 8,
                    fontWeight: 400,
                  }}
                >
                  {fmtPrice(product.price)}
                </span>
                <span className="bh-sale">{fmtPrice(product.salePrice)}</span>
              </>
            ) : (
              fmtPrice(product.price)
            )}
          </div>

          <p className={styles.desc}>{description}</p>

          <table className={styles.specTable}>
            <tbody>
              {specRows.map(([k, v]) => (
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

          <AddToCart product={product} />

          <div className={styles.assurances}>
            <span>✓ Free shipping over $99</span>
            <span>✓ Climate-matched speed</span>
            {product.stock > 0 && product.stock <= 5 && (
              <span style={{ color: "var(--bh-black)" }}>Only {product.stock} left</span>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
