"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-store";
import {
  centsToUsd,
  listMyOrders,
  type OrderListItem,
  type OrderStatus,
} from "@/lib/orders-api";
import styles from "../../account.module.css";

const DATE_FMT = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function formatOrderId(id: string): string {
  return "#" + id.slice(-8);
}

function countItems(order: OrderListItem): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function statusClass(status: OrderStatus): string {
  if (status === "PENDING") return styles.statusPending;
  if (status === "PAID" || status === "SHIPPED" || status === "DELIVERED") {
    return styles.statusActive;
  }
  return styles.statusInactive;
}

export default function OrdersPage() {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderListItem[] | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.replace("/login?next=/account/orders");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    listMyOrders(token).then((result) => {
      if (cancelled) return;
      if (result.error) {
        setError(result.error);
        setOrders(null);
      } else {
        setOrders(result.data ?? []);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [mounted, token, router]);

  if (!mounted || !token) {
    return (
      <div>
        <Nav />
        <section className={styles.accountLayout}>
          <h1 className={styles.accountTitle}>Your orders.</h1>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <section className={styles.accountLayout}>
        <h1 className={styles.accountTitle}>Your orders.</h1>
        <p className={styles.accountSubtitle}>
          All your past purchases, with status and totals.
        </p>

        {loading ? (
          <p className={styles.emptyText}>Loading…</p>
        ) : error ? (
          <div className={styles.errorBlock}>
            <p>Couldn&apos;t load orders.</p>
            <p>
              <Link href="/login?next=/account/orders">Sign in again →</Link>
            </p>
          </div>
        ) : orders && orders.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No orders yet.</p>
            <Link href="/shop">
              <button className="bh-btn">Start shopping →</button>
            </Link>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className={styles.infoBlock}>
            {orders.map((order) => {
              const itemCount = countItems(order);
              return (
                <div key={order.id} className={styles.orderRow}>
                  <div className={styles.orderTop}>
                    <span className={styles.orderId}>
                      {formatOrderId(order.id)}
                    </span>
                    <span className={styles.orderDate}>
                      {DATE_FMT.format(new Date(order.createdAt))}
                    </span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span
                      className={`${styles.statusChip} ${statusClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className={styles.orderItems}>
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                    <span className={styles.orderTotal}>
                      {centsToUsd(order.totalAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <Link href="/account" className={styles.backToAccount}>
          ← Back to account
        </Link>
      </section>
      <Footer />
    </div>
  );
}
