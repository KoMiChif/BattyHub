"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { fmtPrice, type Product } from "@/lib/api";
import styles from "@/app/product/[slug]/page.module.css";

type Tube = { tubes: number; label: string; unitPriceMultiplier: number; discount: number };

const TUBE_OPTIONS: Tube[] = [
  { tubes: 1,  label: "1 tube",       unitPriceMultiplier: 1,  discount: 0 },
  { tubes: 4,  label: "4 tubes",      unitPriceMultiplier: 4,  discount: 8 },
  { tubes: 10, label: "Case (10)",    unitPriceMultiplier: 10, discount: 44 },
];

export function AddToCart({ product }: { product: Product }) {
  const [tubes, setTubes] = useState<number>(1);
  const [qty, setQty] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const addLine = useCart((s) => s.addLine);

  const basePrice = product.salePrice ?? product.price;
  const selectedOption = TUBE_OPTIONS.find((o) => o.tubes === tubes) ?? TUBE_OPTIONS[0];
  const lineUnitPrice = basePrice * selectedOption.unitPriceMultiplier - selectedOption.discount;

  function handleAdd() {
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: lineUnitPrice,
      meta: `${product.tier ?? "—"} · Speed ${product.speed ?? "—"} · ${selectedOption.label}`,
      imageUrl: product.imageUrl,
      qty,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  const outOfStock = product.stock <= 0;

  return (
    <>
      <div className={styles.tubeGroup}>
        <div className="bh-label">
          Quantity · {selectedOption.label === "1 tube" ? "1 tube of 12" : selectedOption.label}
        </div>
        <div className={styles.tubeButtons}>
          {TUBE_OPTIONS.map((opt) => {
            const optPrice = basePrice * opt.unitPriceMultiplier - opt.discount;
            const isActive = opt.tubes === tubes;
            return (
              <button
                key={opt.tubes}
                onClick={() => setTubes(opt.tubes)}
                className={`${styles.tubeBtn} ${isActive ? styles.tubeBtnActive : ""}`}
                type="button"
              >
                <span className={styles.tubeBtnLabel}>{opt.label}</span>
                <span className={`bh-tnum ${styles.tubeBtnPrice}`}>
                  {fmtPrice(optPrice)}
                  {opt.discount > 0 && ` · save $${opt.discount}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.qtyRow}>
        <div className={styles.qty}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
          <span className={`bh-tnum ${styles.qtyVal}`}>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
        </div>
        <button
          className="bh-btn bh-btn--lg"
          style={{ flex: 1 }}
          disabled={outOfStock}
          onClick={handleAdd}
        >
          {outOfStock
            ? "Out of stock"
            : justAdded
              ? "Added ✓"
              : `Add to Cart — ${fmtPrice(lineUnitPrice * qty)}`}
        </button>
      </div>
    </>
  );
}
