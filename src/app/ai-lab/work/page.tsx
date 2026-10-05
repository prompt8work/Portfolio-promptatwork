import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry, DocsTag } from "../../../components/docs/DocsHeader";
import CountUp from "../../../components/motion/CountUp";
import { client } from "../../../sanity/lib/client";
import { projectsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Work & Case Studies — AI Lab — PromptAtWork",
  description:
    "Full-Stack AI and agentic AI case studies: the problem, how it was solved, and the future scope, linked to every page that documents each project.",
  path: "/ai-lab/work",
});

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

type ProjectListItem = {
  slug: string;
  title: string;
  category?: string;
  summary: string;
  stats?: string[];
  tech?: string[];
};

// `visibility != "private"` is already filtered in the query itself
// (see queries.ts) — defense-in-depth, not just a UI-level hide.
export default async function WorkPage() {
  const projects: ProjectListItem[] = await client.fetch(projectsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader
          eyebrow="AI Lab / Work"
          title="Work & Case Studies"
          description="Every project in one scroll: what it is, the numbers that matter and the stack behind it. Open any case study for the full problem → solution → future scope write-up, linked to every page that documents the same project."
        />
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
              cta="Read the case study"
            >
              <p className="text-[15.5px] leading-[1.75] text-neutral-700">{p.summary}</p>
              {p.stats && p.stats.length > 0 && (
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {p.stats.map((s) => (
                    <CountUp key={s} value={s} className="font-mono text-[12.5px] font-semibold text-cyan-700" />
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
