import type { ReactNode } from "react";
import Reveal from "../motion/Reveal";
import { DiagramFigure } from "./DiagramFigure";
import type { Diagram } from "./types";

const marker = /^\s*\[\[diagram:([a-z0-9-]+)\]\]\s*$/i;

/**
 * Plain-text body with diagrams woven in. A line reading
 * `[[diagram:some-key]]` is replaced by that diagram; "top" diagrams come
 * first, "intro" ones after the opening paragraph. A diagram whose marker
 * is missing (or unknown placement) falls back to after the intro, so an
 * authored diagram is never silently dropped.
 */
export default function DiagramBody({ body, diagrams: items }: { body: string; diagrams?: Diagram[] | null }) {
  // Sanity returns null (not undefined) for documents without diagrams yet.
  const diagrams = items ?? [];
  const byKey = new Map(diagrams.map((d) => [d.key, d]));
  const lines = body.split("\n");
  const markedKeys = new Set(lines.map((l) => l.match(marker)?.[1]).filter(Boolean) as string[]);

  const top = diagrams.filter((d) => d.placement === "top");
  const afterIntro = diagrams.filter(
    (d) => d.placement !== "top" && (d.placement === "intro" || !markedKeys.has(d.key)),
  );

  // Split into text chunks and marker slots.
  const parts: ({ text: string } | { key: string })[] = [];
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) parts.push({ text });
    buf = [];
  };
  for (const line of lines) {
    const m = line.match(marker);
    if (m) {
      flush();
      parts.push({ key: m[1] });
    } else buf.push(line);
  }
  flush();

  // The first text chunk's first paragraph is the intro.
  const out: ReactNode[] = top.map((d) => <DiagramFigure key={`top-${d.key}`} d={d} />);
  let introPlaced = afterIntro.length === 0;
  parts.forEach((p, i) => {
    if ("key" in p) {
      const d = byKey.get(p.key);
      if (d && d.placement !== "top" && d.placement !== "intro")
        out.push(<DiagramFigure key={`m-${d.key}-${i}`} d={d} />);
      return;
    }
    if (!introPlaced) {
      const [intro, ...rest] = p.text.split(/\n\s*\n/);
      out.push(<Prose key={`t-${i}-a`}>{intro}</Prose>);
      afterIntro.forEach((d) => out.push(<DiagramFigure key={`intro-${d.key}`} d={d} />));
      introPlaced = true;
      if (rest.length) out.push(<Prose key={`t-${i}-b`}>{rest.join("\n\n")}</Prose>);
      return;
    }
    out.push(<Prose key={`t-${i}`}>{p.text}</Prose>);
  });
  if (!introPlaced) afterIntro.forEach((d) => out.push(<DiagramFigure key={`intro-${d.key}`} d={d} />));

  return <div className="flex flex-col gap-8">{out}</div>;
}

function Prose({ children }: { children: string }) {
  return <Reveal className="text-[15.5px] leading-relaxed text-on-surface-variant whitespace-pre-wrap">{children}</Reveal>;
}
