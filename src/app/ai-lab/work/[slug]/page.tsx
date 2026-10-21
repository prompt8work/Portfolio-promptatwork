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
import RelatedContent from "../../../../components/ai-lab/RelatedContent";
import JsonLd from "../../../../components/JsonLd";
import Diagrams from "../../../../components/diagrams/DiagramFigure";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../../../lib/site";
import { aiLabLabel } from "../../../../lib/navigation";
import type { ProjectDetail } from "../../../../lib/content-types";

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
    image: project.coverImage,
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
          { name: aiLabLabel("/ai-lab/work"), path: "/ai-lab/work" },
          { name: project.title, path: `/ai-lab/work/${project.slug}` },
        ])}
      />
      <DocsArticle>
        <DocsHeader eyebrow={["Case study", project.category].filter(Boolean).join(" / ")} title={project.title} description={project.summary}>
          {project.stats && project.stats.length > 0 && (
            <div className="flex gap-x-5 gap-y-1 flex-wrap">
              {project.stats.map((s) => (
                <CountUp key={s} value={s} className="font-mono text-[13px] text-primary font-semibold" />
              ))}
            </div>
          )}
          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <DocsTag key={t}>{t}</DocsTag>
              ))}
            </div>
          )}
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
            <Reveal className="bg-surface-container border border-line rounded-xl p-5">
              <p className="text-[13.5px] text-muted leading-relaxed">
                <span className="font-semibold text-on-surface">Confidentiality note: </span>
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
