"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-store";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessInner />
    </Suspense>
  );
}

function OrderSuccessInner() {
  const sp = useSearchParams();
  const orderId = sp.get("order_id");
  const clearCart = useCart((s) => s.clear);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const shortId =
    orderId && orderId.length >= 8
      ? orderId.slice(-8).toUpperCase()
      : orderId
        ? orderId.toUpperCase()
        : "received";

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
          Order placed.
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--bh-gray-400)",
            marginBottom: 8,
          }}
        >
          Confirmation #{shortId}
        </p>
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
          We just emailed your receipt and will send shipping updates as your order moves.
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
          <Link href="/shop">
            <button className="bh-btn bh-btn--lg bh-btn--block">
              Continue shopping →
            </button>
          </Link>
          <Link href="/account/orders">
            <button className="bh-btn bh-btn--lg bh-btn--block bh-btn--ghost">
              View orders
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
