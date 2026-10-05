"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAiLabNav, useDocsLabel, type DocsGroup } from "./AiLabNavContext";
import DocsSearch from "./DocsSearch";

function isCurrent(pathname: string, href: string) {
  return !href.includes("#") && pathname === href;
}

function groupContains(pathname: string, g: DocsGroup) {
  return pathname === g.href || pathname.startsWith(`${g.href}/`) || g.items.some((i) => i.href === pathname);
}

function Tree({ onNavigate }: { onNavigate?: () => void }) {
  const groups = useAiLabNav();
  const label = useDocsLabel();
  const pathname = usePathname();
  // Start + the group you're in are open; the rest collapse so the tree
  // stays scannable. Manual toggles are remembered for the session.
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const isOpen = (g: DocsGroup, i: number) =>
    open[g.href] ?? (i === 0 || groupContains(pathname, g));

  return (
    <nav aria-label={label} className="flex flex-col gap-5">
      {groups.map((g, i) => {
        const expanded = isOpen(g, i);
        const listId = `docs-group-${i}`;
        return (
          <div key={g.href}>
            <div className="flex items-center justify-between gap-2">
              <Link
                href={g.href}
                onClick={onNavigate}
                className={`font-mono text-[11.5px] font-semibold tracking-[0.12em] uppercase ${
                  pathname === g.href ? "text-plum-600" : "text-neutral-800 hover:text-plum-600"
                }`}
              >
                {g.title}
              </Link>
              {g.items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [g.href]: !expanded }))}
                  aria-expanded={expanded}
                  aria-controls={listId}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${g.title}`}
                  className="w-6 h-6 flex items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    className={`transition-transform ${expanded ? "rotate-90" : ""}`}
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
              )}
            </div>
            {expanded && g.items.length > 0 && (
              <ul id={listId} className="mt-2 border-l border-neutral-200 flex flex-col">
                {g.items.map((item) => {
                  const current = isCurrent(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={current ? "page" : undefined}
                        className={`-ml-px block border-l-2 py-1.5 pl-3.5 pr-2 text-[13.5px] leading-snug ${
                          current
                            ? "border-plum-600 bg-plum-50 text-plum-700 font-medium"
                            : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-400"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Left column of the AI Lab hub. Sticky under the site header on desktop;
 * on smaller screens it collapses into a "Browse AI Lab" bar that opens
 * the same tree as a drawer.
 */
export default function DocsSidebar() {
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  const groups = useAiLabNav();
  const label = useDocsLabel();
  const currentTitle =
    groups.flatMap((g) => g.items).find((i) => isCurrent(pathname, i.href))?.title ??
    groups.find((g) => g.href === pathname)?.title ??
    label;

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      <aside className="hidden lg:block border-r border-neutral-200">
        <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto px-6 py-8 flex flex-col gap-7">
          <DocsSearch />
          <Tree />
        </div>
      </aside>

      <div className="lg:hidden sticky top-[73px] z-30 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur-md">
        <div className="px-5 sm:px-10 py-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-expanded={drawer}
            className="flex items-center gap-2 text-sm font-medium text-neutral-800 min-w-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h10M4 18h16" />
            </svg>
            <span className="font-mono text-[11px] tracking-[0.12em] text-neutral-500 shrink-0">{label.toUpperCase()}</span>
            <span className="truncate">{currentTitle}</span>
          </button>
          <div className="ml-auto shrink-0">
            <DocsSearch compact />
          </div>
        </div>
      </div>

      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${label} navigation`}>
          <button
            type="button"
            aria-label={`Close ${label} navigation`}
            className="absolute inset-0 bg-neutral-900/30"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(320px,85vw)] bg-neutral-50 border-r border-neutral-200 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-neutral-900">{label}</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 text-neutral-700"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <Tree onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}
    </>
  );
}
