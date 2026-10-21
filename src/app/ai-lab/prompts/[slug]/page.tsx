import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "../../../../components/PageTransition";
import DocsArticle from "../../../../components/docs/DocsArticle";
import DocsHeader, { DocsTag } from "../../../../components/docs/DocsHeader";
import ArrowLink from "../../../../components/ui/ArrowLink";
import CopyPromptButton from "../../../../components/ai-lab/CopyPromptButton";
import ContentSection, { BlockLabel, ListSection } from "../../../../components/ui/ContentSection";
import Reveal from "../../../../components/motion/Reveal";
import RelatedContent from "../../../../components/ai-lab/RelatedContent";
import JsonLd from "../../../../components/JsonLd";
import Diagrams from "../../../../components/diagrams/DiagramFigure";
import { client } from "../../../../sanity/lib/client";
import { promptBySlugQuery, promptSlugsQuery } from "../../../../sanity/lib/queries";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../../../lib/site";
import { aiLabLabel } from "../../../../lib/navigation";
import type { PromptDetail } from "../../../../lib/content-types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(promptSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const prompt: PromptDetail | null = await client.fetch(promptBySlugQuery, { slug });
  if (!prompt) return {};
  return buildMetadata({
    title: `${prompt.title} — ${aiLabLabel("/ai-lab/prompts")} — PromptAtWork`,
    description: prompt.purpose || prompt.title,
    path: `/ai-lab/prompts/${prompt.slug}`,
    type: "article",
    image: prompt.cardImage,
  });
}

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt: PromptDetail | null = await client.fetch(promptBySlugQuery, { slug });
  if (!prompt) notFound();

  return (
    <PageTransition key={slug}>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Lab", path: "/ai-lab" },
          { name: aiLabLabel("/ai-lab/prompts"), path: "/ai-lab/prompts" },
          { name: prompt.title, path: `/ai-lab/prompts/${prompt.slug}` },
        ])}
      />
      <DocsArticle>
        <DocsHeader
          eyebrow={["Prompt", prompt.category, prompt.difficulty].filter(Boolean).join(" / ")}
          title={prompt.title}
          description={prompt.purpose}
        >
          {prompt.tool && (
            <ArrowLink href={`/ai-lab/tools/${prompt.tool.slug}`} size="sm">
              Used with {prompt.tool.name}
            </ArrowLink>
          )}
        </DocsHeader>

        <div className="flex flex-col gap-10">
          <Diagrams items={prompt.diagrams} at="top" />
          <Reveal className="flex flex-col gap-3">
            <BlockLabel>Prompt</BlockLabel>
            <pre className="whitespace-pre-wrap font-mono text-[13.5px] leading-relaxed text-on-surface bg-card border border-line rounded-xl p-5">
              {prompt.prompt}
            </pre>
            <CopyPromptButton text={prompt.prompt} />
          </Reveal>
          <Diagrams items={prompt.diagrams} at="prompt" />

          {prompt.variables && prompt.variables.length > 0 && (
            <Reveal className="flex flex-col gap-3">
              <BlockLabel>Variables</BlockLabel>
              <div className="flex flex-wrap gap-1.5">
                {prompt.variables.map((v) => (
                  <DocsTag key={v}>{`{{${v}}}`}</DocsTag>
                ))}
              </div>
            </Reveal>
          )}

          <ContentSection heading="Example Input" body={prompt.exampleInput} />
          <Diagrams items={prompt.diagrams} at="exampleInput" />
          <ContentSection heading="Example Output" body={prompt.exampleOutput} />
          <Diagrams items={prompt.diagrams} at="exampleOutput" />
          <ContentSection heading="Expected Behavior" body={prompt.expectedBehavior} />
          <Diagrams items={prompt.diagrams} at="expectedBehavior" />
          <ListSection heading="Failure Modes" items={prompt.failureModes} marker="−" />
          <Diagrams items={prompt.diagrams} at="failureModes" />
          <ContentSection heading="Tips" body={prompt.tips} />

          <RelatedContent items={prompt.relatedContent} />
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
