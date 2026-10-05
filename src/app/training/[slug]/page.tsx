import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import DocsHeader, { DocsTag } from "../../../components/docs/DocsHeader";
import Callout from "../../../components/docs/Callout";
import { BlockLabel, ListSection } from "../../../components/ui/ContentSection";
import Chip from "../../../components/ui/Chip";
import Reveal from "../../../components/motion/Reveal";
import Carousel from "../../../components/motion/Carousel";
import { StaggerGrid, StaggerItem } from "../../../components/motion/StaggerGrid";
import { Timeline, TimelineItem } from "../../../components/motion/Timeline";
import TestimonialQuote from "../../../components/testimonials/TestimonialQuote";
import RelatedContent from "../../../components/ai-lab/RelatedContent";
import BatchCard from "../../../components/training/BatchCard";
import { OfferingBanner } from "../../../components/offerings/OfferingCard";
import JsonLd from "../../../components/JsonLd";
import { client } from "../../../sanity/lib/client";
import { trainingBySlugQuery, trainingSlugsQuery } from "../../../sanity/lib/queries";
import { getBatchesForTraining, getScheduleForBatch, type TrainingBatch } from "../../../supabase/trainingRepository";
import { buildBreadcrumbJsonLd, buildMetadata, getCanonicalUrl } from "../../../lib/site";
import { personName, personRef } from "../../../lib/seo";
import {
  getTraining,
  trainingCategoryPath,
  trainingPath,
  trainings,
  trainingToOffering,
  type Training,
} from "../../../lib/trainings";

// One route for two kinds of page: the workshops in src/lib/trainings.ts,
// and the cohort courses in Sanity (with batches and registration from
// Supabase). Workshop slugs are checked first.

export const revalidate = 60;

type CourseDetail = {
  slug: string;
  title: string;
  description: string;
  learningOutcomes?: string[];
  topics?: string[];
  audience?: string;
  duration?: string;
  mode?: string;
  instructor?: string;
  registrationEnabled: boolean;
  testimonials?: { quote: string; name: string; role?: string }[];
  relatedContent?: {
    _type: "project" | "tool" | "prompt" | "experiment" | "automation" | "blog";
    slug: string;
    title?: string;
    name?: string;
  }[];
};

const provider = { "@type": "Organization", "@id": `${getCanonicalUrl("/")}#organization`, name: "PromptAtWork", url: getCanonicalUrl("/") };

export async function generateStaticParams() {
  const courseSlugs: string[] = await client.fetch(trainingSlugsQuery);
  return [...trainings.map((t) => t.slug), ...courseSlugs.filter((s) => !getTraining(s))].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/training/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const training = getTraining(slug);
  if (training) {
    return buildMetadata({
      title: `${training.title} Training by Niharika Dhande (${training.category}) | PromptAtWork`,
      description: training.description,
      path: trainingPath(training.slug),
      keywords: [
        `${training.title.toLowerCase()} training`,
        `${training.title.toLowerCase()} workshop`,
        ...training.tags.map((t) => `${t} training`),
        "generative AI trainer in Indore",
        "Niharika Dhande",
      ],
    });
  }
  const course: CourseDetail | null = await client.fetch(trainingBySlugQuery, { slug });
  if (!course) return {};
  return buildMetadata({
    title: `${course.title} Course by Niharika Dhande, Indore (Online) — PromptAtWork`,
    description: course.description,
    path: trainingPath(course.slug),
    keywords: [
      `${course.title.toLowerCase()} course`,
      `${course.title.toLowerCase()} training in Indore`,
      "generative AI trainer in Indore",
      "Niharika Dhande",
    ],
  });
}

export default async function TrainingDetailPage({ params }: PageProps<"/training/[slug]">) {
  const { slug } = await params;
  const training = getTraining(slug);
  if (training) return <WorkshopPage t={training} />;

  const course: CourseDetail | null = await client.fetch(trainingBySlugQuery, { slug });
  if (!course || !course.registrationEnabled) notFound();
  return <CoursePage course={course} />;
}

