"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { VIEWPORT } from "../../lib/motion";

/**
 * Shared engine behind Reveal, StaggerGrid and TimelineItem.
 *
 * Server HTML is always visible: every revealable element carries the
 * `motion-intro` CSS class, so anything above the fold plays its entrance
 * on first paint without waiting for JavaScript. After hydration, an
 * element that is still *below* the fold is "armed" — its CSS intro is
 * dropped, it's hidden instantly (off-screen, so nobody sees the switch),
 * and framer-motion reveals it once it scrolls into view.
 */
export function useScrollReveal(ref: RefObject<Element | null>) {
  const reduce = useReducedMotionSafe();
  const inView = useInView(ref, VIEWPORT);
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [ref, reduce]);

  return {
    armed,
    /** Pass to `animate`; undefined leaves the element alone (CSS intro / already visible). */
    animate: armed ? (inView ? "visible" : "hidden") : undefined,
  };
}
