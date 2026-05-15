import Link from "next/link";
import { PlaceImg } from "./PlaceImg";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  p: Product;
  size?: "sm" | "md";
};

export function ProductCard({ p, size = "md" }: ProductCardProps) {
  const isSm = size === "sm";
  return (
    <Link href={`/product/${p.id}`} style={{ display: "block", color: "inherit" }}>
      <PlaceImg ratio="1/1" glyph="shuttle" />
      <div style={{ padding: isSm ? "12px 0 0" : "16px 0 0" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--bh-gray-400)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          {p.brand}
        </div>
        <div
          style={{
            fontFamily: "var(--bh-font-display)",
            fontWeight: 600,
            fontSize: isSm ? 16 : 18,
            letterSpacing: "-0.01em",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            style={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {p.name}
          </span>
          <span className="bh-tnum" style={{ flexShrink: 0 }}>
            {p.sale ? (
              <>
                <span
                  style={{
                    color: "var(--bh-gray-400)",
                    textDecoration: "line-through",
                    fontSize: isSm ? 13 : 14,
                    marginRight: 6,
                    fontWeight: 400,
                  }}
                >
                  ${p.price}
                </span>
                <span className="bh-sale">${p.sale}</span>
              </>
            ) : (
              <>${p.price}</>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
