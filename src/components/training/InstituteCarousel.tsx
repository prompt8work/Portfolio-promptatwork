import Image from "next/image";
import Carousel from "../motion/Carousel";
import type { PortfolioImage } from "../../lib/portfolio";

export type InstituteSlide = {
  name: string;
  logo?: PortfolioImage;
  period?: string;
  description?: string;
  highlightLabel?: string;
  highlightText?: string;
  tags?: string[];
};

// "Institutes I've trained for", one compact card at a time: a small white
// logo plate (logos are drawn for white, so it stays white in both themes)
// beside the name, period, description and tags. Shared by /training and
// the AI Enablement portfolio; auto-advances, pauses on hover or focus, and
// can be swiped or picked from the dots.
export default function InstituteCarousel({ items }: { items: InstituteSlide[] }) {
  return (
    <Carousel
      label="Institutes I've trained for"
      itemLabel="institute"
      slides={items.map((it) => (
        <article
          key={it.name}
          className="paw-glass w-full max-w-[760px] mx-auto rounded-2xl p-5 flex flex-col sm:flex-row gap-5 text-left select-none"
        >
          {it.logo?.url && (
            <div className="grid place-items-center shrink-0 w-full sm:w-[176px] h-[72px] rounded-xl border border-line bg-white px-4 py-2">
              <Image
                src={it.logo.url}
                alt={it.logo.alt ?? it.name}
                width={it.logo.width}
                height={it.logo.height}
                className="h-auto max-h-11 w-auto"
                sizes="176px"
                draggable={false}
              />
            </div>
          )}
          <div className="min-w-0 flex flex-col gap-1.5">
            <h3 className="m-0 text-base font-semibold text-ink">{it.name}</h3>
            {it.period && <p className="m-0 font-mono text-xs text-primary">{it.period}</p>}
            {it.description && <p className="m-0 text-sm leading-[21px] text-muted line-clamp-3">{it.description}</p>}
            {it.highlightText && (
              <p className="m-0 text-[13px] text-muted">
                {it.highlightLabel && <b className="font-semibold text-ink">{it.highlightLabel}: </b>}
                {it.highlightText}
              </p>
            )}
            {!!it.tags?.length && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {it.tags.map((t) => (
                  <span key={t} className="paw-tag paw-tag--neutral">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    />
  );
}
