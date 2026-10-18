import Reveal from "../motion/Reveal";
import FlowDiagram from "./FlowDiagram";
import AnalogyDiagram from "./AnalogyDiagram";
import MermaidDiagram from "./MermaidDiagram";
import type { Diagram } from "./types";

const eyebrow: Record<Diagram["kind"], string> = {
  flow: "PROCESS FLOW",
  loop: "LOOP",
  analogy: "ANALOGY",
  advanced: "DIAGRAM",
};

const grid = {
  backgroundImage:
    "linear-gradient(var(--surface-container) 1px, transparent 1px), linear-gradient(90deg, var(--surface-container) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

/**
 * One diagram: eyebrow, title (an h3 with an id, so AI Lab's "On this
 * page" lists it), the drawing on a faint grid, and the caption that
 * explains it in words.
 */
export function DiagramFigure({ d }: { d: Diagram }) {
  let body = null;
  if ((d.kind === "flow" || d.kind === "loop") && d.steps && d.steps.length > 1) {
    body = (
      <FlowDiagram steps={d.steps} loopBackTo={d.kind === "loop" ? d.loopBackTo : undefined} loopLabel={d.loopLabel} />
    );
  } else if (d.kind === "analogy" && d.pairs && d.pairs.length > 0) {
    body = <AnalogyDiagram concept={d.concept} analogy={d.analogy} pairs={d.pairs} />;
  } else if (d.kind === "advanced" && d.mermaid) {
    body = <MermaidDiagram code={d.mermaid} />;
  }
  if (!body) return null;

  return (
    <Reveal>
      <figure className="rounded-xl border border-line bg-card overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-surface-container">
          <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">{eyebrow[d.kind]}</span>
          <h3
            id={`diagram-${d.key}`}
            className="mt-1 scroll-mt-28 text-[16.5px] font-semibold leading-snug text-ink"
          >
            {d.title}
          </h3>
        </div>
        <div className="px-4 sm:px-6 py-5" style={grid}>
          {body}
        </div>
        {d.caption && (
          <figcaption className="border-t border-line px-4 sm:px-6 py-3 text-[14px] leading-relaxed text-muted">
            {d.caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}

/** Every diagram placed at `at` (a section name, "top", etc.), in authored order. */
export default function Diagrams({ items, at }: { items?: Diagram[] | null; at: string }) {
  const here = (items ?? []).filter((d) => (d.placement ?? "top") === at);
  if (here.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      {here.map((d) => (
        <DiagramFigure key={d.key} d={d} />
      ))}
    </div>
  );
}
