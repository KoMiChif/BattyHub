type GlyphProps = {
  opacity?: number;
  color?: string;
  rotate?: number;
};

export function RacketGlyph({ rotate = 35, opacity = 0.08, color = "#000" }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        transform: `rotate(${rotate}deg) scale(0.9)`,
        opacity,
        color,
      }}
    >
      <ellipse cx="80" cy="80" rx="46" ry="56" fill="none" stroke="currentColor" strokeWidth="3" />
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.85">
        {[...Array(11)].map((_, i) => (
          <line key={"v" + i} x1={80 + (i - 5) * 8} y1={80 - 54} x2={80 + (i - 5) * 8} y2={80 + 54} />
        ))}
        {[...Array(13)].map((_, i) => (
          <line key={"h" + i} x1={80 - 44} y1={80 + (i - 6) * 8} x2={80 + 44} y2={80 + (i - 6) * 8} />
        ))}
      </g>
      <ellipse cx="80" cy="80" rx="46" ry="56" fill="none" stroke="currentColor" strokeWidth="4" />
      <rect x="76" y="134" width="8" height="6" fill="currentColor" />
      <line x1="80" y1="140" x2="160" y2="200" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
      <rect x="146" y="190" width="22" height="18" fill="currentColor" transform="rotate(36 157 199)" />
    </svg>
  );
}

export function ShuttleGlyph({ opacity = 0.08, color = "#000" }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, color }}
    >
      <circle cx="100" cy="64" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M78 64 L40 150 M86 80 L60 156 M94 84 L82 160 M106 84 L118 160 M114 80 L140 156 M122 64 L160 150"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path d="M40 150 Q100 178 160 150 L100 168 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
