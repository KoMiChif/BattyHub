import { fmtUsd } from "@/lib/cart";

type SummaryProps = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export function CartSummary({ subtotal, shipping, tax, total }: SummaryProps) {
  return (
    <>
      <Row label="Subtotal" value={fmtUsd(subtotal)} />
      <Row label="Shipping" value={shipping === 0 ? "Free" : fmtUsd(shipping)} />
      <Row label="Estimated tax" value={fmtUsd(tax)} muted />
      <div style={{ height: 1, background: "var(--bh-gray-200)", margin: "14px 0" }} />
      <Row label="Total" value={fmtUsd(total)} big />
    </>
  );
}

function Row({ label, value, muted, big }: { label: string; value: string; muted?: boolean; big?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontSize: big ? 18 : 14,
        padding: "6px 0",
        color: muted ? "var(--bh-gray-400)" : "#000",
        fontWeight: big ? 600 : 400,
        fontFamily: big ? "var(--bh-font-display)" : "var(--bh-font-text)",
      }}
    >
      <span>{label}</span>
      <span className="bh-tnum">{value}</span>
    </div>
  );
}
