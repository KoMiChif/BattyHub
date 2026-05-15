"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PlaceImg } from "@/components/PlaceImg";
import { CartSummary } from "@/components/CartSummary";
import { useCart, useCartTotals } from "@/lib/cart-store";
import { fmtUsd } from "@/lib/cart";
import styles from "./page.module.css";

export default function CartPage() {
  // Avoid hydration mismatch: render the SSR skeleton (count 0) until mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { lines, subtotal, shipping, tax, total } = useCartTotals();
  const setQty = useCart((s) => s.setQty);
  const removeLine = useCart((s) => s.removeLine);

  if (!mounted) {
    return (
      <div>
        <Nav />
        <section className={styles.title}>
          <h1>Cart.</h1>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Nav />

      <section className={styles.title}>
        <h1>Cart.</h1>
        <span className="bh-tnum">{lines.length} items</span>
      </section>

      {lines.length === 0 ? (
        <section style={{ padding: "64px 20px 96px", textAlign: "center" }}>
          <p style={{ fontSize: 18, marginBottom: 16 }}>Your cart is empty.</p>
          <Link href="/shop">
            <button className="bh-btn bh-btn--lg">Shop shuttles →</button>
          </Link>
        </section>
      ) : (
        <section className={styles.layout}>
          <div>
            <div className={styles.lines}>
              {lines.map((l) => (
                <div key={l.slug} className={styles.line}>
                  <div>
                    <PlaceImg ratio="1/1" glyph="shuttle" />
                  </div>
                  <div>
                    <div className={styles.lineBrand}>{l.brand}</div>
                    <div className={styles.lineName}>{l.name}</div>
                    <div className={styles.lineMeta}>{l.meta}</div>
                    <div className={styles.lineControls}>
                      <div className={styles.qty}>
                        <button onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Decrease">−</button>
                        <span className={`bh-tnum ${styles.qtyVal}`}>{l.qty}</span>
                        <button onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Increase">+</button>
                      </div>
                      <button
                        onClick={() => removeLine(l.slug)}
                        className={styles.removeLink}
                        style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className={`bh-tnum ${styles.linePrice}`}>{fmtUsd(l.price * l.qty)}</div>
                </div>
              ))}
            </div>
            <Link href="/shop" className={styles.continueShopping}>← Continue shopping</Link>
          </div>

          <aside className={styles.summary}>
            <div className={styles.summaryTitle}>Summary</div>
            <CartSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            <Link href="/checkout">
              <button className="bh-btn bh-btn--lg bh-btn--block" style={{ marginTop: 20 }}>
                Checkout →
              </button>
            </Link>
            <div className={styles.payNote}>Apple Pay · Card · Shop Pay</div>
          </aside>
        </section>
      )}

      <Footer />
    </div>
  );
}
