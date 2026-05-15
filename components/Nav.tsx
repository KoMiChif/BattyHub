"use client";

import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import styles from "./Nav.module.css";

type NavProps = {
  transparent?: boolean;
};

export function Nav({ transparent = false }: NavProps) {
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const user = useAuth((s) => s.user);
  const accountHref = user ? "/account" : "/login";
  const accountLabel = user ? user.name?.split(" ")[0] || "Account" : "Sign in";

  return (
    <header className={`${styles.nav} ${transparent ? styles.transparent : ""}`}>
      <nav className={`${styles.left} bh-hide-md`}>
        <div className={styles.hamburger} aria-label="Menu">
          <span />
          <span />
        </div>
      </nav>
      <nav className={`${styles.left} ${styles.leftDesktop}`}>
        <Link href="/shop">Shop</Link>
        <Link href="/shop?tier=Tournament" style={{ opacity: 0.55 }}>Tournament</Link>
        <Link href="/shop?tier=Club"       style={{ opacity: 0.55 }}>Club</Link>
        <Link href="/shop?tier=Practice"   style={{ opacity: 0.55 }}>Practice</Link>
      </nav>

      <div className={styles.center}>
        <Link href="/">
          <Wordmark size={20} color={transparent ? "#fff" : "#000"} />
        </Link>
      </div>

      <nav className={styles.right}>
        <span className={`${styles.subtle} bh-show-md`}>Search</span>
        <Link href={accountHref} className="bh-show-md">
          {accountLabel}
        </Link>
        <Link href="/cart" className={styles.cart}>
          Cart
          <span className={`${styles.cartBadge} bh-tnum`}>{cartCount}</span>
        </Link>
      </nav>
    </header>
  );
}
