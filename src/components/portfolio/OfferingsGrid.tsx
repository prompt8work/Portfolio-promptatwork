"use client";

import { useState } from "react";
import type { Offering } from "../../lib/portfolio";
import { CtaButton, Highlight, card, faint, muted } from "./ui";

// Workshop / solution cards with category filter pills. Filters are derived
// from the cards' own categories, so adding a category in Studio adds a pill.

const dot = { cyan: "bg-[#38c8e6]", green: "bg-[#2fd39a]", violet: "bg-[#a78bfa]" };

// Banner thumbnails stand in for designed workshop artwork (thumbVariant 1–9).
const banners = [
  "from-[#0e7490] to-[#064e3b]",
  "from-[#1e3a8a] to-[#0e7490]",
  "from-[#312e81] to-[#0f766e]",
  "from-[#7c2d12] to-[#1e293b]",
  "from-[#065f46] to-[#1e3a8a]",
  "from-[#4c1d95] to-[#0e7490]",
  "from-[#0f172a] to-[#155e75]",
  "from-[#14532d] to-[#0c4a6e]",
  "from-[#1e1b4b] to-[#7c2d12]",
];

const grid =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:22px_22px]";

function Banner({ o }: { o: Offering }) {
  const bg = banners[((o.thumbVariant ?? 1) - 1 + banners.length) % banners.length];
  return (
    <div className={`relative flex aspect-video flex-col justify-between overflow-hidden rounded-[14px] border border-white/10 bg-linear-to-br p-[18px] ${bg}`}>
      <div className={grid} />
      <div className="relative max-w-[85%] text-2xl leading-[1.05] font-extrabold tracking-tight text-white uppercase">
        <Highlight text={o.thumbTitle ?? o.title} className="rounded bg-[#facc15] px-1.5 text-[#111]" />
      </div>
      <Tools items={o.thumbTools} />
    </div>
  );
}

function Tools({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="relative flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="rounded-md border border-white/15 bg-black/35 px-2 py-1 font-mono text-[11px] text-white">
          {t}
        </span>
      ))}
    </div>
  );
}

/** Colours a pipeline sketch: # comments dim, arrows and prompts cyan, quotes green. */
function SnippetLine({ line }: { line: string }) {
  if (line.trimStart().startsWith("#")) return <span className="text-slate-500">{line}</span>;
  return (
    <>
      {line.split(/("[^"]*"|→|⇄|↺|\$|>)/g).map((part, i) =>
        part.startsWith('"') ? (
          <span key={i} className="text-[#2fd39a]">{part}</span>
        ) : /^(→|⇄|↺|\$|>)$/.test(part) ? (
          <span key={i} className="text-[#38c8e6]">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}

function Terminal({ snippet }: { snippet?: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[#050c17]">
      <div className="flex gap-1.5 border-b border-white/[0.06] bg-white/[0.04] px-3 py-2.5">
        <i className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
      </div>
      <pre className="min-h-32 px-3.5 pt-3.5 pb-4 font-mono text-[12.5px] leading-[1.7] whitespace-pre-wrap text-slate-300">
        {(snippet ?? "").split("\n").map((line, i) => (
          <div key={i}>
            <SnippetLine line={line} />
          </div>
        ))}
      </pre>
    </div>
  );
}

export default function OfferingsGrid({ items }: { items: Offering[] }) {
  const categories = [...new Set(items.map((o) => o.category))];
  const [filter, setFilter] = useState<string | null>(null);
  const pill = "rounded-full border px-4 py-2 text-sm transition-colors";

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-7 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter">
          {[null, ...categories].map((c) => {
            const on = filter === c;
            return (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c)}
                className={`${pill} ${
                  on
                    ? "border-transparent bg-linear-to-r from-[#38c8e6] to-[#2fd39a] font-semibold text-[#04131f]"
                    : `border-cyan-300/30 ${muted} hover:text-[#eaf2f8]`
                }`}
              >
                {c ?? "All"}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((o) => !filter || o.category === filter)
          .map((o) => (
            <article key={o._key} className={`${card} flex flex-col p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/30`}>
              <span className={`mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-cyan-300/30 px-2.5 py-1 text-xs font-semibold ${muted}`}>
                <i className={`h-[7px] w-[7px] rounded-full ${dot[o.tone ?? "cyan"]}`} />
                {o.category}
              </span>
              {o.thumbStyle === "terminal" ? <Terminal snippet={o.snippet} /> : <Banner o={o} />}
              <h3 className="mt-4 mb-1.5 text-lg font-semibold text-[#eaf2f8]">{o.title}</h3>
              {!!o.meta?.length && (
                <div className={`mb-2.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[13px] ${faint}`}>
                  {o.meta.map((m, i) => (
                    <span key={m}>
                      {i > 0 && <span className="mr-2.5">•</span>}
                      {m}
                    </span>
                  ))}
                </div>
              )}
              {o.description && <p className={`mb-4 flex-1 text-[15px] ${muted}`}>{o.description}</p>}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                {o.footText && (
                  <span className={`text-[13px] ${faint}`}>
                    {o.footLabel && `${o.footLabel}: `}
                    <b className={`font-medium ${muted}`}>{o.footText}</b>
                  </span>
                )}
                <CtaButton cta={o.link} small />
              </div>
            </article>
          ))}
      </div>
    </>
  );
}
