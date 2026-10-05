"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjectSeries } from "./AiLabNavContext";

const kindLabel: Record<string, string> = {
  project: "Case study",
  automation: "Automation",
  tool: "Tool",
  prompt: "Prompt",
  experiment: "Experiment",
};

/**
 * "This project's documentation": every page that documents the current
 * project, in reading order, with the current page marked. Renders nothing
 * on pages that aren't part of a project series.
 */
export default function DocsProjectParts({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const series = useProjectSeries(pathname);
  if (!series) return null;

  return (
    <nav aria-label={`${series.project} documentation`} className={`rounded-xl border border-neutral-200 bg-white p-4 ${className}`}>
      <p className="font-mono text-[10.5px] tracking-[0.12em] text-cyan-700 font-semibold">THIS PROJECT&apos;S DOCUMENTATION</p>
      <p className="mt-1 text-[14px] font-semibold text-neutral-900">{series.project}</p>
      <ol className="mt-3 flex flex-col gap-1">
        {series.pages.map((p, i) => {
          const current = p.href === pathname;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={current ? "page" : undefined}
                className={`flex gap-2.5 rounded-md px-2 py-1.5 text-[13.5px] leading-snug ${
                  current ? "bg-cyan-50 text-cyan-800 font-semibold" : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <span className="font-mono text-[11px] text-neutral-400 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-mono text-[10px] tracking-[0.08em] uppercase text-neutral-500">{kindLabel[p.kind] ?? p.kind}</span>
                  {p.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
