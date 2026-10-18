"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { DURATION, roleSwap } from "../../lib/motion";

/**
 * Cycles through `items` in place. The server renders the first item; with
 * reduced motion it never changes (nothing loops).
 */
export default function RotatingText({ items, className = "" }: { items: string[]; className?: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    if (reduce || items.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), DURATION.roleRotate * 1000);
    return () => clearInterval(id);
  }, [reduce, items.length]);

  return (
    <span className={`inline-grid ${className}`}>
      <span className="sr-only">{items.join(", ")}</span>
      {/* Invisible copies reserve the widest word so the pill never jumps in size. */}
      {items.map((item) => (
        <span key={item} aria-hidden="true" className="invisible [grid-area:1/1]">
          {item}
        </span>
      ))}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={items[i]}
          aria-hidden="true"
          variants={roleSwap}
          initial="enter"
          animate="center"
          exit="exit"
          className="[grid-area:1/1]"
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
