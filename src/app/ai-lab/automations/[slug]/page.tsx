import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "../../../../components/PageTransition";
import DocsArticle from "../../../../components/docs/DocsArticle";
import DocsHeader, { DocsTag } from "../../../../components/docs/DocsHeader";
import ArrowLink from "../../../../components/ui/ArrowLink";
import ContentSection, { BlockLabel } from "../../../../components/ui/ContentSection";
import Reveal from "../../../../components/motion/Reveal";
import RelatedContent from "../../../../components/ai-lab/RelatedContent";
import JsonLd from "../../../../components/JsonLd";
import Diagrams, { DiagramFigure } from "../../../../components/diagrams/DiagramFigure";
import { client } from "../../../../sanity/lib/client";
import { automationBySlugQuery, automationSlugsQuery } from "../../../../sanity/lib/queries";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../../../lib/site";
import { aiLabLabel } from "../../../../lib/navigation";
import type { AutomationDetail } from "../../../../lib/content-types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(automationSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const automation: AutomationDetail | null = await client.fetch(automationBySlugQuery, { slug });
  if (!automation) return {};
  return buildMetadata({
    title: `${automation.title} — ${aiLabLabel("/ai-lab/automations")} — PromptAtWork`,
    description: automation.description,
    path: `/ai-lab/automations/${automation.slug}`,
    type: "article",
    image: automation.cardImage,
  });
}

export default async function AutomationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const automation: AutomationDetail | null = await client.fetch(automationBySlugQuery, { slug });
  if (!automation) notFound();

  return (
    <PageTransition key={slug}>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Lab", path: "/ai-lab" },
          { name: aiLabLabel("/ai-lab/automations"), path: "/ai-lab/automations" },
          { name: automation.title, path: `/ai-lab/automations/${automation.slug}` },
        ])}
      />
      <DocsArticle>
        <DocsHeader
          eyebrow={["Automation", automation.category].filter(Boolean).join(" / ")}
          title={automation.title}
          description={automation.description}
        >
          {automation.tools && automation.tools.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {automation.tools.map((t) => (
                <ArrowLink key={t.slug} href={`/ai-lab/tools/${t.slug}`} size="sm">
                  {t.name}
                </ArrowLink>
              ))}
            </div>
          )}
        </DocsHeader>

        <div className="flex flex-col gap-10">
          <Diagrams items={automation.diagrams} at="top" />
          {/* The automation's own steps are always drawn as a flow, so every
              automation has its core process diagram even before authored
              diagrams are added. */}
          {automation.steps && automation.steps.length > 1 && (
            <div className="flex flex-col gap-4">
              <Reveal>
                <BlockLabel>Workflow</BlockLabel>
              </Reveal>
              <DiagramFigure
                d={{
                  key: "workflow-steps",
                  title: automation.trigger ? `From “${automation.trigger}” to result` : "Workflow",
                  kind: "flow",
                  steps: automation.steps.map((step, i, all) => ({
                    label: step.label,
                    detail: step.description,
                    kind: i === 0 && automation.trigger ? "trigger" : i === all.length - 1 ? "output" : "action",
                  })),
                }}
              />
            </div>
          )}
          <Diagrams items={automation.diagrams} at="workflow" />

          <ContentSection heading="Problem" body={automation.problem} />
          <Diagrams items={automation.diagrams} at="problem" />
          <ContentSection heading="Architecture" body={automation.architecture} />
          <Diagrams items={automation.diagrams} at="architecture" />
          <ContentSection heading="Input" body={automation.input} />
          <Diagrams items={automation.diagrams} at="input" />
          <ContentSection heading="Output" body={automation.output} />
          <Diagrams items={automation.diagrams} at="output" />

          {automation.integrations && automation.integrations.length > 0 && (
            <Reveal className="flex flex-col gap-3">
              <BlockLabel>Integrations</BlockLabel>
              <div className="flex flex-wrap gap-1.5">
                {automation.integrations.map((i) => (
                  <DocsTag key={i}>{i}</DocsTag>
                ))}
              </div>
            </Reveal>
          )}
          <Diagrams items={automation.diagrams} at="integrations" />

          <ContentSection heading="Limitations" body={automation.limitations} />
          <ContentSection heading="Security Notes" body={automation.securityNotes} />
          <ContentSection heading="Learnings" body={automation.learnings} />

          <RelatedContent items={automation.relatedContent} />
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
