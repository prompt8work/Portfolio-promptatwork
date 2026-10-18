"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { DURATION, EASE, fadeUp } from "../../lib/motion";

/** The one success state for every form: a check that draws itself + the message. */
export default function FormSuccess({ message, tone = "light" }: { message: string; tone?: "light" | "dark" }) {
  const reduce = useReducedMotionSafe();
  const draw = reduce ? { duration: 0 } : { duration: DURATION.checkDraw, ease: EASE };

  return (
    <motion.div
      role="status"
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      animate="visible"
      className="flex flex-col items-center text-center gap-4 py-6"
    >
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <motion.circle
          cx="28"
          cy="28"
          r="26"
          stroke="var(--primary)"
          strokeWidth="2"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={draw}
        />
        <motion.path
          d="M17 29l7 7 15-16"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ ...draw, delay: reduce ? 0 : DURATION.checkDraw * 0.6 }}
        />
      </svg>
      <p className={`text-sm font-medium max-w-[420px] ${tone === "dark" ? "text-white" : "text-ink"}`}>
        {message}
      </p>
    </motion.div>
  );
}
