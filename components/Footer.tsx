import { Wordmark } from "./Wordmark";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Wordmark size={28} />
          <p className={styles.tagline}>
            Built for the smash. Lower prices, cleaner site, faster checkout — for American badminton.
          </p>
        </div>
        <div className={styles.subscribe}>
          <input className="bh-input" placeholder="Email for restocks & drops" />
          <button className="bh-btn">Subscribe</button>
        </div>
      </div>

      <hr className="bh-hr" />

      <div className={styles.bottom}>
        <span>© 2026 BattyHub. Shipped from Los Angeles.</span>
        <div className={styles.links}>
          <a>Shipping</a>
          <a>Returns</a>
          <a>Contact</a>
        </div>
      </div>
    </footer>
  );
}
