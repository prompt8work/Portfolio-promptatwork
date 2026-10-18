"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SquareTerminal } from "lucide-react";

// The hero's "live agent pipeline" card (design system: the hero shows a
// working pipeline, not decoration). The steps are the real Q&A path of the
// Meeting Intelligence Chatbot (Docs/content-drafts/meeting-intelligence-
// chatbot.md): LLM intent detection, hybrid FAISS + BM25 search fused with
// RRF, an answer written only from the retrieved chunks, then output
// validation. The settings shown are configured values, not measurements.
const steps = [
  { label: "Detect intent", note: "LLM router" },
  { label: "Hybrid search", note: "FAISS + BM25 · RRF" },
  { label: "Answer with citations", note: "retrieved chunks only" },
  { label: "Validate output", note: "before it's shown" },
];

const STEP_MS = 1800;

export default function AgentPipeline() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(2);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((i) => (i + 1) % steps.length), STEP_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const pct = Math.round(((active + 1) / steps.length) * 100);

  return (
    <div
      className="paw-glass rounded-[20px] p-6 sm:p-7 flex flex-col gap-5"
      style={{ boxShadow: "0 0 0 1px color-mix(in srgb, var(--accent-violet) 25%, transparent), var(--elevation-glass)" }}
    >
      <div className="flex items-center gap-3.5">
        <span className="w-10 h-10 rounded-[10px] grid place-items-center bg-canvas border border-line text-primary shrink-0">
          <SquareTerminal className="paw-icon" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold">Agent pipeline</div>
          <div className="label-md text-muted truncate">MEETING INTELLIGENCE CHATBOT · Q&amp;A</div>
        </div>
        <span className="label-md inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-tertiary border border-[color-mix(in_srgb,var(--tertiary)_30%,transparent)] bg-[color-mix(in_srgb,var(--tertiary)_12%,transparent)] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" aria-hidden="true" />
          LIVE PROJECT
        </span>
      </div>

      {/* Code well: stays dark in both themes. */}
      <ol
        data-theme="dark"
        className="m-0 list-none px-5 py-[18px] rounded-xl bg-surface-container-lowest border border-line font-mono text-[13px] sm:text-sm leading-[22px] flex flex-col gap-3.5 text-ink"
        aria-label="Pipeline steps"
      >
        {steps.map((s, i) => {
          const state = i < active ? "done" : i === active ? "running" : "queued";
          return (
            <li key={s.label} className="flex justify-between gap-4" aria-current={state === "running" ? "step" : undefined}>
              <span className={state === "queued" ? "text-muted" : ""}>
                <span className={state === "running" ? "text-tertiary" : "text-accent-violet"} aria-hidden="true">
                  ●
                </span>{" "}
                {s.label} <span className="text-muted">· {s.note}</span>
              </span>
              <span className={state === "running" ? "text-tertiary" : "text-muted"}>
                {state === "running" ? "…" : state}
              </span>
            </li>
          );
        })}
      </ol>

      <div>
        <div className="flex justify-between text-[13px] text-muted mb-2">
          <span>
            Step {active + 1} of {steps.length}
          </span>
          <span className="font-mono text-ink">{pct}%</span>
        </div>
        <div className="paw-progress h-1.5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Pipeline progress">
          <div className="paw-progress__fill transition-[width] duration-300 ease-out motion-reduce:transition-none" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
