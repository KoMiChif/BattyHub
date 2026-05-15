import Link from "next/link";
import { Wordmark } from "./Wordmark";
import styles from "./Nav.module.css";

type NavProps = {
  cartCount?: number;
  transparent?: boolean;
};

export function Nav({ cartCount = 0, transparent = false }: NavProps) {
  return (
    <header
      className={`${styles.nav} ${transparent ? styles.transparent : ""}`}
    >
      {/* Desktop left nav */}
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
        <span className={`${styles.subtle} bh-show-md`}>Account</span>
        <Link href="/cart" className={styles.cart}>
          Cart
          <span className={`${styles.cartBadge} bh-tnum`}>
            {cartCount}
          </span>
        </Link>
      </nav>
    </header>
  );
}
