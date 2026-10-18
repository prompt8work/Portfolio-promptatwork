"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// The hero's business card: the WhatsApp automation service Prompt at Work
// builds for small and large businesses. It is a service blueprint, not a
// client project, so it is labelled "WHAT WE BUILD" and carries no client
// names or results. The sample chat is illustrative. The frameworks named
// are ones Niharika already works with (Docs/content-drafts/
// meeting-intelligence-chatbot.md, ai-executive-command-center.md);
// WhatsApp Business Cloud API is the channel listed in
// Docs/architecture-blueprint.md.
const steps = [
  { label: "Message received", note: "WhatsApp Business API" },
  { label: "Understand intent", note: "LLM router agent" },
  { label: "Act on your systems", note: "CRM · orders · calendar" },
  { label: "Reply on WhatsApp", note: "human handoff if needed" },
];

const chat = {
  customer: "Hi, is my order shipped? Can I also book a demo for Friday?",
  agent: "Yes, it shipped today and arrives Thursday. Friday 11:00 is booked for your demo ✓",
};

const STEP_MS = 1800;

export default function WhatsAppAutomation() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(1);
  // Reduced motion: hold on the finished state, with the reply shown.
  const active = reduce ? steps.length - 1 : tick;

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((i) => (i + 1) % steps.length), STEP_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const pct = Math.round(((active + 1) / steps.length) * 100);
  const replied = active === steps.length - 1;

  return (
    <div
      className="paw-glass rounded-[20px] p-6 sm:p-7 flex flex-col gap-5"
      style={{ boxShadow: "0 0 0 1px color-mix(in srgb, var(--accent-violet) 25%, transparent), var(--elevation-glass)" }}
    >
      <div className="flex items-center gap-3.5">
        <span className="w-10 h-10 rounded-[10px] grid place-items-center bg-canvas border border-line text-primary shrink-0">
          <MessageCircle className="paw-icon" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold">WhatsApp automation</div>
          <div className="label-md text-muted truncate">AGENTIC WORKFLOW · ANY BUSINESS SIZE</div>
        </div>
        <span className="label-md inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-tertiary border border-[color-mix(in_srgb,var(--tertiary)_30%,transparent)] bg-[color-mix(in_srgb,var(--tertiary)_12%,transparent)] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" aria-hidden="true" />
          WHAT WE BUILD
        </span>
      </div>

      {/* Code well: stays dark in both themes. */}
      <div
        data-theme="dark"
        className="rounded-xl bg-surface-container-lowest border border-line px-5 py-[18px] flex flex-col gap-4 text-ink"
      >
        <div className="flex flex-col gap-2 text-[13px] leading-5" aria-label="Sample chat">
          <p className="m-0 self-start max-w-[85%] px-3 py-2 rounded-xl rounded-tl-sm bg-surface-container-high">
            {chat.customer}
          </p>
          <p
            className={`m-0 self-end max-w-[85%] px-3 py-2 rounded-xl rounded-tr-sm bg-[color-mix(in_srgb,var(--accent-violet)_30%,transparent)] transition-opacity duration-300 motion-reduce:transition-none ${
              replied ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!replied}
          >
            {chat.agent}
          </p>
        </div>

        <ol
          className="m-0 p-0 pt-4 border-t border-line list-none font-mono text-[13px] sm:text-sm leading-[22px] flex flex-col gap-3"
          aria-label="Workflow steps"
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
      </div>

      <div>
        <div className="flex justify-between text-[13px] text-muted mb-2">
          <span>Leads · orders · bookings · support</span>
          <span className="font-mono text-ink">{pct}%</span>
        </div>
        <div className="paw-progress h-1.5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Workflow progress">
          <div className="paw-progress__fill transition-[width] duration-300 ease-out motion-reduce:transition-none" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
