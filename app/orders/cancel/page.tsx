"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function OrderCancelPage() {
  return (
    <div>
      <Nav />

      <section
        style={{
          padding: "96px 20px",
          textAlign: "center",
          maxWidth: 560,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            lineHeight: 1.02,
            marginBottom: 12,
          }}
        >
          Order cancelled.
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--bh-gray-700)",
            marginBottom: 48,
            maxWidth: 440,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          No charge was made. Your cart is still here when you&rsquo;re ready.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 320,
            margin: "0 auto",
          }}
        >
          <Link href="/checkout">
            <button className="bh-btn bh-btn--lg bh-btn--block">
              Back to checkout →
            </button>
          </Link>
          <Link href="/cart">
            <button className="bh-btn bh-btn--lg bh-btn--block bh-btn--ghost">
              Back to cart
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
