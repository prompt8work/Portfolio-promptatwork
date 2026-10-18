"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DISTANCE, DURATION, EASE, SCALE } from "../../lib/motion";

const PARTICLES = 6;

/**
 * Reaction emoji that bounces and throws a small burst of plum dots each
 * time `burst` increments.
 */
export default function BurstEmoji({ emoji, burst }: { emoji: string; burst: number }) {
  const reduce = useReducedMotion();
  const play = burst > 0 && !reduce;

  return (
    <span className="relative inline-flex" aria-hidden="true">
      <motion.span
        key={`e-${burst}`}
        initial={false}
        animate={play ? { scale: [1, SCALE.pop, 0.9, 1] } : undefined}
        transition={{ duration: DURATION.reveal, ease: EASE }}
        className="inline-block"
      >
        {emoji}
      </motion.span>
      <AnimatePresence>
        {play &&
          Array.from({ length: PARTICLES }, (_, i) => {
            const angle = (i / PARTICLES) * Math.PI * 2;
            return (
              <motion.span
                key={`${burst}-${i}`}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  x: Math.cos(angle) * DISTANCE.burst,
                  y: Math.sin(angle) * DISTANCE.burst,
                  scale: 0.4,
                }}
                transition={{ duration: DURATION.reveal, ease: EASE }}
                className="absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-primary/70 pointer-events-none"
              />
            );
          })}
      </AnimatePresence>
    </span>
  );
}
