"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import VideoCard, { type VideoCardData } from "./VideoCard";

// TV browse (TV-Browse board): a search bar that filters the synced videos
// by title and description, topic chips, and the 4-up grid. Chips come from
// the videos' YouTube playlists, so they only appear once videos carry one;
// the board's sample topics are not hard-coded.
const ALL = "All";

export default function VideoBrowser({ videos }: { videos: VideoCardData[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(ALL);
  const q = useDeferredValue(query.trim().toLowerCase());

  const topics = useMemo(() => {
    const names = [...new Set(videos.map((v) => v.playlist).filter((p): p is string => !!p))];
    return names.length > 0 ? [ALL, ...names] : [];
  }, [videos]);

  const shown = videos.filter(
    (v) =>
      (topic === ALL || v.playlist === topic) &&
      (!q || v.title.toLowerCase().includes(q) || (v.description ?? "").toLowerCase().includes(q)),
  );

  return (
    <>
      <form role="search" className="paw-search mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos"
          aria-label="Search videos"
        />
        <button type="submit" className="paw-search__btn" aria-label="Search">
          <Search className="paw-icon" aria-hidden="true" />
        </button>
      </form>

      {topics.length > 0 && (
        <div role="group" aria-label="Topics" className="paw-chips pt-6">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={`paw-chip ${topic === t ? "is-selected" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {shown.length} video{shown.length === 1 ? "" : "s"} shown
      </p>

      {shown.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line p-10 text-center text-muted">
          No videos match &ldquo;{query}&rdquo;.{" "}
          <button type="button" onClick={() => setQuery("")} className="text-primary hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {shown.map((v) => (
            <VideoCard key={v.slug} video={v} />
          ))}
        </div>
      )}
    </>
  );
}
