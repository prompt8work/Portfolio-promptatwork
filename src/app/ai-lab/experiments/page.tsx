import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry } from "../../../components/docs/DocsHeader";
import Thumb from "../../../components/paw/Thumb";
import { client } from "../../../sanity/lib/client";
import { experimentsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";
import { getPage, type ExperimentListItem } from "../../../lib/content";
import ExperimentStatusTag from "../../../components/ai-lab/ExperimentStatusTag";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("ai-lab-experiments");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/ai-lab/experiments" });
}

export const revalidate = 60;

export default async function ExperimentsPage() {
  const page = await getPage("ai-lab-experiments");
  const experiments: ExperimentListItem[] = await client.fetch(experimentsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader eyebrow={page.eyebrow} title={page.title ?? ""} description={page.intro} />
        {experiments.length === 0 && (
          <Callout title="Nothing published yet">No experiments are published yet. New entries appear here as they&apos;re written up.</Callout>
        )}
        <div>
          {experiments.map((e) => (
            <DocsEntry
              key={e.slug}
              id={e.slug}
              eyebrow={e.toolName}
              title={e.title}
              href={`/ai-lab/experiments/${e.slug}`}
              media={e.cardImage && <Thumb image={e.cardImage} sizes="(max-width: 640px) 100vw, 220px" />}
              cta="Read the experiment"
            >
              <div className="paw-tags">
                <ExperimentStatusTag status={e.status} />
              </div>
              <p className="text-[15.5px] leading-[1.75] text-on-surface-variant">{e.objective}</p>
            </DocsEntry>
          ))}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
