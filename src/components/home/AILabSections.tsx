import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { aiLabSections, portfolioSections } from "../../lib/navigation";
import { StaggerGrid, StaggerItem } from "../motion/StaggerGrid";
import SectionHeader from "../paw/SectionHeader";
import Thumb, { type ThumbGlyph, type ThumbVariant } from "../paw/Thumb";

// The homepage's way into the AI Lab, laid out like the Hub-Portfolio
// ("Selected Work") board: one large tile and two stacked ones. It lists
// the lab's sections by name only, with no project cards or summaries, so
// nothing from the lab is repeated here (user rule, reconfirmed 2026-10-18;
// Docs/development-plan/11-ai-lab-docs-hub.md). The portfolio links sit
// where the board had its profile chips.
const art: Record<string, { variant: ThumbVariant; glyph: ThumbGlyph; kicker: string }> = {
  "/ai-lab/work": { variant: "teal", glyph: "layers", kicker: "CASE STUDIES" },
  "/ai-lab/engineering": { variant: "violet", glyph: "orbit", kicker: "ENGINEERING" },
  "/ai-lab/automations": { variant: "mono", glyph: "flow", kicker: "AUTOMATION" },
};

export default function AILabSections() {
  const [featured, ...rest] = aiLabSections.filter((s) => art[s.href]);
  const profiles = portfolioSections.filter((p) => p.href !== "/portfolio");

  return (
    <section id="ai-lab" className="w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 lg:py-[72px]">
        <SectionHeader
          eyebrow="AI LAB"
          title="All my work lives in one place"
          action={
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => (
                <Link key={p.href} href={p.href} className="paw-chip inline-flex items-center">
                  {p.label}
                </Link>
              ))}
            </div>
          }
        />

        <StaggerGrid className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featured && (
            <StaggerItem className="lg:col-span-2">
              <Link href={featured.href} className="paw-card h-full gap-5">
                <Thumb {...art[featured.href]} word={featured.label} aspect="auto" className="min-h-[240px] lg:min-h-0 lg:flex-1 [&_.paw-thumb__word]:text-[28px] [&_.paw-thumb__word]:leading-8 sm:[&_.paw-thumb__word]:text-4xl sm:[&_.paw-thumb__word]:leading-10" />
                <div className="flex flex-wrap justify-between items-end gap-4 px-3">
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 text-xl leading-7 font-semibold">{featured.label}</h3>
                    <p className="m-0 text-sm text-muted">{featured.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-muted">
                    Open <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          )}

          <div className="flex flex-col gap-6">
            {rest.map((s) => (
              <StaggerItem key={s.href}>
                <Link href={s.href} className="paw-card gap-3.5 pb-5">
                  <Thumb variant={art[s.href].variant} glyph={art[s.href].glyph} kicker={art[s.href].kicker} aspect="16 / 7" />
                  <div className="px-2 flex flex-col gap-2">
                    <h3 className="m-0 text-lg leading-[26px] font-semibold">{s.label}</h3>
                    <p className="m-0 text-sm text-muted">{s.description}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerGrid>

        <div className="mt-6 flex justify-end">
          <Link href="/ai-lab" className="paw-section-head__link">
            Open the AI Lab →
          </Link>
        </div>
      </div>
    </section>
  );
}
