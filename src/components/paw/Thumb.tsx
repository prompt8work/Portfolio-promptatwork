import type { ReactNode } from "react";
import Image from "next/image";

// Token-built 16:9 artwork for anything without its own image (paw-thumb):
// a radial accent wash, a faint dot grid, a mono kicker, a short title and
// one line glyph. Always dark, in both themes — thumbnails are content.
// With `image` (a generated or uploaded card image, src/lib/card-images)
// the picture fills the thumb and the glyph is dropped; kicker, word and
// children still sit on top, over a scrim that keeps them legible.

export type ThumbVariant = "blue" | "violet" | "warm" | "teal" | "mono";
export type ThumbGlyph = "code" | "network" | "flow" | "layers" | "orbit" | "terminal";

const glyphs: Record<ThumbGlyph, ReactNode> = {
  code: <path d="M16 10 6 24l10 14M32 10l10 14-10 14M27 8l-6 32" strokeWidth="2.4" strokeLinecap="round" />,
  network: (
    <>
      <circle cx="10" cy="24" r="5" />
      <circle cx="38" cy="10" r="5" />
      <circle cx="38" cy="38" r="5" />
      <path d="M15 22 33 12M15 26l18 10M38 15v18" />
    </>
  ),
  flow: (
    <>
      <rect x="4" y="18" width="12" height="12" rx="3" />
      <rect x="32" y="6" width="12" height="12" rx="3" />
      <rect x="32" y="30" width="12" height="12" rx="3" />
      <path d="M16 24h8m0 0V12h8M24 24v12h8" />
    </>
  ),
  layers: (
    <>
      <path d="M24 6 6 15l18 9 18-9z" />
      <path d="m6 24 18 9 18-9" />
      <path d="m6 33 18 9 18-9" />
    </>
  ),
  orbit: (
    <>
      <circle cx="24" cy="24" r="6" />
      <ellipse cx="24" cy="24" rx="20" ry="8" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
    </>
  ),
  terminal: <path d="m10 34 12-10-12-10M26 38h14" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
};

export default function Thumb({
  variant = "blue",
  glyph,
  kicker,
  word,
  aspect = "16 / 9",
  className = "",
  image,
  sizes = "(max-width: 768px) 100vw, 33vw",
  children,
}: {
  variant?: ThumbVariant;
  glyph?: ThumbGlyph;
  kicker?: string;
  word?: string;
  aspect?: string;
  className?: string;
  image?: string;
  sizes?: string;
  children?: ReactNode;
}) {
  return (
    <div data-theme="dark" className={`paw-thumb paw-thumb--${variant} ${className}`} style={{ aspectRatio: aspect }}>
      {image && (
        <>
          <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
          {(kicker || word || children) && <div className="paw-thumb__scrim" aria-hidden="true" />}
        </>
      )}
      {glyph && !image && (
        <svg className="paw-thumb__glyph" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          {glyphs[glyph]}
        </svg>
      )}
      {(kicker || word) && (
        <div className="paw-thumb__art">
          {kicker && <span className="paw-thumb__kicker">{kicker}</span>}
          {word && <span className="paw-thumb__word">{word}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
