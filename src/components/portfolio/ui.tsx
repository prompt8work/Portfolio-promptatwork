import Link from "next/link";
import type { ReactNode } from "react";
import type { Cta } from "../../lib/portfolio";

// Shared pieces for the dark portfolio pages (Docs/design/poc/*.html are the
// approved designs). The portfolio is the site's one dark area — every
// other page stays light.

export const card = "rounded-[20px] border border-cyan-300/15 bg-[#102036]/60";
export const cardStrong = "rounded-3xl border border-cyan-300/30 bg-[#102036]/60";
export const muted = "text-[#9fb3c6]";
export const faint = "text-[#6f8599]";
export const eyebrow = "font-mono text-xs uppercase tracking-wider text-[#38c8e6]";
export const tag = "rounded-full border border-cyan-300/30 px-3 py-1 text-[13px] text-[#9fb3c6]";
export const gradientText = "bg-linear-to-r from-[#38c8e6] to-[#2fd39a] bg-clip-text text-transparent";

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
    "inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#38c8e6] to-[#2fd39a] font-semibold text-[#04131f] shadow-[0_8px_30px_rgba(47,211,154,0.25)] motion-btn hover:brightness-110 hover:text-[#04131f]",
  secondary:
    "inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-white/[0.03] font-semibold text-[#eaf2f8] motion-btn hover:border-[#38c8e6] hover:text-[#eaf2f8]",
  link: "text-sm font-semibold text-[#38c8e6] hover:underline",
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
      {title && <h2 className="mt-2.5 mb-3 text-[clamp(26px,3.4vw,38px)] leading-tight font-bold tracking-tight text-[#eaf2f8]">{title}</h2>}
      {intro && <p className={`text-[17px] ${muted}`}>{intro}</p>}
    </div>
  );
}

/** Full-width band; `alt` adds the slightly lighter striped background. */
export function Band({ id, alt, children, className = "" }: { id?: string; alt?: boolean; children: ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-[72px] ${alt ? "border-y border-cyan-300/15 bg-linear-to-b from-[#0a1a2e]/70 to-[#0a1a2e]/20" : ""} ${className}`}
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
        <li key={p} className="flex items-start gap-3 rounded-xl border border-cyan-300/15 bg-white/[0.02] px-3.5 py-3 text-[15px] text-[#eaf2f8]">
          <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full border border-[#2fd39a]/50 bg-[#2fd39a]/10 text-xs text-[#2fd39a]">
            ✓
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}
