import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import PageTransition from "../../../../components/PageTransition";
import DocsArticle from "../../../../components/docs/DocsArticle";
import DocsHeader, { DocsTag } from "../../../../components/docs/DocsHeader";
import ArrowLink from "../../../../components/ui/ArrowLink";
import ContentSection, { BlockLabel, ListSection } from "../../../../components/ui/ContentSection";
import Reveal from "../../../../components/motion/Reveal";
import MotionCard from "../../../../components/motion/MotionCard";
import { StaggerGrid, StaggerItem } from "../../../../components/motion/StaggerGrid";
import RelatedContent, { type RelatedItem } from "../../../../components/ai-lab/RelatedContent";
import JsonLd from "../../../../components/JsonLd";
import Diagrams from "../../../../components/diagrams/DiagramFigure";
import type { Diagram } from "../../../../components/diagrams/types";
import { client } from "../../../../sanity/lib/client";
import { toolBySlugQuery, toolSlugsQuery } from "../../../../sanity/lib/queries";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../../../lib/site";

export const revalidate = 60;

type ToolResource = {
  title: string;
  resourceType: string;
  description?: string;
  version?: string;
  publishedAt?: string;
  updatedAt?: string;
  fileUrl?: string;
  fileName?: string;
};

type ToolDetail = {
  slug: string;
  name: string;
  cardImage?: string;
  type?: string;
  category?: string;
  tags?: string[];
  description: string;
  officialUrl?: string;
  pricing?: string;
  overview?: string;
  whatItDoes?: string;
  whyExplored?: string;
  researchContent?: string;
  useCases?: string[];
  practicalScenarios?: string;
  strengths?: string[];
  limitations?: string[];
  myExperience?: string;
  researchStatus?: string;
  lastUpdated?: string;
  reviewedVersion?: string;
  lastReviewed?: string;
  sources?: { label: string; url: string }[];
  relatedVideos?: { slug: string; title: string; thumbnailUrl?: string; externalUrl: string }[];
  resources?: ToolResource[];
  relatedContent?: RelatedItem[];
  diagrams?: Diagram[];
  relatedExperiments?: { slug: string; title: string; objective?: string }[];
  relatedBlogs?: { slug: string; title: string; excerpt?: string }[];
  relatedProjects?: { slug: string; title: string; summary?: string }[];
};

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(toolSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool: ToolDetail | null = await client.fetch(toolBySlugQuery, { slug });
  if (!tool) return {};
  return buildMetadata({
    title: `${tool.name} — Tools & Research — PromptAtWork`,
    description: tool.description,
    path: `/ai-lab/tools/${tool.slug}`,
    type: "article",
    image: tool.cardImage,
  });
}

