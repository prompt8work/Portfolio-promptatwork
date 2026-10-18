import type { ReactNode } from "react";
import Link from "next/link";
import Thumb, { type ThumbGlyph, type ThumbVariant } from "./Thumb";

// A paw-card that only spends space on artwork when there's a real image.
// With `image`: the picture on top (kicker over it), the card's content
// below. Without one: no empty art block repeating the title; the content
// itself sits on the thumb's gradient, so the card stays compact.
// `children` are the card's paw-card__body / paw-card__foot blocks.
export default function ThumbCard({
  href,
  image,
  variant = "blue",
  glyph,
  kicker,
  aspect,
  sizes,
  className = "",
  children,
}: {
  href: string;
  image?: string;
  variant?: ThumbVariant;
  glyph?: ThumbGlyph;
  kicker?: string;
  aspect?: string;
  sizes?: string;
  className?: string;
  children: ReactNode;
}) {
  if (image) {
    return (
      <Link href={href} className={`paw-card h-full ${className}`}>
        <Thumb image={image} kicker={kicker} aspect={aspect} sizes={sizes} />
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} className={`paw-card h-full p-0 gap-0 overflow-hidden ${className}`}>
      <Thumb
        variant={variant}
        glyph={glyph}
        aspect="auto"
        className="h-full rounded-none flex flex-col gap-[var(--space-md)] px-3 pt-6 pb-6 [&_.paw-thumb__glyph]:w-9 [&_.paw-thumb__glyph]:h-9 [&>.paw-card__foot]:mt-auto"
      >
        {kicker && <span className="paw-thumb__kicker px-3 pr-16">{kicker}</span>}
        {children}
      </Thumb>
    </Link>
  );
}
