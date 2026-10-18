"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { DISTANCE, DRAG_ELASTIC, DURATION, LOOP_EASE, carouselSlide } from "../../lib/motion";

/**
 * Testimonials and institutes. Crossfade + 28px slide, auto-advances every 5s
 * (paused on hover/focus, off with reduced motion), drag/swipe, and dots
 * whose active one fills to show time until the next slide.
 */
export default function Carousel({
  slides,
  label,
  itemLabel = "testimonial",
  tone = "light",
}: {
  slides: ReactNode[];
  label: string;
  /** Names one slide in the dots' labels ("Show testimonial 2"). */
  itemLabel?: string;
  tone?: "light" | "dark";
}) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotionSafe();
  const progress = useMotionValue(0);
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const count = slides.length;
  const auto = count > 1 && !reduce;

  const go = useCallback((next: number, direction: number) => setState([(next + count) % count, direction]), [count]);

  // One animation drives both the progress fill and the advance.
  useEffect(() => {
    if (!auto) return;
    progress.set(0);
    controls.current = animate(progress, 1, {
      duration: DURATION.carouselInterval,
      ease: LOOP_EASE,
      onComplete: () => go(index + 1, 1),
    });
    return () => controls.current?.stop();
  }, [auto, index, go, progress]);

  useEffect(() => {
    if (paused) controls.current?.pause();
    else controls.current?.play();
  }, [paused, index]);

  function onDragEnd(_: unknown, info: PanInfo) {
    setPaused(false);
    if (info.offset.x < -DISTANCE.swipe) go(index + 1, 1);
    else if (info.offset.x > DISTANCE.swipe) go(index - 1, -1);
  }

  if (count === 0) return null;

  const dotBase = tone === "dark" ? "bg-white/20" : "bg-outline-variant";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex flex-col items-center gap-7"
    >
      {/* All slides stacked invisibly in one grid cell reserve the tallest height, so nothing jumps. */}
      <div className="grid w-full" aria-live={auto && !paused ? "off" : "polite"}>
        {slides.map((s, i) => (
          <div key={`sizer-${i}`} aria-hidden="true" className="invisible [grid-area:1/1]">
            {s}
          </div>
        ))}
        {reduce ? (
          <div className="[grid-area:1/1]">{slides[index]}</div>
        ) : (
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={carouselSlide}
              initial="enter"
              animate="center"
              exit="exit"
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={DRAG_ELASTIC}
              onDragStart={() => setPaused(true)}
              onDragEnd={onDragEnd}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              className="[grid-area:1/1] cursor-grab active:cursor-grabbing touch-pan-y"
            >
              {slides[index]}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Show ${itemLabel} ${i + 1}`}
              aria-current={i === index}
              className={`relative h-1.5 overflow-hidden rounded-full ${i === index ? "w-8" : "w-1.5"} ${dotBase}`}
            >
              {i === index && (
                <motion.span
                  style={{ scaleX: auto ? progress : 1 }}
                  className="absolute inset-0 origin-left rounded-full bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
