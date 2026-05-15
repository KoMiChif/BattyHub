"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-store";
import styles from "../account.module.css";

export default function AccountPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const clearSession = useAuth((s) => s.clearSession);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !user) router.replace("/login?next=/account");
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div>
        <Nav />
        <section className={styles.accountLayout}>
          <h1 className={styles.accountTitle}>Account.</h1>
        </section>
        <Footer />
      </div>
    );
  }

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <div>
      <Nav />
      <section className={styles.accountLayout}>
        <h1 className={styles.accountTitle}>Account.</h1>
        <p className={styles.accountSubtitle}>
          Signed in as <strong>{user.email}</strong>.
        </p>

        <div className={styles.infoBlock}>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Name</span>
            <span className={styles.infoVal}>{user.name ?? "—"}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Email</span>
            <span className={styles.infoVal}>{user.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Role</span>
            <span className={styles.infoVal}>{user.role}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/shop">
            <button className="bh-btn">Continue shopping</button>
          </Link>
          <button onClick={handleLogout} className="bh-btn bh-btn--ghost">
            Sign out
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
