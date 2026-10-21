import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry, DocsTag } from "../../../components/docs/DocsHeader";
import CountUp from "../../../components/motion/CountUp";
import Thumb from "../../../components/paw/Thumb";
import { client } from "../../../sanity/lib/client";
import { projectsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";
import { getPage, type ProjectListItem } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("ai-lab-work");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/ai-lab/work" });
}

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

// `visibility != "private"` is already filtered in the query itself
// (see queries.ts) — defense-in-depth, not just a UI-level hide.
export default async function WorkPage() {
  const page = await getPage("ai-lab-work");
  const projects: ProjectListItem[] = await client.fetch(projectsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader eyebrow={page.eyebrow} title={page.title ?? ""} description={page.intro} />
        {projects.length === 0 && (
          <Callout title="Nothing published yet">No case studies are published yet. New entries appear here as they&apos;re written up.</Callout>
        )}
        <div>
          {projects.map((p) => (
            <DocsEntry
              key={p.slug}
              id={p.slug}
              eyebrow={p.category}
              title={p.title}
              href={`/ai-lab/work/${p.slug}`}
              media={p.coverImage && <Thumb image={p.coverImage} sizes="(max-width: 640px) 100vw, 220px" />}
              cta="Read the case study"
            >
              <p className="text-[15.5px] leading-[1.75] text-on-surface-variant">{p.summary}</p>
              {p.stats && p.stats.length > 0 && (
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {p.stats.map((s) => (
                    <CountUp key={s} value={s} className="font-mono text-[12.5px] font-semibold text-primary" />
                  ))}
                </div>
              )}
              {p.tech && p.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <DocsTag key={t}>{t}</DocsTag>
                  ))}
                </div>
              )}
            </DocsEntry>
          ))}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
