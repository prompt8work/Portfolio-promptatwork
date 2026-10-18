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

// Shared by the AI Lab and Training hubs. Layout follows the Page-AILab
// board: a mono section label, then one row per group with
// its entry count, the active row lifted onto the card surface.
function Tree({ onNavigate }: { onNavigate?: () => void }) {
  const groups = useAiLabNav();
  const label = useDocsLabel();
  const pathname = usePathname();
  // Start + the group you're in are open; the rest collapse so the tree
  // stays scannable. Manual toggles are remembered for the session.
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const isOpen = (g: DocsGroup, i: number) => open[g.href] ?? (i !== 0 && groupContains(pathname, g));

  return (
    <nav aria-label={`${label} sections`} className="flex flex-col gap-1">
      <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-muted px-3 pt-1 pb-2">{label}</span>
      {groups.map((g, i) => {
        const expanded = isOpen(g, i);
        const active = pathname === g.href || (i !== 0 && groupContains(pathname, g));
        const listId = `docs-group-${i}`;
        const count = i === 0 ? 0 : g.items.length;
        return (
          <div key={g.href}>
            <div
              className={`flex items-center h-[42px] rounded-[10px] transition-colors ${
                active ? "bg-card ring-1 ring-inset ring-line" : "hover:bg-surface-container"
              }`}
            >
              <Link
                href={g.href}
                onClick={onNavigate}
                aria-current={pathname === g.href ? "page" : undefined}
                className={`flex-1 min-w-0 h-full flex items-center justify-between gap-2 pl-3 pr-2 text-sm ${
                  active ? "text-ink font-semibold" : "text-muted font-medium hover:text-ink"
                }`}
              >
                <span className="truncate">{g.title}</span>
                {count > 0 && <span className="font-mono text-[10px] tracking-[0.05em] text-primary">{count}</span>}
              </Link>
              {count > 0 && (
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [g.href]: !expanded }))}
                  aria-expanded={expanded}
                  aria-controls={listId}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${g.title}`}
                  className="w-7 h-7 mr-1.5 flex items-center justify-center rounded-md text-muted hover:text-ink"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    className={`transition-transform ${expanded ? "rotate-90" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
              )}
            </div>
            {expanded && count > 0 && (
              <ul id={listId} className="ml-4 my-1.5 border-l border-line flex flex-col">
                {g.items.map((item) => {
                  const current = isCurrent(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={current ? "page" : undefined}
                        className={`-ml-px block border-l-2 py-1.5 pl-3.5 pr-2 text-[13px] leading-snug ${
                          current
                            ? "border-primary text-primary font-medium"
                            : "border-transparent text-muted hover:text-ink hover:border-outline"
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

/** Sidebar foot card (Page-AILab board): a single way to get in touch. */
function WorkWithMe({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mt-auto p-4 rounded-[14px] bg-card border border-line flex flex-col gap-2.5">
      <span className="text-sm font-semibold text-ink">Want this for your team?</span>
      <span className="text-[13px] leading-[19px] text-muted">Every project here started as a team&apos;s real workflow.</span>
      <Link href="/contact" onClick={onNavigate} className="paw-btn paw-btn--primary paw-btn--sm justify-center">
        Work with me
      </Link>
    </div>
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
      <aside aria-label={`${label} sidebar`} className="hidden lg:block border-r border-line bg-canvas">
        <div className="sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto px-4 py-6 flex flex-col gap-4">
          <DocsSearch />
          <Tree />
          {label === "AI Lab" && <WorkWithMe />}
        </div>
      </aside>

      <div className="lg:hidden sticky top-[68px] z-30 border-b border-line bg-canvas/95 backdrop-blur-md">
        <div className="px-5 sm:px-10 py-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-expanded={drawer}
            className="flex items-center gap-2 text-sm font-medium text-on-surface min-w-0"
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
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted shrink-0">{label.toUpperCase()}</span>
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
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(320px,85vw)] bg-canvas border-r border-line overflow-y-auto px-6 py-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-ink">{label}</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant"
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
            {label === "AI Lab" && <WorkWithMe onNavigate={() => setDrawer(false)} />}
          </div>
        </div>
      )}
    </>
  );
}
