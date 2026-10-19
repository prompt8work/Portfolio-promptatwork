import type { Metadata } from "next";
import Link from "next/link";
import PageTransition from "../../components/PageTransition";
import DocsArticle from "../../components/docs/DocsArticle";
import Callout from "../../components/docs/Callout";
import WordReveal from "../../components/motion/WordReveal";
import IntroFade from "../../components/motion/IntroFade";
import { StaggerGrid, StaggerItem } from "../../components/motion/StaggerGrid";
import CourseCard, { type CourseCardData } from "../../components/training/CourseCard";
import TrainingGrid from "../../components/training/TrainingGrid";
import InstituteCarousel from "../../components/training/InstituteCarousel";
import AiToolsSection from "../../components/training/AiToolsSection";
import TeamsBand from "../../components/training/TeamsBand";
import { client } from "../../sanity/lib/client";
import { trainingsQuery } from "../../sanity/lib/queries";
import { getBlock, getInstitutes, getPage, getSiteSettings, getWorkshops } from "../../lib/content";
import { buildMetadata } from "../../lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("training");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/training", keywords: page.seoKeywords });
}

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

const h2 = "font-sans text-[26px] font-semibold tracking-[-0.02em] text-ink scroll-mt-28";
const lead = "text-[15.5px] leading-[1.75] text-muted";

// All copy is the "Courses (/training)" Page document; workshops, institutes
// and the AI tools list are their own Sanity documents, and cohort courses
// open for registration are "Training" documents.
export default async function TrainingPage() {
  const [courses, page, workshops, institutes, settings]: [
    CourseCardData[],
    Awaited<ReturnType<typeof getPage>>,
    Awaited<ReturnType<typeof getWorkshops>>,
    Awaited<ReturnType<typeof getInstitutes>>,
    Awaited<ReturnType<typeof getSiteSettings>>,
  ] = await Promise.all([client.fetch(trainingsQuery), getPage("training"), getWorkshops(), getInstitutes(), getSiteSettings()]);
  const headline = page.title ?? "";
  const workshopsBlock = getBlock(page, "workshops");
  const coursesBlock = getBlock(page, "courses");
  const institutesBlock = getBlock(page, "institutes");
  const helpBlock = getBlock(page, "help");

  return (
    <PageTransition>
      <DocsArticle>
        <header className="pb-10 border-b border-line flex flex-col gap-3.5">
          <IntroFade className="flex flex-wrap items-center gap-2.5">
            <span className="label-md inline-flex items-center h-[26px] px-2.5 rounded-md bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] text-primary">
              {page.eyebrow}
            </span>
            {page.tagline && <span className="text-[13px] text-muted">{page.tagline}</span>}
          </IntroFade>
          <WordReveal as="h1" className="m-0 text-[40px] leading-[44px] sm:text-[56px] sm:leading-[60px] font-semibold tracking-[-0.035em]">
            {headline}
          </WordReveal>
          <IntroFade as="p" after={headline} step={1} className="m-0 text-[17px] leading-[27px] text-muted max-w-[600px]">
            {page.intro}
          </IntroFade>
          {page.ctas?.length ? (
            <IntroFade after={headline} step={2} className="mt-3 flex flex-wrap gap-3">
              {page.ctas.map((c, i) => (
                <a key={c.href} href={c.href} className={`paw-btn ${i === 0 ? "paw-btn--primary" : "paw-btn--secondary"}`}>
                  {c.label}
                </a>
              ))}
            </IntroFade>
          ) : null}
        </header>

        <div className="mt-10 flex flex-col gap-14">
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 id="workshops" className={h2}>
                {workshopsBlock?.title}
              </h2>
              {workshopsBlock?.text && <p className={lead}>{workshopsBlock.text}</p>}
            </div>
            <TrainingGrid workshops={workshops} />
          </section>

          <section className="flex flex-col gap-5">
            <h2 id="courses" className={h2}>
              {coursesBlock?.title}
            </h2>
            {courses.length === 0 ? (
              <div className="border border-line rounded-2xl p-8 text-center bg-card">
                <p className="text-muted">No courses open for registration right now — check back soon.</p>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {courses.map((c) => (
                  <StaggerItem key={c.slug}>
                    <CourseCard course={c} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 id="institutes" className={h2}>
                {institutesBlock?.title}
              </h2>
              {institutesBlock?.text && <p className={lead}>{institutesBlock.text}</p>}
            </div>
            <InstituteCarousel items={institutes} />
          </section>

          <AiToolsSection tools={settings.aiTools} block={getBlock(page, "ai-tools")} />

          <TeamsBand block={getBlock(page, "teams")} />

          {helpBlock && (
            <Callout title={helpBlock.title ?? ""}>
              {helpBlock.ctas?.[0] && <Link href={helpBlock.ctas[0].href}>{helpBlock.ctas[0].label}</Link>} {helpBlock.text}
            </Callout>
          )}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
