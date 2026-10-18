"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { filterItem, transition } from "../../lib/motion";

const MountedCtx = createContext<{ current: boolean }>({ current: false });

/**
 * Every filterable list. When the filter changes, remaining cards glide to
 * their new slots (layout), removed ones fade out, new ones fade in.
 * On first paint the cards use the same CSS stagger as StaggerGrid.
 */
export function FilterGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  return (
    <MountedCtx.Provider value={mounted}>
      <LayoutGroup>
        <motion.div layout transition={transition.layout} className={className}>
          <AnimatePresence mode="popLayout" initial={false}>
            {children}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </MountedCtx.Provider>
  );
}

export function FilterItem({
  children,
  index,
  className = "",
  ref,
}: {
  children: ReactNode;
  index: number;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  const mounted = useContext(MountedCtx);
  const reduce = useReducedMotionSafe();
  // Only cards present at first paint play the CSS intro; later arrivals use the framer enter.
  const [intro] = useState(() => !mounted.current);

  return (
    <motion.div
      ref={ref}
      layout
      variants={filterItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={reduce ? transition.instant : transition.layout}
      data-reveal="fadeUp"
      style={{ "--motion-i": index } as CSSProperties}
      className={`${intro ? "motion-intro" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
