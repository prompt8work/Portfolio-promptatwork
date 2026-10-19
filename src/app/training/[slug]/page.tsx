import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import DocsHeader from "../../../components/docs/DocsHeader";
import Callout from "../../../components/docs/Callout";
import { BlockLabel } from "../../../components/ui/ContentSection";
import Chip from "../../../components/ui/Chip";
import Reveal from "../../../components/motion/Reveal";
import Carousel from "../../../components/motion/Carousel";
import { StaggerGrid, StaggerItem } from "../../../components/motion/StaggerGrid";
import { Timeline, TimelineItem } from "../../../components/motion/Timeline";
import TestimonialQuote from "../../../components/testimonials/TestimonialQuote";
import RelatedContent from "../../../components/ai-lab/RelatedContent";
import BatchCard from "../../../components/training/BatchCard";
import TrainingHero from "../../../components/training/TrainingHero";
import { ModuleGroups, ProgramFormats, ProgramTimelines, SessionFormat } from "../../../components/training/CourseOutline";
import JsonLd from "../../../components/JsonLd";
import { client } from "../../../sanity/lib/client";
import { trainingBySlugQuery, trainingSlugsQuery } from "../../../sanity/lib/queries";
import { getBatchesForTraining, getScheduleForBatch, type TrainingBatch } from "../../../supabase/trainingRepository";
import { buildBreadcrumbJsonLd, buildMetadata, getCanonicalUrl } from "../../../lib/site";
import { personRef } from "../../../lib/seo";
import { getSiteSettings, getWorkshop, getWorkshops, type SiteSettings } from "../../../lib/content";
import { trainingCategoryPath, trainingPath, type Training } from "../../../lib/trainings";

// One route for two kinds of page: workshops ("Workshop / course"
// documents) and the cohort courses ("Training" documents, with batches and
// registration from Supabase). Workshop slugs are checked first.

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

const provider = (s: SiteSettings) => ({ "@type": "Organization", "@id": `${getCanonicalUrl("/")}#organization`, name: s.brandName, url: getCanonicalUrl("/") });

export async function generateStaticParams() {
  const [courseSlugs, workshops]: [string[], Awaited<ReturnType<typeof getWorkshops>>] = await Promise.all([
    client.fetch(trainingSlugsQuery),
    getWorkshops(),
  ]);
  const workshopSlugs = workshops.map((t) => t.slug);
  return [...workshopSlugs, ...courseSlugs.filter((s) => !workshopSlugs.includes(s))].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/training/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [training, s] = await Promise.all([getWorkshop(slug), getSiteSettings()]);
  if (training) {
    return buildMetadata({
      title: `${training.title} Training by ${s.personName} (${training.category}) | ${s.brandName}`,
      description: training.description,
      path: trainingPath(training.slug),
      image: training.image,
      keywords: [
        `${training.title.toLowerCase()} training`,
        `${training.title.toLowerCase()} workshop`,
        ...training.tags.map((t) => `${t} training`),
        `generative AI trainer in ${s.address.city}`,
        s.personName,
      ],
    });
  }
  const course: CourseDetail | null = await client.fetch(trainingBySlugQuery, { slug });
  if (!course) return {};
  return buildMetadata({
    title: `${course.title} Course by ${s.personName}, ${s.address.city} (Online) — ${s.brandName}`,
    description: course.description,
    path: trainingPath(course.slug),
    keywords: [
      `${course.title.toLowerCase()} course`,
      `${course.title.toLowerCase()} training in ${s.address.city}`,
      `generative AI trainer in ${s.address.city}`,
      s.personName,
    ],
  });
}

export default async function TrainingDetailPage({ params }: PageProps<"/training/[slug]">) {
  const { slug } = await params;
  const [training, settings] = await Promise.all([getWorkshop(slug), getSiteSettings()]);
  if (training) return <WorkshopPage t={training} settings={settings} />;

  const course: CourseDetail | null = await client.fetch(trainingBySlugQuery, { slug });
  if (!course || !course.registrationEnabled) notFound();
  return <CoursePage course={course} settings={settings} />;
}

async function WorkshopPage({ t, settings }: { t: Training; settings: SiteSettings }) {
  const more = (await getWorkshops()).filter((o) => o.category === t.category && o.slug !== t.slug);

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
          provider: provider(settings),
          instructor: personRef(settings),
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
              <Link href="/training" className="text-primary hover:text-primary">
                Training
              </Link>{" "}
              /{" "}
              <Link href={trainingCategoryPath(t.category)} className="text-primary hover:text-primary">
                {t.category}
              </Link>
            </>
          }
          title={t.title}
        />

        <div className="flex flex-col gap-10">
          {/* Tagline, highlights, audience and tools all live in the hero card. */}
          <TrainingHero t={t} />

          {t.sessionFormat && <SessionFormat format={t.sessionFormat} />}
          {t.programs?.length ? <ProgramFormats programs={t.programs} /> : null}

          {/* Module outlines are the workshop's "Module groups" in Sanity. Until then the note below shows. */}
          <Reveal>
            <section className="flex flex-col gap-4">
              <BlockLabel>Modules</BlockLabel>
              {t.modules?.length ? (
                <ModuleGroups groups={t.modules} />
              ) : (
                <Callout title="Module outline coming soon">
                  The module-by-module outline for this training is being written up.{" "}
                  <Link href="/contact">Get in touch</Link> to plan a session for your team in the meantime.
                </Callout>
              )}
            </section>
          </Reveal>

          {t.programs?.length ? <ProgramTimelines programs={t.programs} intro={t.timelinesIntro} /> : null}

          {more.length > 0 && (
            <Reveal>
              <section className="flex flex-col gap-3">
                <BlockLabel id="more-trainings">{`More ${t.category} trainings`}</BlockLabel>
                <ol className="flex flex-col gap-1.5">
                  {more.map((o, i) => (
                    <li key={o.slug} className="flex gap-3 text-[15px]">
                      <span className="font-mono text-[11px] text-muted pt-1">{String(i + 1).padStart(2, "0")}</span>
                      <Link
                        href={trainingPath(o.slug)}
                        className="text-ink underline decoration-outline-variant underline-offset-4 hover:decoration-primary"
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

async function CoursePage({ course, settings }: { course: CourseDetail; settings: SiteSettings }) {
  const person = personRef(settings);
  const isMe = course.instructor === settings.personName;
  const batches: TrainingBatch[] = await getBatchesForTraining(course.slug);
  const schedulesByBatch = await Promise.all(batches.map((b) => getScheduleForBatch(b.id)));

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: getCanonicalUrl(trainingPath(course.slug)),
    inLanguage: "en",
    provider: provider(settings),
    ...(course.instructor ? { instructor: isMe ? person : { "@type": "Person", name: course.instructor } } : {}),
    ...(course.mode || course.duration
      ? {
          hasCourseInstance: {
            "@type": "CourseInstance",
            ...(course.mode ? { courseMode: course.mode } : {}),
            ...(course.duration ? { courseWorkload: course.duration } : {}),
            ...(isMe ? { instructor: person } : {}),
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
            <div className="flex gap-5 flex-wrap text-sm text-muted">
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
                  <StaggerItem as="li" key={o} className="flex items-start text-sm text-on-surface-variant">
                    <span className="text-primary mr-2 mt-0.5">▸</span>
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
                <p className="text-sm text-muted">No batches scheduled right now — check back soon.</p>
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
              <Reveal className="bg-accent-blue/14 rounded-2xl px-5 sm:px-10 py-10">
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
