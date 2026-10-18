import { Highlight } from "../portfolio/ui";
import { Tools, bannerGradient, grid } from "../offerings/OfferingCard";
import Reveal from "../motion/Reveal";
import type { Training } from "../../lib/trainings";

const label = "font-mono text-[11px] tracking-[0.08em] uppercase text-white/70";
const chip = "rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[13px] text-white";

// The workshop page's hero card: the cover artwork grown to full width so
// it carries the page's key facts — cover title, the course tagline (its
// description), highlights, who it's for and the tools — instead of a
// separate cover plus Highlights and Ideal-for sections. Covers stay dark
// in both themes, so the text is always white. The two labels are h2s with
// ids so "On this page" still lists them.
export default function TrainingHero({ t }: { t: Training }) {
  return (
    <Reveal>
      <section
        data-theme="dark"
        className={`relative overflow-hidden rounded-[20px] border border-white/10 bg-linear-to-br p-6 sm:p-8 text-white ${bannerGradient(t.coverVariant)}`}
      >
        <div className={grid} />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="m-0 max-w-[90%] text-[26px] sm:text-3xl leading-[1.05] font-extrabold tracking-tight uppercase">
              <Highlight text={t.coverTitle} className="rounded bg-[#facc15] px-1.5 text-[#111]" />
            </p>
            <p className="m-0 max-w-[640px] text-base sm:text-[17px] leading-relaxed text-white/85">{t.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.highlights.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 id="highlights" className={`${label} m-0 scroll-mt-28`}>
                  Highlights
                </h2>
                <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                  {t.highlights.map((h) => (
                    <li key={h} className={chip}>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {t.idealFor.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 id="ideal-for" className={`${label} m-0 scroll-mt-28`}>
                  Ideal for
                </h2>
                <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                  {t.idealFor.map((who) => (
                    <li key={who} className={chip}>
                      {who}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Tools items={t.tags} />
        </div>
      </section>
    </Reveal>
  );
}
