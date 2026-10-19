"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogCard, { kindStyle } from "./BlogCard";
import { FilterPills } from "../offerings/OfferingCard";
import { FilterGrid, FilterItem } from "../motion/FilterGrid";
import type { BlogKind, BlogPostView } from "../../lib/blog-kinds";

// /blog: search, a kind tab (tools / models / articles) and a topic menu
// (the tool's domain or the model's type) over every published post. The
// list is small enough to filter in the browser. Filters live in the URL
// (/blog?type=tool&topic=…&q=…) so any view can be shared, and only the
// first PAGE cards show until "Show more": the review queue runs to 150+.

const PAGE = 12;
const kinds: BlogKind[] = ["tool", "model", "article"];
const plural: Record<BlogKind, string> = { tool: "Tool reviews", model: "Model reviews", article: "Articles" };

type Filters = { kind: BlogKind | null; topic: string | null; q: string };

function matches(p: BlogPostView, f: Filters) {
  if (f.kind && p.kind !== f.kind) return false;
  if (f.topic && p.topic !== f.topic) return false;
  // Every word must appear somewhere ("anthropic coding" finds Claude Code).
  const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const text = [p.title, p.excerpt, p.subject, p.company, p.topic, p.category, ...(p.tags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return words.every((w) => text.includes(w));
}

function writeUrl(f: Filters) {
  const params = new URLSearchParams();
  if (f.kind) params.set("type", f.kind);
  if (f.topic) params.set("topic", f.topic);
  if (f.q.trim()) params.set("q", f.q.trim());
  const qs = params.toString();
  // replaceState, not the router: filtering shouldn't refetch the page.
  window.history.replaceState(null, "", qs ? `/blog?${qs}` : "/blog");
}

function Explorer({ posts, initial }: { posts: BlogPostView[]; initial: Filters }) {
  const [f, setF] = useState<Filters>(initial);
  const [shown, setShown] = useState(PAGE);

  const update = (next: Partial<Filters>) => {
    const merged = { ...f, ...next };
    // A topic belongs to one kind; switching kind drops a topic it doesn't have.
    if (next.kind !== undefined && merged.topic && !posts.some((p) => p.topic === merged.topic && (!merged.kind || p.kind === merged.kind)))
      merged.topic = null;
    setF(merged);
    setShown(PAGE);
    writeUrl(merged);
  };

  // Topics on offer follow the kind tab, grouped by kind for the "All" tab.
  const topicGroups = useMemo(
    () =>
      kinds
        .filter((k) => !f.kind || k === f.kind)
        .map((k) => ({
          kind: k,
          topics: [...new Set(posts.filter((p) => p.kind === k && p.topic).map((p) => p.topic!))].sort(),
        }))
        .filter((g) => g.topics.length > 0),
    [posts, f.kind],
  );

  const counts = useMemo(() => {
    const base = posts.filter((p) => matches(p, { ...f, kind: null }));
    return Object.fromEntries(kinds.map((k) => [k, base.filter((p) => p.kind === k).length])) as Record<BlogKind, number>;
  }, [posts, f]);
  const total = counts.tool + counts.model + counts.article;

  const results = posts.filter((p) => matches(p, f));
  const visible = results.slice(0, shown);
  const filtered = f.kind || f.topic || f.q.trim();

  const pills = [
    { key: null, label: `All (${total})` },
    ...kinds.filter((k) => posts.some((p) => p.kind === k)).map((k) => ({ key: k, label: `${plural[k]} (${counts[k]})` })),
  ];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Search posts</span>
            <svg
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={f.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search a tool, model, company or topic…"
              className="w-full text-sm bg-card border border-outline-variant text-ink placeholder:text-outline rounded-lg pl-10 pr-4 py-2.5 focus:border-primary/70 focus:outline-none"
            />
          </label>
          {topicGroups.length > 0 && (
            <label className="sm:w-72">
              <span className="sr-only">Filter by domain or model type</span>
              <select
                value={f.topic ?? ""}
                onChange={(e) => update({ topic: e.target.value || null })}
                className="w-full text-sm bg-card border border-outline-variant text-ink rounded-lg px-3.5 py-2.5 focus:border-primary/70 focus:outline-none"
              >
                <option value="">All domains and model types</option>
                {topicGroups.map((g) => (
                  <optgroup key={g.kind} label={g.kind === "model" ? "Model types" : "Domains"}>
                    {g.topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          )}
        </div>
        {pills.length > 2 && (
          <FilterPills options={pills} active={f.kind} onSelect={(k) => update({ kind: k as BlogKind | null })} />
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p aria-live="polite">
            {results.length} {results.length === 1 ? "post" : "posts"}
            {f.topic && <> in {f.topic}</>}
          </p>
          <ul className="flex flex-wrap gap-4 text-xs" aria-label="Card colours">
            {kinds.map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <i className={`h-2.5 w-2.5 rounded-full bg-linear-to-br ${kindStyle[k].gradient}`} />
                {kindStyle[k].label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="border border-line rounded-2xl p-10 text-center flex flex-col items-center gap-4">
          <p className="text-muted">No posts match that search.</p>
          {filtered && (
            <button
              type="button"
              onClick={() => update({ kind: null, topic: null, q: "" })}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <FilterGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visible.map((post, i) => (
            <FilterItem key={post.slug} index={i} className="h-full">
              <BlogCard post={post} />
            </FilterItem>
          ))}
        </FilterGrid>
      )}

      {results.length > shown && (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE)}
          className="self-center rounded-full border border-outline-variant px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:border-primary/70 hover:text-primary"
        >
          Show more ({results.length - shown} left)
        </button>
      )}
    </div>
  );
}

function ExplorerFromUrl({ posts }: { posts: BlogPostView[] }) {
  const params = useSearchParams();
  const type = params.get("type");
  const initial: Filters = {
    kind: kinds.includes(type as BlogKind) ? (type as BlogKind) : null,
    topic: params.get("topic"),
    q: params.get("q") ?? "",
  };
  return <Explorer posts={posts} initial={initial} />;
}

export default function BlogExplorer({ posts }: { posts: BlogPostView[] }) {
  // The fallback is what's prerendered: every post, no filters.
  return (
    <Suspense fallback={<Explorer posts={posts} initial={{ kind: null, topic: null, q: "" }} />}>
      <ExplorerFromUrl posts={posts} />
    </Suspense>
  );
}
