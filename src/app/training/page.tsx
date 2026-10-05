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
import InstituteCards from "../../components/training/InstituteCards";
import AiToolsSection from "../../components/training/AiToolsSection";
import { client } from "../../sanity/lib/client";
import { trainingsQuery } from "../../sanity/lib/queries";
import { institutes } from "../../lib/trainings";
import { buildMetadata } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Prompt Engineering & Generative AI Training in Indore (Online) — PromptAtWork",
  description:
    "Cohort-based, hands-on prompt engineering and Generative AI training by Niharika Dhande, an AI trainer based in Indore, India. Courses, workshops and AI tools training (ChatGPT, Claude, GitHub Copilot, Cursor, Perplexity, NotebookLM) taught online.",
  path: "/training",
  keywords: [
    "prompt engineering training in Indore",
    "generative AI trainer in Indore",
    "prompt engineering course online",
    "generative AI course India",
    "AI workshops Indore",
    "Niharika Dhande training",
    "AI tools training for teams",
    "ChatGPT and Claude training",
    "GitHub Copilot training",
    "Cursor AI training",
  ],
});

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

const headline = "Courses & Workshops";
const h2 = "font-sans text-[26px] font-semibold tracking-tight text-neutral-900 scroll-mt-28";
const lead = "text-[15.5px] leading-[1.75] text-neutral-700";

// Workshops and institutes come from src/lib/trainings.ts (shared with the
// AI Enablement portfolio); cohort courses open for registration come from
// Sanity.
export default async function TrainingPage() {
  const courses: CourseCardData[] = await client.fetch(trainingsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <header className="pb-10 border-b border-neutral-200">
          <IntroFade as="span" className="font-mono text-xs tracking-[0.14em] font-semibold text-cyan-700">
            TRAINING
          </IntroFade>
          <WordReveal
            as="h1"
            className="mt-4 font-display text-[40px] sm:text-[56px] leading-[1.04] font-semibold tracking-tight text-neutral-900"
          >
            {headline}
          </WordReveal>
          <IntroFade as="p" after={headline} step={1} className="mt-6 text-[18px] leading-relaxed text-neutral-600 max-w-[560px]">
            Hands-on, cohort-based prompt engineering and Generative AI training by Niharika Dhande, an AI trainer based in
            Indore, India — taught online, using the same practices documented in the AI Lab.
          </IntroFade>
          <IntroFade after={headline} step={2} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#workshops"
              className="motion-btn inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-neutral-800 hover:text-white"
            >
              Browse the workshops
            </a>
          </IntroFade>
        </header>

        <div className="mt-10 flex flex-col gap-14">
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 id="workshops" className={h2}>
                Workshops & courses
              </h2>
              <p className={lead}>Pick a category to narrow the list, or open any training for its details.</p>
            </div>
            <TrainingGrid />
          </section>

          <section className="flex flex-col gap-5">
            <h2 id="courses" className={h2}>
              Cohort courses
            </h2>
            {courses.length === 0 ? (
              <div className="border border-neutral-200 rounded-2xl p-8 text-center bg-white">
                <p className="text-neutral-600">No courses open for registration right now — check back soon.</p>
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
                Institutes I&apos;ve trained for
              </h2>
              <p className={lead}>
                From .NET classrooms to agentic AI cohorts, teaching has run alongside my engineering work since 2010.
              </p>
            </div>
            <InstituteCards items={institutes} />
          </section>

          <AiToolsSection />

          <Callout title="Not sure which training fits?">
            <Link href="/contact">Get in touch</Link> and tell me about your team and the tools it uses.
          </Callout>
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
