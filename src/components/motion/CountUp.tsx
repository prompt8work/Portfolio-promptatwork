"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { DURATION, EASE, VIEWPORT } from "../../lib/motion";

// Leading number (optionally after a symbol like "$" or "~"), and no further
// digits after it — "100+ users" counts, "p95 <3s" / "45%→89%" don't (they
// aren't a single quantity, so counting them would misrepresent them).
const PATTERN = /^([^\p{L}\d]*)(\d[\d,]*(?:\.\d+)?)(\D*)$/u;

/**
 * Every stat or metric: counts up once, 1.5s, when scrolled into view.
 * The server renders the final value, so it's never blank without JS.
 */
export default function CountUp({ value, className = "" }: { value: string | number; className?: string }) {
  const text = String(value);
  const match = text.match(PATTERN);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();
  const [display, setDisplay] = useState<string | null>(null);

  const [, prefix = "", raw = "", suffix = ""] = match ?? [];
  const target = Number(raw.replace(/,/g, ""));
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const grouped = raw.includes(",");

  const format = (n: number) =>
    grouped
      ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : n.toFixed(decimals);

  // Once hydrated, drop to zero (next frame, off the render path) so the
  // count has somewhere to start; the server HTML keeps the real value.
  useEffect(() => {
    if (!match || reduce) return;
    const frame = requestAnimationFrame(() => setDisplay(format(0)));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduce]);

  useEffect(() => {
    if (!match || reduce || !inView) return;
    const controls = animate(0, target, {
      duration: DURATION.countUp,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target, reduce]);

  if (!match) return <span className={className}>{text}</span>;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {prefix}
        {display ?? raw}
        {suffix}
      </span>
    </span>
  );
}
