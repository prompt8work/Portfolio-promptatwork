"use client";

import LinkedinIcon from "../icons/LinkedinIcon";
import CopyButton from "../motion/CopyButton";

// PRD 04.2 FR-03/FR-04/FR-06/NFR-02: a standard LinkedIn share URL, not an
// API integration — LinkedIn opens with the canonical PromptAtWork blog URL
// pre-filled; the user still writes and publishes the LinkedIn post
// themselves. No LinkedIn API key or OAuth involved.
export default function ShareActions({ url, title }: { url: string; title: string }) {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const pill =
    "border border-outline-variant text-on-surface-variant text-sm font-semibold px-4 py-2.5 rounded-full hover:border-primary/70 hover:text-primary";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share "${title}" on LinkedIn`}
        className={`motion-btn inline-flex items-center gap-2 ${pill}`}
      >
        <LinkedinIcon className="w-4 h-4" />
        Share on LinkedIn
      </a>
      <CopyButton text={url} label="Copy Link" className={pill} />
    </div>
  );
}
