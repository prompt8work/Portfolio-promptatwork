"use client";

import { ArrowUp } from "lucide-react";

/** The footer's back-to-top button (smooth scroll unless reduced motion is on). */
export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        })
      }
      aria-label="Back to top"
      className="paw-btn paw-btn--icon border border-line"
    >
      <ArrowUp className="paw-icon" aria-hidden="true" />
    </button>
  );
}
