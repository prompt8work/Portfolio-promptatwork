"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAiLabNav, useDocsLabel } from "./AiLabNavContext";

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/**
 * ⌘K / Ctrl+K search across every AI Lab entry — titles, summaries and the
 * group each belongs to. The index is the sidebar tree already on the
 * client, so there's no search service; the dataset is small enough that
 * a substring match is the right amount of complexity. Only the full
 * (desktop) instance binds the shortcut; `compact` is the mobile trigger.
 */
export default function DocsSearch({ compact = false }: { compact?: boolean }) {
  const groups = useAiLabNav();
  const label = useDocsLabel();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const index = useMemo(
    () =>
      groups.flatMap((g) =>
        g.items.map((i) => ({
          ...i,
          group: g.title,
          haystack: `${i.title} ${i.summary ?? ""} ${g.title}`.toLowerCase(),
        })),
      ),
    [groups],
  );
  const q = query.trim().toLowerCase();
  const results = (q ? index.filter((e) => q.split(/\s+/).every((w) => e.haystack.includes(w))) : index).slice(0, 12);

  useEffect(() => {
    if (compact) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setCursor(0);
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact]);

  const openSearch = () => {
    setQuery("");
    setCursor(0);
    setOpen(true);
  };

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={openSearch}
          aria-label={`Search ${label}`}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 text-neutral-600"
        >
          <SearchIcon />
        </button>
      ) : (
        <button
          type="button"
          onClick={openSearch}
          className="w-full flex items-center gap-2.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-500 hover:border-neutral-400"
        >
          <SearchIcon />
          <span>Search {label}</span>
          <kbd className="ml-auto font-mono text-[10.5px] text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label={`Search ${label}`}
        >
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-neutral-900/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-[560px] rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 border-b border-neutral-200 text-neutral-500">
              <SearchIcon />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setCursor((c) => Math.min(c + 1, results.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setCursor((c) => Math.max(c - 1, 0));
                  }
                  if (e.key === "Enter" && results[cursor]) go(results[cursor].href);
                }}
                placeholder="Search projects, tools, prompts…"
                aria-label={`Search ${label}`}
                role="combobox"
                aria-expanded="true"
                aria-controls="docs-search-results"
                aria-activedescendant={results[cursor] ? `docs-search-${cursor}` : undefined}
                className="flex-1 py-3.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
              />
              <kbd className="font-mono text-[10.5px] text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
                esc
              </kbd>
            </div>
            <ul id="docs-search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-neutral-500">No matches.</li>}
              {results.map((r, i) => (
                <li key={r.href} id={`docs-search-${i}`} role="option" aria-selected={i === cursor}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(r.href)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 ${i === cursor ? "bg-plum-50" : ""}`}
                  >
                    <span className="block font-mono text-[10.5px] tracking-[0.1em] uppercase text-cyan-700">
                      {r.group}
                    </span>
                    <span className="block text-sm font-medium text-neutral-900">{r.title}</span>
                    {r.summary && (
                      <span className="block text-xs text-neutral-500 line-clamp-1 mt-0.5">{r.summary}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
