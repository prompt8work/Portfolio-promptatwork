import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "../../../../sanity/lib/client";
import { projectBySlugQuery, projectSlugsQuery } from "../../../../sanity/lib/queries";
import PageTransition from "../../../../components/PageTransition";
import DocsArticle from "../../../../components/docs/DocsArticle";
import DocsHeader, { DocsTag } from "../../../../components/docs/DocsHeader";
import ContentSection, { BlockLabel } from "../../../../components/ui/ContentSection";
import Reveal from "../../../../components/motion/Reveal";
import CountUp from "../../../../components/motion/CountUp";
import RelatedContent, { type RelatedItem } from "../../../../components/ai-lab/RelatedContent";
import JsonLd from "../../../../components/JsonLd";
import Diagrams from "../../../../components/diagrams/DiagramFigure";
import type { Diagram } from "../../../../components/diagrams/types";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../../../lib/site";

type ProjectDetail = {
  slug: string;
  title: string;
  category: string;
  visibility: "public" | "generalized" | "private";
  confidentialityNote?: string;
  summary: string;
  stats?: string[];
  tech: string[];
  aiModels?: string[];
  overview: string;
  problem: string;
  context: string;
  solution: string;
  role: string;
  architecture: string;
  workflow: string;
  challenges: string;
  results: string;
  learnings: string;
  futureScope?: string;
  relatedContent?: RelatedItem[];
  diagrams?: Diagram[];
};

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(projectSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/ai-lab/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project: ProjectDetail | null = await client.fetch(projectBySlugQuery, { slug });
  if (!project) return {};
  return buildMetadata({
    title: `${project.title} — PromptAtWork`,
    description: project.summary,
    path: `/ai-lab/work/${project.slug}`,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: PageProps<"/ai-lab/work/[slug]">) {
  const { slug } = await params;
  // "visibility != private" is filtered in the query itself (queries.ts) —
  // a guessed slug for a private project returns null here, not the doc.
  const project: ProjectDetail | null = await client.fetch(projectBySlugQuery, { slug });
  if (!project) notFound();

  return (
    <PageTransition key={slug}>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Lab", path: "/ai-lab" },
          { name: "Work & Case Studies", path: "/ai-lab/work" },
          { name: project.title, path: `/ai-lab/work/${project.slug}` },
        ])}
      />
      <DocsArticle>
        <DocsHeader eyebrow={`Case study / ${project.category}`} title={project.title} description={project.summary}>
          {project.stats && project.stats.length > 0 && (
            <div className="flex gap-x-5 gap-y-1 flex-wrap">
              {project.stats.map((s) => (
                <CountUp key={s} value={s} className="font-mono text-[13px] text-cyan-700 font-semibold" />
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <DocsTag key={t}>{t}</DocsTag>
            ))}
          </div>
        </DocsHeader>

        <div className="flex flex-col gap-10">
          <Diagrams items={project.diagrams} at="top" />
          <ContentSection heading="Overview" body={project.overview} />
          <Diagrams items={project.diagrams} at="overview" />
          <ContentSection heading="Problem" body={project.problem} />
          <Diagrams items={project.diagrams} at="problem" />
          <ContentSection heading="Context" body={project.context} />
          <Diagrams items={project.diagrams} at="context" />
          <ContentSection heading="Solution" body={project.solution} />
          <Diagrams items={project.diagrams} at="solution" />
          <ContentSection heading="My Role" body={project.role} />
          <Diagrams items={project.diagrams} at="role" />
          <ContentSection heading="Architecture" body={project.architecture} />
          <Diagrams items={project.diagrams} at="architecture" />
          <ContentSection heading="Workflow" body={project.workflow} />
          <Diagrams items={project.diagrams} at="workflow" />

          {project.aiModels && project.aiModels.length > 0 && (
            <Reveal className="flex flex-col gap-3">
              <BlockLabel>AI Models</BlockLabel>
              <div className="flex flex-wrap gap-1.5">
                {project.aiModels.map((m) => (
                  <DocsTag key={m}>{m}</DocsTag>
                ))}
              </div>
            </Reveal>
          )}

          <ContentSection heading="Challenges" body={project.challenges} />
          <Diagrams items={project.diagrams} at="challenges" />
          <ContentSection heading="Results" body={project.results} />
          <Diagrams items={project.diagrams} at="results" />
          <ContentSection heading="Learnings" body={project.learnings} />
          <Diagrams items={project.diagrams} at="learnings" />
          <ContentSection heading="Future Scope" body={project.futureScope} />
          <Diagrams items={project.diagrams} at="futureScope" />

          {project.confidentialityNote && (
            <Reveal className="bg-neutral-100 border border-neutral-200 rounded-xl p-5">
              <p className="text-[13.5px] text-neutral-600 leading-relaxed">
                <span className="font-semibold text-neutral-800">Confidentiality note: </span>
                {project.confidentialityNote}
              </p>
            </Reveal>
          )}

          <RelatedContent items={project.relatedContent} />
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
