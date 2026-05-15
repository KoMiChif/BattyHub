import { RacketGlyph, ShuttleGlyph } from "./glyphs";
import type { CSSProperties, ReactNode } from "react";

type PlaceImgProps = {
  ratio?: string;
  glyph?: "shuttle" | "racket" | "none";
  tone?: "light" | "mid" | "dark";
  style?: CSSProperties;
  children?: ReactNode;
};

export function PlaceImg({ ratio = "1/1", glyph = "shuttle", tone = "light", style, children }: PlaceImgProps) {
  const bg = tone === "dark" ? "#1a1a1a" : tone === "mid" ? "#ECECEC" : "var(--bh-gray-100)";
  const Glyph = glyph === "racket" ? RacketGlyph : glyph === "none" ? null : ShuttleGlyph;
  const glyphColor = tone === "dark" ? "#fff" : "#000";
  const glyphOpacity = tone === "dark" ? 0.06 : 0.07;

  return (
    <div
      className="bh-img"
      style={{
        aspectRatio: ratio,
        width: "100%",
        background: bg,
        ...style,
      }}
    >
      {Glyph && <Glyph opacity={glyphOpacity} color={glyphColor} />}
      {children}
    </div>
  );
}
