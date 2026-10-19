import { ArrowRight } from "lucide-react";
import { client } from "../../sanity/lib/client";
import { trainingsQuery } from "../../sanity/lib/queries";
import { getBatchesForTraining, type TrainingBatch } from "../../supabase/trainingRepository";
import { trainingPath } from "../../lib/trainings";
import { getHomePage, getWorkshops } from "../../lib/content";
import { StaggerGrid, StaggerItem } from "../motion/StaggerGrid";
import SectionHeader from "../paw/SectionHeader";
import type { ThumbGlyph, ThumbVariant } from "../paw/Thumb";
import ThumbCard from "../paw/ThumbCard";

// Courses (Hub-Courses board): the cohort courses open for registration
// (Sanity), then the workshops (also Sanity), three cards in
// all. The board's progress bars are per-learner data the site doesn't
// have, so a course card shows its real batch status and a workshop card
// its audience category.
type Training = { slug: string; title: string; description?: string; duration?: string; mode?: string; cardImage?: string };

const art: { variant: ThumbVariant; glyph: ThumbGlyph }[] = [
  { variant: "blue", glyph: "code" },
  { variant: "violet", glyph: "network" },
  { variant: "warm", glyph: "flow" },
];

function batchLine(batches: TrainingBatch[]) {
  const open = batches.find((b) => b.status === "OPEN");
  if (open) return { text: `REGISTRATION OPEN · ${open.seats - open.seatsFilled} SEATS LEFT`, live: true };
  return { text: "NEXT BATCH TO BE ANNOUNCED", live: false };
}

export default async function Courses() {
  const [trainings, workshops, home]: [Training[], Awaited<ReturnType<typeof getWorkshops>>, Awaited<ReturnType<typeof getHomePage>>] =
    await Promise.all([client.fetch(trainingsQuery), getWorkshops(), getHomePage()]);
  const batches = await Promise.all(trainings.map((t) => getBatchesForTraining(t.slug)));

  return (
    <section id="training" className="w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 lg:py-[72px]">
        <SectionHeader eyebrow={home.coursesHeading?.eyebrow} title={home.coursesHeading?.title ?? ""} link={{ href: "/training", label: "All courses" }} />

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((t, i) => {
            const { variant, glyph } = art[i % art.length];
            const status = batchLine(batches[i]);
            const meta = [t.mode, t.duration].filter(Boolean).join(" · ").toUpperCase();
            return (
              <StaggerItem key={t.slug} className="h-full">
                <ThumbCard
                  href={`/training/${t.slug}`}
                  image={t.cardImage}
                  variant={variant}
                  glyph={glyph}
                  kicker="COURSE"
                >
                  <div className="paw-card__body">
                    {meta && <span className="paw-card__meta">{meta}</span>}
                    <h3 className="paw-card__title">{t.title}</h3>
                    {t.description && <p className="paw-card__desc line-clamp-3">{t.description}</p>}
                  </div>
                  <div className="paw-card__foot">
                    <span className={`label-md inline-flex items-center gap-1.5 ${status.live ? "text-tertiary" : "text-muted"}`}>
                      {status.live && <span className="paw-live ml-0" aria-hidden="true" />}
                      {status.text}
                    </span>
                  </div>
                </ThumbCard>
              </StaggerItem>
            );
          })}

          {workshops.slice(0, Math.max(0, 3 - trainings.length)).map((w, i) => {
            const { variant, glyph } = art[(trainings.length + i) % art.length];
            return (
              <StaggerItem key={w.slug} className="h-full">
                <ThumbCard
                  href={trainingPath(w.slug)}
                  image={w.image}
                  variant={variant}
                  glyph={glyph}
                  kicker={`WORKSHOP · ${w.category.toUpperCase()}`}
                >
                  <div className="paw-card__body">
                    {w.tags.length > 0 && <span className="paw-card__meta">{w.tags.slice(0, 3).join(" · ").toUpperCase()}</span>}
                    <h3 className="paw-card__title">{w.title}</h3>
                    <p className="paw-card__desc line-clamp-3">{w.description}</p>
                  </div>
                  <div className="paw-card__foot">
                    <span className="label-md inline-flex items-center gap-1.5 text-primary">
                      ENQUIRE FOR YOUR TEAM <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </ThumbCard>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
