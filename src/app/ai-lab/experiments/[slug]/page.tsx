import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "../../../../components/PageTransition";
import DocsArticle from "../../../../components/docs/DocsArticle";
import DocsHeader from "../../../../components/docs/DocsHeader";
import ArrowLink from "../../../../components/ui/ArrowLink";
import ContentSection, { BlockLabel, ListSection } from "../../../../components/ui/ContentSection";
import Reveal from "../../../../components/motion/Reveal";
import ExperimentStatusTag from "../../../../components/ai-lab/ExperimentStatusTag";
import RelatedContent from "../../../../components/ai-lab/RelatedContent";
import JsonLd from "../../../../components/JsonLd";
import Diagrams from "../../../../components/diagrams/DiagramFigure";
import { client } from "../../../../sanity/lib/client";
import { experimentBySlugQuery, experimentSlugsQuery } from "../../../../sanity/lib/queries";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../../../lib/site";
import { aiLabLabel } from "../../../../lib/navigation";
import type { ExperimentDetail } from "../../../../lib/content-types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(experimentSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experiment: ExperimentDetail | null = await client.fetch(experimentBySlugQuery, { slug });
  if (!experiment) return {};
  return buildMetadata({
    title: `${experiment.title} — ${aiLabLabel("/ai-lab/experiments")} — PromptAtWork`,
    description: experiment.objective,
    path: `/ai-lab/experiments/${experiment.slug}`,
    type: "article",
    image: experiment.cardImage,
  });
}

export default async function ExperimentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experiment: ExperimentDetail | null = await client.fetch(experimentBySlugQuery, { slug });
  if (!experiment) notFound();
  // A designed experiment has no results yet: its outcome blocks stay out
  // unless they hold text, so no empty "What worked" heading renders.
  const whatWorked = experiment.whatWorked?.trim();
  const whatFailed = experiment.whatFailed?.trim();

  return (
    <PageTransition key={slug}>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Lab", path: "/ai-lab" },
          { name: aiLabLabel("/ai-lab/experiments"), path: "/ai-lab/experiments" },
          { name: experiment.title, path: `/ai-lab/experiments/${experiment.slug}` },
        ])}
      />
      <DocsArticle>
        <DocsHeader eyebrow="Experiment" title={experiment.title} description={experiment.objective}>
          <div className="flex flex-wrap items-center gap-4">
            <ExperimentStatusTag status={experiment.status} />
            {experiment.tool && (
              <ArrowLink href={`/ai-lab/tools/${experiment.tool.slug}`} size="sm">
                Used {experiment.tool.name}
              </ArrowLink>
            )}
          </div>
        </DocsHeader>

        <div className="flex flex-col gap-10">
          <Diagrams items={experiment.diagrams} at="top" />
          <ContentSection heading="Hypothesis" body={experiment.hypothesis} />
          <Diagrams items={experiment.diagrams} at="hypothesis" />
          <ContentSection heading="Problem" body={experiment.problem} />
          <Diagrams items={experiment.diagrams} at="problem" />
          <ContentSection heading="Setup" body={experiment.setup} />
          <Diagrams items={experiment.diagrams} at="setup" />
          <ContentSection heading="Prompt / Workflow" body={experiment.promptOrWorkflow} />
          <Diagrams items={experiment.diagrams} at="promptOrWorkflow" />
          <ContentSection heading="Input" body={experiment.input} />
          <Diagrams items={experiment.diagrams} at="input" />
          <ContentSection heading="Output" body={experiment.output} />
          <Diagrams items={experiment.diagrams} at="output" />

          {(whatWorked || whatFailed) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatWorked && (
                <Reveal className="rounded-xl border border-line bg-card p-5 flex flex-col gap-2">
                  <BlockLabel>What worked</BlockLabel>
                  <p className="text-[15px] leading-relaxed text-on-surface-variant whitespace-pre-line">{whatWorked}</p>
                </Reveal>
              )}
              {whatFailed && (
                <Reveal className="rounded-xl border border-line bg-surface-container p-5 flex flex-col gap-2">
                  <BlockLabel>What failed</BlockLabel>
                  <p className="text-[15px] leading-relaxed text-on-surface-variant whitespace-pre-line">{whatFailed}</p>
                </Reveal>
              )}
            </div>
          )}
          <Diagrams items={experiment.diagrams} at="outcome" />

          <ContentSection heading="Learning" body={experiment.learning} />
          <Diagrams items={experiment.diagrams} at="learning" />
          <ContentSection heading="Decision" body={experiment.decision} />
          <Diagrams items={experiment.diagrams} at="decision" />
          <ContentSection heading="Next Step" body={experiment.nextStep} />
          <Diagrams items={experiment.diagrams} at="nextStep" />
          <ListSection heading="Use Cases" items={experiment.useCases} />

          <RelatedContent items={experiment.relatedContent} />
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
