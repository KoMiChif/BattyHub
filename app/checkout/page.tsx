"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { PlaceImg } from "@/components/PlaceImg";
import { CartSummary } from "@/components/CartSummary";
import { useCartTotals } from "@/lib/cart-store";
import { fmtUsd } from "@/lib/cart";
import styles from "./page.module.css";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { lines, subtotal, shipping, tax, total } = useCartTotals();

  if (!mounted) {
    return (
      <div>
        <header className={styles.header}>
          <Wordmark size={20} />
          <span className={styles.headerNote}>Secure checkout · 256-bit SSL</span>
        </header>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div>
        <header className={styles.header}>
          <Wordmark size={20} />
          <span className={styles.headerNote}>Secure checkout · 256-bit SSL</span>
        </header>
        <div style={{ padding: "96px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 18, marginBottom: 16 }}>Cart is empty.</p>
          <Link href="/shop">
            <button className="bh-btn bh-btn--lg">Shop shuttles →</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className={styles.header}>
        <Wordmark size={20} />
        <span className={styles.headerNote}>Secure checkout · 256-bit SSL</span>
      </header>

      <button className={styles.mobileSummaryToggle}>
        <span>
          Show order summary ({lines.length})
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </span>
        <span className="bh-tnum">{fmtUsd(total)}</span>
      </button>

      <section className={styles.layout}>
        <div>
          <div className={styles.expressOnDesktop}>
            <div className="bh-label">Express checkout</div>
            <ExpressButtons />
            <DividerOr />
          </div>

          <div className={styles.expressOnMobile}>
            <ExpressButtons />
            <DividerOr />
          </div>

          <FormSection title="Contact">
            <Field label="Email">
              <input className="bh-input" defaultValue="" placeholder="you@example.com" />
            </Field>
          </FormSection>

          <FormSection title="Shipping address">
            <Field label="Country / Region">
              <input className="bh-input" defaultValue="United States" />
            </Field>
            <div className={styles.row2}>
              <Field label="First name">
                <input className="bh-input" placeholder="First name" />
              </Field>
              <Field label="Last name">
                <input className="bh-input" placeholder="Last name" />
              </Field>
            </div>
            <Field label="Address">
              <input className="bh-input" placeholder="123 Main St" />
            </Field>
            <div className={styles.row3}>
              <Field label="City">
                <input className="bh-input" placeholder="City" />
              </Field>
              <Field label="State">
                <input className="bh-input" placeholder="State" />
              </Field>
              <Field label="ZIP">
                <input className="bh-input" placeholder="ZIP" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Payment">
            <Field label="Card number">
              <div className={`bh-input ${styles.cardField}`}>
                <span className="bh-tnum">4242 4242 4242 4242</span>
                <div className={styles.cardBrands}>
                  <span className={styles.cardBrand}>VISA</span>
                  <span className={styles.cardBrand}>MC</span>
                  <span className={styles.cardBrand}>AMEX</span>
                </div>
              </div>
            </Field>
            <div className={styles.row2}>
              <Field label="Expiry">
                <div className="bh-input bh-tnum">12 / 28</div>
              </Field>
              <Field label="CVC">
                <div className="bh-input bh-tnum">123</div>
              </Field>
            </div>
            <Field label="Name on card">
              <input className="bh-input" placeholder="Name as it appears on card" />
            </Field>
            <div className={styles.paymentNote}>
              Payments processed by Stripe. Your card details never touch our servers.
            </div>
          </FormSection>

          <button
            className={`bh-btn bh-btn--lg bh-btn--block ${styles.placeOrderBtn}`}
            onClick={() => alert("TODO: POST /api/orders/checkout → redirect to Stripe")}
          >
            Place Order · {fmtUsd(total)}
          </button>

          <div className={styles.secureNote}>
            Stripe-secured. Your details never touch our servers.
          </div>
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryTitle}>Order ({lines.length})</div>
          {lines.map((l) => (
            <div key={l.slug} className={styles.summaryLine}>
              <div className={styles.summaryThumb}>
                <PlaceImg ratio="1/1" glyph="shuttle" />
                <span className={`bh-tnum ${styles.summaryQty}`}>{l.qty}</span>
              </div>
              <div>
                <div className={styles.summaryName}>{l.name}</div>
                <div className={styles.summaryMeta}>{l.meta}</div>
              </div>
              <div className={`bh-tnum ${styles.summaryPrice}`}>{fmtUsd(l.price * l.qty)}</div>
            </div>
          ))}

          <div className={styles.discountRow}>
            <input className="bh-input" placeholder="Discount code" />
            <button className="bh-btn bh-btn--ghost" style={{ padding: "14px 20px" }}>
              Apply
            </button>
          </div>

          <CartSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
        </aside>
      </section>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.fields}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span className="bh-label">{label}</span>
      {children}
    </label>
  );
}

function ExpressButtons() {
  return (
    <div className={styles.expressGrid}>
      <button className={styles.applePayBtn}>
        <ApplePayLogo /> Pay
      </button>
      <button className={styles.shopPayBtn}>shop Pay</button>
    </div>
  );
}

function DividerOr() {
  return (
    <div className={styles.divider}>
      <span />
      <span>or pay with card</span>
      <span />
    </div>
  );
}

function ApplePayLogo() {
  return (
    <svg width="36" height="14" viewBox="0 0 36 14" fill="currentColor" aria-hidden>
      <path d="M6.4 1.7c-.4.5-1.1.9-1.7.8-.1-.7.2-1.4.6-1.9.4-.5 1.1-.9 1.7-.9.1.7-.2 1.5-.6 2zM7 2.7c-1 0-1.8.5-2.3.5-.5 0-1.2-.5-2-.5C1.7 2.8.7 3.4.2 4.4c-1.1 1.9-.3 4.7.8 6.3.5.7 1.1 1.5 2 1.5.8 0 1.1-.5 2.1-.5 1 0 1.3.5 2.1.5.9 0 1.5-.7 2-1.5.6-.8.9-1.7.9-1.7s-1.7-.7-1.7-2.7c0-1.7 1.4-2.5 1.4-2.5C9 2.7 8 2.7 7 2.7z" />
      <path d="M16 1.5c1.9 0 3.3 1.3 3.3 3.2 0 1.9-1.4 3.2-3.4 3.2h-2.1V11h-1.7V1.5h3.9zm-2.2 5h1.7c1.3 0 2.1-.7 2.1-2s-.8-2-2.1-2h-1.7v4zM19.8 8.8c0-1.4 1.1-2.2 3-2.3l2.2-.1V5.8c0-.9-.6-1.4-1.6-1.4-.9 0-1.5.4-1.7 1.1h-1.6c.1-1.4 1.3-2.4 3.3-2.4 2 0 3.3 1 3.3 2.7v4.3c0 1 0 1 .1 1.4h-1.6l-.1-1.1c-.5.7-1.4 1.2-2.5 1.2-1.7 0-2.8-1.1-2.8-2.8zm5.2-.7v-.6l-2 .1c-1 .1-1.5.5-1.5 1.2 0 .7.6 1.2 1.5 1.2 1.2 0 2-.8 2-1.9zM27.7 13.4v-1.3c.1 0 .4.1.5.1.8 0 1.2-.3 1.5-1.2l.2-.5L26.9 3h1.8l2 6.5h.1L32.8 3h1.7l-3.1 8.6c-.7 2-1.5 2.7-3.2 2.7-.1 0-.4 0-.5-.1z" />
    </svg>
  );
}
