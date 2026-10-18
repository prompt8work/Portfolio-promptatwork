/**
 * Concept ↔ analogy mapping: the technical idea on the left, the familiar
 * thing it behaves like on the right, one row per corresponding part.
 */
export default function AnalogyDiagram({
  concept,
  analogy,
  pairs,
}: {
  concept?: string;
  analogy?: string;
  pairs: { concept: string; analogy: string }[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="hidden sm:grid grid-cols-[1fr_40px_1fr] gap-3 pb-1">
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-primary">THE CONCEPT</p>
          {concept && <p className="text-[15px] font-semibold text-ink">{concept}</p>}
        </div>
        <span />
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-primary">THINK OF IT LIKE</p>
          {analogy && <p className="text-[15px] font-semibold text-ink">{analogy}</p>}
        </div>
      </div>
      {(concept || analogy) && (
        <p className="sm:hidden text-[14px] text-on-surface-variant">
          <span className="font-semibold text-ink">{concept}</span> is like{" "}
          <span className="font-semibold text-ink">{analogy}</span>
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {pairs.map((p) => (
          <li key={p.concept} className="grid grid-cols-1 sm:grid-cols-[1fr_40px_1fr] gap-1 sm:gap-3 items-stretch">
            <span className="rounded-lg border border-primary/30 bg-primary/[0.05] px-3.5 py-2.5 text-[14px] text-on-surface">
              {p.concept}
            </span>
            <span aria-hidden className="flex items-center justify-center text-outline text-[13px]">
              <span className="sm:hidden font-mono text-[10.5px] tracking-[0.1em]">IS LIKE ↓</span>
              <span className="hidden sm:inline">⟷</span>
            </span>
            <span className="rounded-lg border border-primary/30 bg-accent-blue/8 px-3.5 py-2.5 text-[14px] text-on-surface">
              <span className="sr-only">is like </span>
              {p.analogy}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
