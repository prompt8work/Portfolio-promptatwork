"use client";

import { useEffect, useState } from "react";
import { submitReaction } from "../../app/blog/actions";
import BurstEmoji from "../motion/BurstEmoji";
import type { ReactionCounts, ReactionType } from "../../supabase/blogReactionRepository";

const reactions: { type: ReactionType; label: string; emoji: string }[] = [
  { type: "like", label: "Like", emoji: "♡" },
  { type: "love", label: "Love", emoji: "❤" },
  { type: "insightful", label: "Insightful", emoji: "💡" },
  { type: "useful", label: "Useful", emoji: "👏" },
  { type: "share", label: "Share", emoji: "↗" },
];

function getVisitorHash(): string {
  // A random per-browser token, not an identity — same soft anonymous
  // rate-limit approach as the Contact form's honeypot: no real
  // infrastructure, but enough to stop one browser from stacking the same
  // reaction repeatedly. The unique DB index is the real backstop; this is
  // just what lets the UI show "already reacted" without a round trip.
  try {
    const key = "paw_visitor_hash";
    let hash = localStorage.getItem(key);
    if (!hash) {
      hash = crypto.randomUUID();
      localStorage.setItem(key, hash);
    }
    return hash;
  } catch {
    return crypto.randomUUID();
  }
}

export default function ReactionBar({
  contentId,
  initialCounts,
}: {
  contentId: string;
  initialCounts: ReactionCounts;
}) {
  const [counts, setCounts] = useState(initialCounts);
  const [reacted, setReacted] = useState<Set<ReactionType>>(new Set());
  const [visitorHash, setVisitorHash] = useState("");
  const [bursts, setBursts] = useState<Partial<Record<ReactionType, number>>>({});

  useEffect(() => {
    // Reading localStorage has to happen after mount (SSR has no
    // localStorage, and reading it during render would desync from the
    // server-rendered markup) — the setState calls are deferred a frame so
    // this effect only subscribes/reads, matching the same pattern used
    // elsewhere in this codebase for effect-driven state.
    const frame = requestAnimationFrame(() => {
      const hash = getVisitorHash();
      setVisitorHash(hash);
      try {
        const stored = localStorage.getItem(`paw_reacted_${contentId}`);
        if (stored) setReacted(new Set(JSON.parse(stored)));
      } catch {
        // localStorage unavailable — reactions still work, just without the
        // "already reacted" visual state persisting across reloads.
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [contentId]);

  async function handleClick(type: ReactionType) {
    if (reacted.has(type) || !visitorHash) return;

    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setBursts((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
    const next = new Set(reacted).add(type);
    setReacted(next);
    try {
      localStorage.setItem(`paw_reacted_${contentId}`, JSON.stringify([...next]));
    } catch {
      // Non-fatal — see the try/catch in the effect above.
    }

    try {
      await submitReaction(contentId, type, visitorHash);
    } catch {
      // Reaction is cosmetic; a failed write isn't worth surfacing an error
      // to the reader over.
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {reactions.map((r) => (
        <button
          key={r.type}
          type="button"
          onClick={() => handleClick(r.type)}
          disabled={reacted.has(r.type)}
          className={`motion-btn inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-full border ${
            reacted.has(r.type)
              ? "border-primary/45 bg-accent-blue/14 text-primary"
              : "border-outline-variant text-muted hover:border-primary/70 hover:text-primary"
          }`}
        >
          <BurstEmoji emoji={r.emoji} burst={bursts[r.type] ?? 0} />
          {counts[r.type] > 0 && <span className="font-semibold">{counts[r.type]}</span>}
          <span className="sr-only">{r.label}</span>
        </button>
      ))}
    </div>
  );
}
