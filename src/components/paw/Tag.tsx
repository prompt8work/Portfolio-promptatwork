import type { ReactNode } from "react";

// Mono pill tag (paw-tag). Blue is the default; violet for secondary tags,
// warm only for downloadables and live states.
export type TagTone = "blue" | "violet" | "warm" | "neutral";

export default function Tag({ children, tone = "blue" }: { children: ReactNode; tone?: TagTone }) {
  return <span className={`paw-tag ${tone === "blue" ? "" : `paw-tag--${tone}`}`}>{children}</span>;
}

const cycle: TagTone[] = ["blue", "violet", "neutral"];

/** Tags in the design's order: blue, violet, then neutral. */
export function TagList({ items }: { items: string[] }) {
  return (
    <div className="paw-tags">
      {items.map((t, i) => (
        <Tag key={t} tone={cycle[Math.min(i, cycle.length - 1)]}>
          {t.toUpperCase()}
        </Tag>
      ))}
    </div>
  );
}