function LinkList({ heading, id, children }: { heading: string; id?: string; children: ReactNode }) {
  return (
    <Reveal className="flex flex-col gap-3">
      <BlockLabel id={id}>{heading}</BlockLabel>
      <div className="flex flex-col gap-2">{children}</div>
    </Reveal>
  );
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool: ToolDetail | null = await client.fetch(toolBySlugQuery, { slug });
  if (!tool) notFound();

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${tool.name} — Research & Review`,
    description: tool.description,
    ...(tool.lastUpdated ? { dateModified: tool.lastUpdated } : {}),
    author: { "@type": "Person", name: "Niharika Dhande" },
  };

  return (
    <PageTransition key={slug}>
      <JsonLd data={techArticleJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Lab", path: "/ai-lab" },
          { name: "Tools & Research", path: "/ai-lab/tools" },
          { name: tool.name, path: `/ai-lab/tools/${tool.slug}` },
        ])}
      />
      <DocsArticle>
        <DocsHeader
          eyebrow={["Tools & Research", tool.category, tool.type && tool.type !== "Tool" ? tool.type : null]
            .filter(Boolean)
            .join(" / ")}
          title={tool.name}
          description={tool.description}
        >
          {(tool.officialUrl || tool.pricing) && (
            <div className="flex gap-4 flex-wrap items-center">
              {tool.officialUrl && (
                <ArrowLink href={tool.officialUrl} external size="sm">
                  Official site
                </ArrowLink>
              )}
              {tool.pricing && <span className="text-sm text-muted">{tool.pricing}</span>}
            </div>
          )}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.map((t) => (
                <DocsTag key={t}>{t}</DocsTag>
              ))}
            </div>
          )}
          {(tool.lastUpdated || tool.reviewedVersion || tool.lastReviewed) && (
            <div className="flex gap-4 flex-wrap text-xs text-muted">
              {tool.lastUpdated && (
                <span>
                  Last updated{" "}
                  {new Date(tool.lastUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              )}
              {tool.reviewedVersion && <span>Reviewed version: {tool.reviewedVersion}</span>}
              {tool.lastReviewed && <span>Last reviewed: {tool.lastReviewed}</span>}
            </div>
          )}
        </DocsHeader>

        <div className="flex flex-col gap-10">
          <Diagrams items={tool.diagrams} at="top" />
          <ContentSection heading="Overview" body={tool.overview} />
          <Diagrams items={tool.diagrams} at="overview" />
          <ContentSection heading="What It Does" body={tool.whatItDoes} />
          <Diagrams items={tool.diagrams} at="whatItDoes" />
          <ContentSection heading="Why I Explored It" body={tool.whyExplored} />
          <Diagrams items={tool.diagrams} at="whyExplored" />
          <ContentSection id="research" heading="Research" body={tool.researchContent} />
          <Diagrams items={tool.diagrams} at="research" />
          <ListSection id="best-use-cases" heading="Best Use Cases" items={tool.useCases} />
          <Diagrams items={tool.diagrams} at="useCases" />
          <ListSection id="limitations" heading="Limitations & Less-Suitable Scenarios" items={tool.limitations} marker="−" />
          <ContentSection heading="Practical Scenarios" body={tool.practicalScenarios} />
          <Diagrams items={tool.diagrams} at="practicalScenarios" />
          <ContentSection heading="My Experience" body={tool.myExperience} />
          <Diagrams items={tool.diagrams} at="myExperience" />
          <ListSection heading="Strengths" items={tool.strengths} marker="+" />

          {tool.relatedVideos && tool.relatedVideos.length > 0 && (
            <LinkList heading="Videos" id="videos">
              {tool.relatedVideos.map((v) => (
                <ArrowLink key={v.slug} href={v.externalUrl} external size="sm">
                  ▶ {v.title}
                </ArrowLink>
              ))}
            </LinkList>
          )}

          {tool.resources && tool.resources.length > 0 && (
            <Reveal className="flex flex-col gap-3">
              <BlockLabel id="resources">Learning Resources</BlockLabel>
              <StaggerGrid className="flex flex-col gap-2">
                {tool.resources.map((r) => (
                  <StaggerItem key={r.title}>
                    <MotionCard className="bg-card border border-line rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[10px] tracking-[0.12em] text-primary">
                          {r.resourceType.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-ink">{r.title}</span>
                        {r.description && <span className="text-xs text-muted">{r.description}</span>}
                      </div>
                      {r.fileUrl && (
                        <ArrowLink href={r.fileUrl} external size="sm">
                          Download
                        </ArrowLink>
                      )}
                    </MotionCard>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Reveal>
          )}

          {tool.relatedProjects && tool.relatedProjects.length > 0 && (
            <LinkList heading="Used In" id="used-in">
              {tool.relatedProjects.map((p) => (
                <ArrowLink key={p.slug} href={`/ai-lab/work/${p.slug}`} size="sm">
                  {p.title}
                </ArrowLink>
              ))}
            </LinkList>
          )}

          {tool.relatedExperiments && tool.relatedExperiments.length > 0 && (
            <LinkList heading="Related Experiments">
              {tool.relatedExperiments.map((e) => (
                <ArrowLink key={e.slug} href={`/ai-lab/experiments/${e.slug}`} size="sm">
                  {e.title}
                </ArrowLink>
              ))}
            </LinkList>
          )}

          {tool.relatedBlogs && tool.relatedBlogs.length > 0 && (
            <LinkList heading="Related Blog Posts">
              {tool.relatedBlogs.map((b) => (
                <ArrowLink key={b.slug} href={`/blog/${b.slug}`} size="sm">
                  {b.title}
                </ArrowLink>
              ))}
            </LinkList>
          )}

          {tool.sources && tool.sources.length > 0 && (
            <LinkList heading="Sources">
              {tool.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-muted hover:text-primary"
                >
                  {s.label} ↗
                </a>
              ))}
            </LinkList>
          )}

          <RelatedContent items={tool.relatedContent} />
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
