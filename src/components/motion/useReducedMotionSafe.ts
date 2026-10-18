"use client";

import { useSyncExternalStore } from "react";

// Hydration-safe "prefers reduced motion". framer-motion's useReducedMotion
// returns false on the server but true on the first client render for
// visitors with reduced motion on, so any markup that depends on it differs
// and React throws a hydration error (seen on the institutes carousel).
// useSyncExternalStore uses the server snapshot (false) during hydration,
// then re-renders with the real value.
const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
