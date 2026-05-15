type WordmarkProps = {
  size?: number;
  color?: string;
};

export function Wordmark({ size = 18, color = "currentColor" }: WordmarkProps) {
  return (
    <div
      style={{
        fontFamily: "var(--bh-font-display)",
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "-0.04em",
        color,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <span>Batty</span>
      <span style={{ fontWeight: 500, opacity: 0.55 }}>Hub</span>
      <span
        style={{
          display: "inline-block",
          width: size * 0.34,
          height: size * 0.34,
          marginLeft: size * 0.22,
          background: color === "currentColor" ? "#000" : color,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
    </div>
  );
}
