import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PlaceImg } from "@/components/PlaceImg";
import { CartSummary } from "@/components/CartSummary";
import { SAMPLE_CART, cartTotals, fmtUsd } from "@/lib/cart";
import styles from "./page.module.css";

export default function CartPage() {
  const lines = SAMPLE_CART;
  const totals = cartTotals(lines);

  return (
    <div>
      <Nav cartCount={lines.length} />

      <section className={styles.title}>
        <h1>Cart.</h1>
        <span className="bh-tnum">{lines.length} items</span>
      </section>

      <section className={styles.layout}>
        <div>
          <div className={styles.lines}>
            {lines.map((l) => (
              <div key={l.id} className={styles.line}>
                <div>
                  <PlaceImg ratio="1/1" glyph="shuttle" />
                </div>
                <div>
                  <div className={styles.lineBrand}>{l.brand}</div>
                  <div className={styles.lineName}>{l.name}</div>
                  <div className={styles.lineMeta}>{l.meta}</div>
                  <div className={styles.lineControls}>
                    <div className={styles.qty}>
                      <button aria-label="Decrease">−</button>
                      <span className={`bh-tnum ${styles.qtyVal}`}>{l.qty}</span>
                      <button aria-label="Increase">+</button>
                    </div>
                    <a className={styles.removeLink}>Remove</a>
                  </div>
                </div>
                <div className={`bh-tnum ${styles.linePrice}`}>
                  {fmtUsd(l.price * l.qty)}
                </div>
              </div>
            ))}
          </div>
          <Link href="/shop" className={styles.continueShopping}>← Continue shopping</Link>
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryTitle}>Summary</div>
          <CartSummary {...totals} />
          <Link href="/checkout">
            <button className="bh-btn bh-btn--lg bh-btn--block" style={{ marginTop: 20 }}>
              Checkout →
            </button>
          </Link>
          <div className={styles.payNote}>Apple Pay · Card · Shop Pay</div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
