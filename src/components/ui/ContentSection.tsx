import type { ReactNode } from "react";
import Reveal from "../motion/Reveal";
import { slugify } from "../../lib/slugify";

const headingClass = "font-sans text-[21px] sm:text-[23px] font-semibold tracking-tight text-ink scroll-mt-28";

/**
 * Headed prose block used by every detail page (case studies, AI Lab
 * entries, training courses). The heading gets an id so the AI Lab's
 * "On this page" column can list and link to it. Revealed on scroll like
 * every other standalone block.
 */
export default function ContentSection({ heading, body, id }: { heading: string; body?: string; id?: string }) {
  if (!body) return null;
  return (
    <Reveal>
      <section className="flex flex-col gap-3">
        <h2 id={id ?? slugify(heading)} className={headingClass}>
          {heading}
        </h2>
        <p className="text-[15.5px] leading-[1.75] text-on-surface-variant whitespace-pre-line">{body}</p>
      </section>
    </Reveal>
  );
}

/** Heading for non-prose detail blocks (chips, lists, cards) — same look and anchor as ContentSection. */
export function BlockLabel({ children, id }: { children: string; id?: string }) {
  return (
    <h2 id={id ?? slugify(children)} className={headingClass}>
      {children}
    </h2>
  );
}

/** Bulleted list block with a heading, e.g. use cases, failure modes, strengths. */
export function ListSection({
  heading,
  items,
  marker = "▸",
  id,
}: {
  heading: string;
  items?: string[];
  marker?: ReactNode;
  id?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <Reveal>
      <section className="flex flex-col gap-3">
        <BlockLabel id={id}>{heading}</BlockLabel>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-on-surface-variant">
              <span className="text-primary mt-[1px] shrink-0">{marker}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}
