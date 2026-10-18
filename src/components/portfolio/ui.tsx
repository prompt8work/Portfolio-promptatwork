import Link from "next/link";
import type { ReactNode } from "react";
import type { Cta } from "../../lib/portfolio";

// Shared pieces for the portfolio pages. Originally the site's one dark
// area (Docs/design/poc/*.html); now on the Luminous SaaS tokens, so they
// follow the light/dark toggle like every rebuilt page.

export const card = "rounded-[20px] border border-line bg-card/60";
export const cardStrong = "rounded-3xl border border-outline-variant bg-card/60";
export const muted = "text-muted";
export const faint = "text-outline";
export const eyebrow = "font-mono text-xs uppercase tracking-wider text-primary";
export const tag = "rounded-full border border-outline-variant px-3 py-1 text-[13px] text-muted";
export const gradientText = "bg-linear-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent";

/** Renders "*word*" segments as gradient-highlighted text. */
export function Highlight({ text, className = gradientText }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className={className}>
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

const ctaStyles = {
  primary:
    "inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-accent-blue to-accent-violet font-semibold text-white shadow-[var(--glow-sm)] motion-btn hover:shadow-[var(--glow-md)] hover:text-white",
  secondary:
    "inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-ink/[0.03] font-semibold text-ink motion-btn hover:border-primary hover:text-ink",
  link: "text-sm font-semibold text-primary hover:underline",
};

export function CtaButton({ cta, small = false }: { cta?: Cta; small?: boolean }) {
  if (!cta?.label || !cta.href) return null;
  const style = cta.style ?? "secondary";
  const size = style === "link" ? "" : small ? "px-3.5 py-2 text-sm rounded-[10px]" : "px-5 py-3 text-[15px]";
  const className = `${ctaStyles[style]} ${size}`;
  // In-page anchors are plain links; everything else goes through next/link.
  return cta.href.startsWith("#") ? (
    <a href={cta.href} className={className}>
      {cta.label}
    </a>
  ) : (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

export function CtaRow({ ctas, small = false, className = "" }: { ctas?: Cta[]; small?: boolean; className?: string }) {
  if (!ctas?.length) return null;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {ctas.map((c, i) => (
        <CtaButton key={c._key ?? i} cta={c} small={small} />
      ))}
    </div>
  );
}

export function SectionHead({ eyebrow: label, title, intro }: { eyebrow?: string; title?: string; intro?: string }) {
  if (!label && !title && !intro) return null;
  return (
    <div className="mx-auto mb-10 max-w-[740px] text-center">
      {label && <span className={eyebrow}>{label}</span>}
      {title && <h2 className="mt-2.5 mb-3 text-[clamp(26px,3.4vw,38px)] leading-tight font-bold tracking-tight text-ink">{title}</h2>}
      {intro && <p className={`text-[17px] ${muted}`}>{intro}</p>}
    </div>
  );
}

/** Full-width band; `alt` adds the slightly lighter striped background. */
export function Band({ id, alt, children, className = "" }: { id?: string; alt?: boolean; children: ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-[72px] ${alt ? "border-y border-line bg-linear-to-b from-surface-container-low/70 to-surface-container-low/20" : ""} ${className}`}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">{children}</div>
    </section>
  );
}

export function Tags({ items, className = "" }: { items?: string[]; className?: string }) {
  if (!items?.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((t) => (
        <span key={t} className={tag}>
          {t}
        </span>
      ))}
    </div>
  );
}

export function TickList({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="grid gap-2.5">
      {items.map((p) => (
        <li key={p} className="flex items-start gap-3 rounded-xl border border-line bg-ink/[0.02] px-3.5 py-3 text-[15px] text-ink">
          <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full border border-secondary/50 bg-secondary/10 text-xs text-secondary">
            ✓
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}
