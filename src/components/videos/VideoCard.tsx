"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export type VideoCardData = {
  slug: string;
  title: string;
  thumbnailUrl?: string;
  description?: string;
  publishedAt?: string;
  playlist?: string | null;
  externalUrl: string;
  externalId: string;
};

// Luminous SaaS VideoCard (TV-Browse / TV-VideoStates boards): 16:9
// thumbnail, channel avatar, two-line title, channel and date. Hover rings
// the thumbnail in violet and shows the play button. The board's duration
// badge and view counts are left out: the YouTube sync doesn't store them.
//
// Thumbnail only until clicked, then a real embedded player, so no iframe
// loads on first render (Phase 6: "thumbnails only, embed on click").
//
// timeZone: "UTC" on the date isn't cosmetic: this is a Client Component,
// and formatting in the OS timezone can render a different calendar day on
// the server (UTC) and in the browser, which is a hydration mismatch.
export default function VideoCard({ video }: { video: VideoCardData }) {
  const [playing, setPlaying] = useState(false);
  const date = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    : null;

  return (
    <article className="paw-video group">
      {playing ? (
        <div data-theme="dark" className="relative aspect-video rounded-2xl overflow-hidden bg-surface-container-lowest">
          <iframe
            src={`https://www.youtube.com/embed/${video.externalId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${video.title}`}
          data-theme="dark"
          className="paw-thumb paw-thumb--blue block w-full cursor-pointer transition-[border-radius,box-shadow] duration-200 group-hover:rounded-xl group-hover:shadow-[0_0_0_2px_var(--accent-violet)] focus-visible:rounded-xl"
        >
          {video.thumbnailUrl && (
            <Image src={video.thumbnailUrl} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" />
          )}
          <span className="paw-thumb__play group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="!w-12 !h-12">
              <Play className="w-[18px] h-[18px] fill-current" aria-hidden="true" />
            </span>
          </span>
        </button>
      )}

      <div className="paw-video__row">
        <Image src="/images/niharika-headshot.jpg" alt="" width={36} height={36} className="paw-avatar" />
        <div className="min-w-0">
          <h3 className="paw-video__title group-hover:text-primary transition-colors">
            <a href={video.externalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {video.title}
            </a>
          </h3>
          <div className="paw-video__channel">Niharika Dhande</div>
          {date && (
            <div className="paw-video__stats">
              <time dateTime={video.publishedAt}>{date}</time>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
