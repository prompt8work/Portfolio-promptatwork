"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Chip from "../ui/Chip";
import { FilterGrid, FilterItem } from "../motion/FilterGrid";
import Thumb from "../paw/Thumb";

export type ToolListItem = {
  slug: string;
  name: string;
  type?: string;
  category?: string;
  tags?: string[];
  description: string;
  hasResearch?: boolean;
  videoCount?: number;
  resourceCount?: number;
  cardImage?: string;
};

// PRD 04.1 §23/§24: "at minimum, search, category, content type, tags" and
// listing cards that communicate this is a research repository, not a
// simple tool directory. Sanity-backed filtering (the whole list is
// already fetched server-side) rather than a search index — the dataset
// is small enough that client-side filtering is the right amount of
// complexity, per §23's explicit "do not overbuild" guidance.
export default function ToolsFilterGrid({ tools }: { tools: ToolListItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");

  const types = useMemo(
    () => ["All", ...Array.from(new Set(tools.map((t) => t.type).filter(Boolean) as string[]))],
    [tools],
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(tools.map((t) => t.category).filter(Boolean) as string[]))],
    [tools],
  );

  const filtered = tools.filter((t) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
    const matchesType = type === "All" || t.type === type;
    const matchesCategory = category === "All" || t.category === category;
    return matchesQuery && matchesType && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools & research…"
          aria-label="Search tools and research"
          className="text-sm bg-card border border-outline-variant text-ink placeholder:text-outline rounded-lg px-4 py-2.5 focus:border-primary/70 focus:outline-none"
        />
        {types.length > 2 && (
          <ChipRow label="Filter by type" options={types} value={type} onChange={setType} allLabel="All Types" />
        )}
        {categories.length > 2 && (
          <ChipRow
            label="Filter by category"
            options={categories}
            value={category}
            onChange={setCategory}
            allLabel="All Categories"
          />
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-line rounded-xl p-10 text-center">
          <p className="text-muted text-sm">No tools match that search.</p>
        </div>
      ) : (
        <FilterGrid className="flex flex-col">
          {filtered.map((t, i) => (
            <FilterItem key={t.slug} index={i}>
              <ToolCard tool={t} />
            </FilterItem>
          ))}
        </FilterGrid>
      )}
    </div>
  );
}

function ChipRow({
  label,
  options,
  value,
  onChange,
  allLabel,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} size="sm" active={value === o} button={{ onClick: () => onChange(o) }}>
          {o === "All" ? allLabel : o}
        </Chip>
      ))}
    </div>
  );
}

function ToolCard({ tool: t }: { tool: ToolListItem }) {
  const href = `/ai-lab/tools/${t.slug}`;
  return (
    <section className="py-7 border-t border-line flex flex-col sm:flex-row-reverse sm:items-start gap-5 sm:gap-7">
      {t.cardImage && (
        // Mouse shortcut only; the name link is the one keyboard and screen-reader users get.
        <Link href={href} tabIndex={-1} aria-hidden className="block w-full sm:w-[220px] shrink-0">
          <Thumb image={t.cardImage} sizes="(max-width: 640px) 100vw, 220px" />
        </Link>
      )}
      <div className="flex-1 min-w-0 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10.5px] tracking-[0.14em] font-semibold text-muted uppercase">
            {t.category}
          </span>
          {t.type && t.type !== "Tool" && (
            <span className="font-mono text-[10px] text-primary border border-line bg-card rounded-md px-1.5 py-0.5">
              {t.type}
            </span>
          )}
        </div>
        <h2 id={t.slug} className="scroll-mt-28 font-sans text-[20px] font-semibold tracking-tight">
          <Link href={href} className="text-ink hover:text-primary">
            {t.name}
          </Link>
        </h2>
        <p className="text-[15px] leading-[1.7] text-on-surface-variant">{t.description}</p>
        <div className="flex items-center gap-4 flex-wrap">
          <Link href={href} className="text-[14px] font-semibold text-primary hover:text-primary">
            Read the research →
          </Link>
          {(t.hasResearch || !!t.videoCount || !!t.resourceCount) && (
            <span className="flex gap-3 text-[11.5px] text-muted font-mono">
              {t.hasResearch && <span>Research</span>}
              {!!t.videoCount && (
                <span>
                  {t.videoCount} Video{t.videoCount > 1 ? "s" : ""}
                </span>
              )}
              {!!t.resourceCount && (
                <span>
                  {t.resourceCount} Resource{t.resourceCount > 1 ? "s" : ""}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
