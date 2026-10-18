"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, motion, useMotionValue } from "framer-motion";
import { DURATION, EASE, LOOP_EASE } from "../../lib/motion";

/**
 * Thin plum bar at the top of the viewport while a route navigation is in
 * flight: trickles toward 90% from the moment an internal link is clicked,
 * completes and fades when the pathname changes.
 */
export default function NavProgress() {
  const pathname = usePathname();
  const scaleX = useMotionValue(0);
  const opacity = useMotionValue(0);
  const running = useRef(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;

      running.current = true;
      scaleX.set(0);
      opacity.set(1);
      animate(scaleX, 0.9, { duration: DURATION.navTrickle, ease: LOOP_EASE });
    }
    // Capture phase: next/link calls preventDefault() on client navigations,
    // so a bubbling listener couldn't tell those apart from cancelled clicks.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [scaleX, opacity]);

  useEffect(() => {
    if (!running.current) return;
    running.current = false;
    animate(scaleX, 1, { duration: DURATION.navProgress, ease: EASE }).then(() =>
      animate(opacity, 0, { duration: DURATION.hover, ease: EASE }),
    );
  }, [pathname, scaleX, opacity]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, opacity }}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left bg-primary pointer-events-none"
    />
  );
}