function WorkshopPage({ t }: { t: Training }) {
  const more = trainings.filter((o) => o.category === t.category && o.slug !== t.slug);

  return (
    <PageTransition key={t.slug}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: t.title,
          description: t.description,
          url: getCanonicalUrl(trainingPath(t.slug)),
          inLanguage: "en",
          provider,
          instructor: personRef,
          audience: { "@type": "Audience", audienceType: t.idealFor.join(", ") },
          keywords: t.tags.join(", "),
        }}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Training", path: "/training" },
          { name: t.title, path: trainingPath(t.slug) },
        ])}
      />
      <DocsArticle>
        <DocsHeader
          eyebrow={
            <>
              <Link href="/training" className="text-cyan-700 hover:text-cyan-900">
                Training
              </Link>{" "}
              /{" "}
              <Link href={trainingCategoryPath(t.category)} className="text-cyan-700 hover:text-cyan-900">
                {t.category}
              </Link>
            </>
          }
          title={t.title}
          description={t.description}
        >
          <div className="flex flex-wrap gap-1.5">
            {t.tags.map((tag) => (
              <DocsTag key={tag}>{tag}</DocsTag>
            ))}
          </div>
        </DocsHeader>

        <div className="flex flex-col gap-10">
          <Reveal className="max-w-[520px]">
            <OfferingBanner o={trainingToOffering(t)} border="border-neutral-900/10" />
          </Reveal>

          <ListSection heading="Highlights" items={t.highlights} />

          <Reveal>
            <section className="flex flex-col gap-3">
              <BlockLabel>Ideal for</BlockLabel>
              <div className="flex flex-wrap gap-2">
                {t.idealFor.map((who) => (
                  <Chip key={who} tone="muted" size="sm">
                    {who}
                  </Chip>
                ))}
              </div>
            </section>
          </Reveal>

          {/* PLACEHOLDER: module outlines go in `modules` in src/lib/trainings.ts. Until then the note below shows. */}
          <Reveal>
            <section className="flex flex-col gap-3">
              <BlockLabel>Modules</BlockLabel>
              {t.modules?.length ? (
                <ol className="flex flex-col gap-3">
                  {t.modules.map((m, i) => (
                    <li key={m.title} className="flex gap-3">
                      <span className="font-mono text-[11px] text-neutral-400 pt-1">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block text-[15.5px] font-semibold text-neutral-900">{m.title}</span>
                        {m.description && <span className="block text-[15px] leading-relaxed text-neutral-700">{m.description}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <Callout title="Module outline coming soon">
                  The module-by-module outline for this training is being written up.{" "}
                  <Link href="/contact">Get in touch</Link> to plan a session for your team in the meantime.
                </Callout>
              )}
            </section>
          </Reveal>

          {more.length > 0 && (
            <Reveal>
              <section className="flex flex-col gap-3">
                <BlockLabel id="more-trainings">{`More ${t.category} trainings`}</BlockLabel>
                <ol className="flex flex-col gap-1.5">
                  {more.map((o, i) => (
                    <li key={o.slug} className="flex gap-3 text-[15px]">
                      <span className="font-mono text-[11px] text-neutral-400 pt-1">{String(i + 1).padStart(2, "0")}</span>
                      <Link
                        href={trainingPath(o.slug)}
                        className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-cyan-600"
                      >
                        {o.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>
          )}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}

async function CoursePage({ course }: { course: CourseDetail }) {
  const batches: TrainingBatch[] = await getBatchesForTraining(course.slug);
  const schedulesByBatch = await Promise.all(batches.map((b) => getScheduleForBatch(b.id)));

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: getCanonicalUrl(trainingPath(course.slug)),
    inLanguage: "en",
    provider,
    ...(course.instructor
      ? { instructor: course.instructor === personName ? personRef : { "@type": "Person", name: course.instructor } }
      : {}),
    ...(course.mode || course.duration
      ? {
          hasCourseInstance: {
            "@type": "CourseInstance",
            ...(course.mode ? { courseMode: course.mode } : {}),
            ...(course.duration ? { courseWorkload: course.duration } : {}),
            ...(course.instructor === personName ? { instructor: personRef } : {}),
          },
        }
      : {}),
  };

  return (
    <PageTransition key={course.slug}>
      <JsonLd data={courseJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Training", path: "/training" },
          { name: course.title, path: trainingPath(course.slug) },
        ])}
      />
      <DocsArticle>
        <DocsHeader
          eyebrow={`Cohort course${course.mode ? ` / ${course.mode}` : ""}`}
          title={course.title}
          description={course.description}
        >
          {(course.duration || course.instructor || course.audience) && (
            <div className="flex gap-5 flex-wrap text-sm text-neutral-500">
              {course.duration && <span>{course.duration}</span>}
              {course.instructor && <span>Instructor: {course.instructor}</span>}
              {course.audience && <span>{course.audience}</span>}
            </div>
          )}
        </DocsHeader>

        <div className="flex flex-col gap-12">
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <Reveal>
                <BlockLabel>What you&apos;ll learn</BlockLabel>
              </Reveal>
              <StaggerGrid as="ul" className="flex flex-col gap-1.5">
                {course.learningOutcomes.map((o) => (
                  <StaggerItem as="li" key={o} className="flex items-start text-sm text-neutral-700">
                    <span className="text-plum-600 mr-2 mt-0.5">▸</span>
                    <span>{o}</span>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          )}

          {course.topics && course.topics.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <Reveal>
                <BlockLabel>Topics covered</BlockLabel>
              </Reveal>
              <StaggerGrid className="flex flex-wrap gap-2">
                {course.topics.map((t) => (
                  <StaggerItem key={t}>
                    <Chip tone="muted" size="sm">
                      {t}
                    </Chip>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <Reveal>
              <BlockLabel>Upcoming batches</BlockLabel>
            </Reveal>
            {batches.length === 0 ? (
              <Reveal>
                <p className="text-sm text-neutral-600">No batches scheduled right now — check back soon.</p>
              </Reveal>
            ) : (
              <Timeline>
                {batches.map((batch, i) => (
                  <TimelineItem
                    key={batch.id}
                    title={new Date(batch.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  >
                    <BatchCard batch={batch} schedule={schedulesByBatch[i]} trainingId={course.slug} />
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </div>

          {course.testimonials && course.testimonials.length > 0 && (
            <div className="flex flex-col gap-6">
              <Reveal>
                <BlockLabel>Testimonials</BlockLabel>
              </Reveal>
              <Reveal className="bg-plum-100 rounded-2xl px-5 sm:px-10 py-10">
                <Carousel
                  label="Course testimonials"
                  slides={course.testimonials.map((t) => (
                    <TestimonialQuote key={t.name} quote={t.quote} name={t.name} detail={t.role} />
                  ))}
                />
              </Reveal>
            </div>
          )}

          <RelatedContent items={course.relatedContent} />
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
