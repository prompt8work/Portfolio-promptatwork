import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "../../../../components/PageTransition";
import DocsArticle from "../../../../components/docs/DocsArticle";
import DocsHeader from "../../../../components/docs/DocsHeader";
import ArrowLink from "../../../../components/ui/ArrowLink";
import ContentSection, { BlockLabel, ListSection } from "../../../../components/ui/ContentSection";
import Reveal from "../../../../components/motion/Reveal";
import RelatedContent, { type RelatedItem } from "../../../../components/ai-lab/RelatedContent";
import JsonLd from "../../../../components/JsonLd";
import Diagrams from "../../../../components/diagrams/DiagramFigure";
import type { Diagram } from "../../../../components/diagrams/types";
import { client } from "../../../../sanity/lib/client";
import { experimentBySlugQuery, experimentSlugsQuery } from "../../../../sanity/lib/queries";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../../../lib/site";

export const revalidate = 60;

type ExperimentDetail = {
  slug: string;
  title: string;
  cardImage?: string;
  objective: string;
  hypothesis?: string;
  problem?: string;
  setup?: string;
  promptOrWorkflow?: string;
  input?: string;
  output?: string;
  whatWorked?: string;
  whatFailed?: string;
  learning?: string;
  decision?: string;
  nextStep?: string;
  useCases?: string[];
  tool?: { slug: string; name: string };
  relatedContent?: RelatedItem[];
  diagrams?: Diagram[];
};

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(experimentSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experiment: ExperimentDetail | null = await client.fetch(experimentBySlugQuery, { slug });
  if (!experiment) return {};
  return buildMetadata({
    title: `${experiment.title} — Experiments — PromptAtWork`,
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

  return (
    <PageTransition key={slug}>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Lab", path: "/ai-lab" },
          { name: "Experiments", path: "/ai-lab/experiments" },
          { name: experiment.title, path: `/ai-lab/experiments/${experiment.slug}` },
        ])}
      />
      <DocsArticle>
        <DocsHeader eyebrow="Experiment" title={experiment.title} description={experiment.objective}>
          {experiment.tool && (
            <ArrowLink href={`/ai-lab/tools/${experiment.tool.slug}`} size="sm">
              Used {experiment.tool.name}
            </ArrowLink>
          )}
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

          {(experiment.whatWorked || experiment.whatFailed) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {experiment.whatWorked && (
                <Reveal className="rounded-xl border border-line bg-card p-5 flex flex-col gap-2">
                  <BlockLabel>What worked</BlockLabel>
                  <p className="text-[15px] leading-relaxed text-on-surface-variant whitespace-pre-line">{experiment.whatWorked}</p>
                </Reveal>
              )}
              {experiment.whatFailed && (
                <Reveal className="rounded-xl border border-line bg-surface-container p-5 flex flex-col gap-2">
                  <BlockLabel>What failed</BlockLabel>
                  <p className="text-[15px] leading-relaxed text-on-surface-variant whitespace-pre-line">{experiment.whatFailed}</p>
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
