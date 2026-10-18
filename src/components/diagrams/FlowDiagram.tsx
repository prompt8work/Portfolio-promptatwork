import { Fragment, type ReactNode } from "react";
import type { DiagramStep, StepKind } from "./types";

const kinds: Record<StepKind, { label: string; card: string; icon: string; path: ReactNode }> = {
  trigger: {
    label: "Trigger",
    card: "border-tertiary/50 bg-tertiary/10",
    icon: "text-tertiary",
    path: <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
  },
  input: {
    label: "Input",
    card: "border-outline-variant bg-card",
    icon: "text-muted",
    path: <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
  },
  ai: {
    label: "AI",
    card: "border-primary/40 bg-primary/[0.06]",
    icon: "text-primary",
    path: (
      <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    ),
  },
  decision: {
    label: "Decision",
    card: "border-secondary/45 bg-accent-violet/8",
    icon: "text-primary",
    path: <path d="M12 2 22 12 12 22 2 12z" />,
  },
  action: {
    label: "Action",
    card: "border-primary/30 bg-accent-blue/8",
    icon: "text-primary",
    path: <path d="M6 4l14 8-14 8z" />,
  },
  store: {
    label: "Data store",
    card: "border-outline-variant bg-surface-container",
    icon: "text-muted",
    path: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
  },
  human: {
    label: "Human",
    card: "border-tertiary/40 bg-card",
    icon: "text-tertiary",
    path: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </>
    ),
  },
  output: {
    label: "Output",
    card: "border-primary/40 bg-primary/[0.06]",
    icon: "text-primary",
    path: <path d="M20 6 9 17l-5-5" />,
  },
};

function StepCard({ step, n }: { step: DiagramStep; n: number }) {
  const k = kinds[step.kind ?? "action"] ?? kinds.action;
  return (
    <div className={`h-full rounded-lg border px-3.5 py-3 flex flex-col gap-1.5 ${k.card}`}>
      <div className="flex items-center gap-1.5">
        <svg
          className={`shrink-0 ${k.icon}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {k.path}
        </svg>
        <span className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-muted whitespace-nowrap truncate">
          {n}. {k.label}
        </span>
      </div>
      <p className="text-[14.5px] font-semibold leading-snug text-ink">{step.label}</p>
      {step.detail && <p className="text-[13px] leading-relaxed text-muted">{step.detail}</p>}
      {(step.metric || step.after) && (
        <div className="mt-auto pt-1 flex flex-wrap items-center gap-1.5">
          {step.metric && (
            <span className="font-mono text-[11.5px] font-semibold text-primary bg-card border border-line rounded px-1.5 py-0.5 whitespace-nowrap">
              {step.metric}
            </span>
          )}
          {step.after && (
            <span className="font-mono text-[11.5px] bg-card border border-line rounded px-1.5 py-0.5 whitespace-nowrap">
              {step.before && (
                <span className="text-muted line-through decoration-outline">{step.before}</span>
              )}
              {step.before && <span className="text-muted"> → </span>}
              <span className="font-semibold text-primary">{step.after}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** Arrow between two steps: down on small screens, right in row layout from md up. */
function Connector({ label, row }: { label?: string; row: boolean }) {
  return (
    <li
      aria-hidden
      className={`flex items-center gap-2.5 py-1 pl-6 ${
        row ? "md:flex-col md:justify-center md:gap-1 md:py-0 md:pl-0 md:px-1 md:w-[60px] md:shrink-0" : ""
      }`}
    >
      {label && (
        <span
          className={`order-last font-mono text-[11px] leading-tight text-muted ${row ? "md:order-first md:text-center" : ""}`}
        >
          {label}
        </span>
      )}
      <span className={`flex flex-col items-center text-muted ${row ? "md:flex-row" : ""}`}>
        <span className={`block w-px h-5 bg-current ${row ? "md:w-6 md:h-px" : ""}`} />
        <svg className={row ? "md:-rotate-90" : ""} width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M0 2h10L5 9z" />
        </svg>
      </span>
    </li>
  );
}

function StepList({
  steps,
  offset,
  row,
  className = "",
}: {
  steps: DiagramStep[];
  offset: number;
  row: boolean;
  className?: string;
}) {
  return (
    <ol className={`flex flex-col ${row ? "md:flex-row md:items-stretch" : ""} ${className}`}>
      {steps.map((s, i) => (
        <Fragment key={`${s.label}-${i}`}>
          <li className={`min-w-0 ${row ? "md:flex-1" : ""}`}>
            <StepCard step={s} n={offset + i + 1} />
          </li>
          {i < steps.length - 1 && <Connector label={s.edgeLabel} row={row} />}
        </Fragment>
      ))}
    </ol>
  );
}

/**
 * Flow and Loop diagrams. Steps run left → right when there are three or
 * fewer (from md up), otherwise top → bottom; always top → bottom on
 * phones. Metrics and before → after values make it a data-driven flow.
 * A loop draws the repeating steps inside a dashed frame that names the
 * condition sending the process round again.
 */
export default function FlowDiagram({
  steps,
  loopBackTo,
  loopLabel,
}: {
  steps: DiagramStep[];
  loopBackTo?: number;
  loopLabel?: string;
}) {
  // The reading column is ~720px: more than three cards side by side gets cramped.
  const row = steps.length <= 3;
  const b = loopBackTo && loopBackTo >= 1 && loopBackTo < steps.length ? loopBackTo : null;
  if (!b) return <StepList steps={steps} offset={0} row={row} />;

  const pre = steps.slice(0, b - 1);
  const loop = steps.slice(b - 1);
  return (
    <ol className={`flex flex-col ${row ? "md:flex-row md:items-stretch" : ""}`}>
      {pre.map((s, i) => (
        <Fragment key={`${s.label}-${i}`}>
          <li className={`min-w-0 ${row ? "md:flex-1" : ""}`}>
            <StepCard step={s} n={i + 1} />
          </li>
          <Connector label={s.edgeLabel} row={row} />
        </Fragment>
      ))}
      <li className="min-w-0" style={row ? { flexGrow: loop.length, flexBasis: 0 } : undefined}>
        <div className="rounded-xl border-[1.5px] border-dashed border-primary/45 p-2.5 sm:p-3">
          <StepList steps={loop} offset={b - 1} row={row} />
          <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] text-primary">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
            </svg>
            Back to step {b}
            {loopLabel ? ` — ${loopLabel}` : ""}
          </p>
        </div>
      </li>
    </ol>
  );
}
