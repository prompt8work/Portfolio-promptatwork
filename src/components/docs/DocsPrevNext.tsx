"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { flattenPages, useAiLabNav, useProjectSeries } from "./AiLabNavContext";

/**
 * Previous / next page. Inside a project series (a case study and the
 * entries that document its parts) it moves through that project only, so
 * a reader finishes one project before anything else. Elsewhere it follows
 * sidebar order, so the whole hub reads straight through.
 */
export default function DocsPrevNext() {
  const pathname = usePathname();
  const groups = useAiLabNav();
  const series = useProjectSeries(pathname);
  const pages = series ? series.pages : flattenPages(groups);
  const i = pages.findIndex((p) => p.href === pathname);
  if (i === -1) return null;
  const prev = pages[i - 1];
  const next = pages[i + 1];
  if (!prev && !next) return null;
  const scope = series ? " IN THIS PROJECT" : "";

  const card =
    "motion-btn flex-1 min-w-[200px] rounded-xl border border-neutral-200 bg-white px-5 py-4 hover:border-plum-300";
  return (
    <nav aria-label="Previous and next" className="mt-16 pt-8 border-t border-neutral-200 flex flex-wrap gap-4">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="block font-mono text-[10.5px] tracking-[0.12em] text-neutral-500">← PREVIOUS{scope}</span>
          <span className="block mt-1 text-[15px] font-medium text-neutral-900">{prev.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next && (
        <Link href={next.href} className={`${card} text-right`}>
          <span className="block font-mono text-[10.5px] tracking-[0.12em] text-neutral-500">NEXT{scope} →</span>
          <span className="block mt-1 text-[15px] font-medium text-neutral-900">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
