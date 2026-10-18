"use client";

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { SCALE, slideLeft, slideRight, transition } from "../../lib/motion";
import { useScrollReveal } from "./useScrollReveal";

type Tone = "light" | "dark";
type Markers = "number" | "dot";

type TimelineCtx = {
  progress: MotionValue<number>;
  listRef: RefObject<HTMLOListElement | null>;
  tone: Tone;
  markers: Markers;
  reduce: boolean;
  index: number;
};

const Ctx = createContext<TimelineCtx | null>(null);

// Desktop alternates sides; mobile keeps every item on one side of the line.
const DESKTOP = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
}

/**
 * Every step or date list on the site. A vertical line fills with plum as
 * you scroll; each marker fills and scales to 1.1 when the line reaches it
 * and its title goes from muted to ink. `tone` swaps colours only.
 */
export function Timeline({
  children,
  tone = "light",
  markers = "dot",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  markers?: Markers;
  className?: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = !!useReducedMotionSafe();
  // The fill's leading edge sits at 70% of the viewport height.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 70%"] });

  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute top-0 bottom-0 left-[18px] lg:left-1/2 w-px -translate-x-1/2 ${
          tone === "dark" ? "bg-white/10" : "bg-line"
        }`}
      />
      <motion.span
        aria-hidden="true"
        style={{ scaleY: reduce ? 1 : scrollYProgress }}
        className="absolute top-0 bottom-0 left-[18px] lg:left-1/2 w-px -translate-x-1/2 origin-top bg-primary"
      />
      <ol ref={listRef} className="relative flex flex-col gap-12">
        {Children.toArray(children).map((child, index) => (
          <Ctx.Provider
            key={isValidElement(child) && child.key != null ? child.key : index}
            value={{ progress: scrollYProgress, listRef, tone, markers, reduce, index }}
          >
            {child}
          </Ctx.Provider>
        ))}
      </ol>
    </div>
  );
}

export function TimelineItem({
  title,
  eyebrow,
  meta,
  children,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("TimelineItem must be inside <Timeline>");
  const { progress, listRef, tone, markers, reduce, index } = ctx;

  const markerRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const threshold = useRef(0);
  const [reached, setReached] = useState(false);
  const { armed, animate } = useScrollReveal(bodyRef);
  const isDesktop = useIsDesktop();

  // Where this marker sits along the list, as a 0–1 fraction of its height.
  useLayoutEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    if (!list || !marker) return;
    const measure = () => {
      const l = list.getBoundingClientRect();
      const m = marker.getBoundingClientRect();
      threshold.current = l.height > 0 ? (m.top + m.height / 2 - l.top) / l.height : 0;
      setReached(progress.get() >= threshold.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [listRef, progress]);

  useMotionValueEvent(progress, "change", (v) => setReached(v >= threshold.current));
  // With reduced motion every marker is simply shown in its reached state.
  const active = reduce || reached;

  const left = index % 2 === 0;
  // Mobile: everything enters from the right of the line. Desktop: from its own side.
  const variants = isDesktop && left ? slideLeft : slideRight;
  const dark = tone === "dark";

  return (
    <li className="relative pl-14 lg:pl-0 lg:grid lg:grid-cols-[1fr_36px_1fr] lg:gap-10">
      <motion.span
        ref={markerRef}
        aria-hidden="true"
        initial={false}
        animate={{ scale: active ? SCALE.markerActive : 1 }}
        transition={transition.hover}
        className={`absolute left-0 top-0 lg:static lg:col-start-2 lg:row-start-1 w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center ${
          dark ? "bg-ink border-white/20 text-slate-400" : "bg-white border-outline-variant text-muted"
        }`}
      >
        {markers === "number" ? (
          <span className="font-mono text-[12px] font-bold">{String(index + 1).padStart(2, "0")}</span>
        ) : (
          <span className={`w-2 h-2 rounded-full ${dark ? "bg-white/30" : "bg-outline-variant"}`} />
        )}
        {/* Filled state layered on top — opacity/transform only, no colour tweening. */}
        <motion.span
          initial={false}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
          transition={transition.hover}
          className="absolute -inset-[1.5px] rounded-full bg-linear-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white"
        >
          {markers === "number" ? (
            <span className="font-mono text-[12px] font-bold">{String(index + 1).padStart(2, "0")}</span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-white" />
          )}
        </motion.span>
      </motion.span>

      <motion.div
        ref={bodyRef}
        initial={false}
        animate={animate}
        variants={variants}
        data-reveal={left ? "timelineLeft" : "timelineRight"}
        style={{ "--motion-i": index } as CSSProperties}
        className={`${armed ? "" : "motion-intro"} flex flex-col gap-2 lg:row-start-1 ${
          left ? "lg:col-start-1" : "lg:col-start-3"
        }`}
      >
        {eyebrow && <span className="font-mono text-[11px] font-semibold text-primary tracking-wide">{eyebrow}</span>}
        {/* Muted → ink is the same ink colour at lower opacity, so it's an opacity animation. */}
        <motion.h3
          initial={false}
          animate={{ opacity: active ? 1 : 0.45 }}
          transition={transition.hover}
          className={`text-lg sm:text-xl font-semibold ${dark ? "text-white" : "text-ink"}`}
        >
          {title}
        </motion.h3>
        {meta && <div className={`text-sm ${dark ? "text-slate-400" : "text-muted"}`}>{meta}</div>}
        {children}
      </motion.div>
    </li>
  );
}
