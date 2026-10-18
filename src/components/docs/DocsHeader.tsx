import type { ReactNode } from "react";
import Link from "next/link";
import WordReveal from "../motion/WordReveal";
import IntroFade from "../motion/IntroFade";

/**
 * Opening of every AI Lab page below the Overview: mono eyebrow (the
 * group, or group / category), serif H1, lead paragraph, then optional
 * meta (tags, stats, links). Same CSS-only reveal as PageHeader.
 */
export default function DocsHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: ReactNode;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="pb-8 mb-10 border-b border-line flex flex-col gap-4">
      <IntroFade as="span" className="font-mono text-[11.5px] tracking-[0.14em] font-semibold text-primary uppercase">
        {eyebrow}
      </IntroFade>
      <WordReveal
        as="h1"
        className="text-[34px] sm:text-[44px] leading-[1.08] font-semibold tracking-tight text-ink"
      >
        {title}
      </WordReveal>
      {description && (
        <IntroFade as="p" after={title} step={1} className="text-[17px] leading-relaxed text-muted">
          {description}
        </IntroFade>
      )}
      {children && (
        <IntroFade after={title} step={2} className="flex flex-col gap-4 pt-1">
          {children}
        </IntroFade>
      )}
    </header>
  );
}

/** Small mono pill for tags, tech stack and variables on light docs pages. */
export function DocsTag({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[11.5px] text-on-surface-variant bg-card border border-line rounded-md px-2 py-0.5">
      {children}
    </span>
  );
}

/**
 * A heading + summary + link row, used by every group page to list its
 * entries inline. Wrap a run of them in one element so first: applies.
 */
export function DocsEntry({
  id,
  eyebrow,
  title,
  href,
  children,
  cta = "Read more",
}: {
  id: string;
  eyebrow?: ReactNode;
  title: string;
  href: string;
  children?: ReactNode;
  cta?: string;
}) {
  return (
    <section className="py-8 first:pt-0 border-t border-line first:border-t-0 flex flex-col gap-3">
      {eyebrow && (
        <span className="font-mono text-[10.5px] tracking-[0.14em] font-semibold text-muted uppercase">
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className="scroll-mt-28 font-sans text-[21px] sm:text-[22px] font-semibold tracking-tight leading-snug"
      >
        <Link href={href} className="text-ink hover:text-primary">
          {title}
        </Link>
      </h2>
      {children}
      <Link
        href={href}
        className="motion-arrow self-start inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-primary"
      >
        {cta}
        <svg
          className="motion-arrow-icon"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
