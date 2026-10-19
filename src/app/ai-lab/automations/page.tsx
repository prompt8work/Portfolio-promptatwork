import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry } from "../../../components/docs/DocsHeader";
import Thumb from "../../../components/paw/Thumb";
import { client } from "../../../sanity/lib/client";
import { automationsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";
import { getPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("ai-lab-automations");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/ai-lab/automations" });
}

export const revalidate = 60;

type AutomationListItem = {
  slug: string;
  title: string;
  description: string;
  trigger?: string;
  cardImage?: string;
};

export default async function AutomationsPage() {
  const page = await getPage("ai-lab-automations");
  const automations: AutomationListItem[] = await client.fetch(automationsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader eyebrow={page.eyebrow} title={page.title ?? ""} description={page.intro} />
        {automations.length === 0 && (
          <Callout title="Nothing published yet">No automations are published yet. New entries appear here as they&apos;re written up.</Callout>
        )}
        <div>
          {automations.map((a) => (
            <DocsEntry
              key={a.slug}
              id={a.slug}
              eyebrow={a.trigger && `Trigger: ${a.trigger}`}
              title={a.title}
              href={`/ai-lab/automations/${a.slug}`}
              media={a.cardImage && <Thumb image={a.cardImage} sizes="(max-width: 640px) 100vw, 220px" />}
              cta="See the workflow"
            >
              <p className="text-[15.5px] leading-[1.75] text-on-surface-variant">{a.description}</p>
            </DocsEntry>
          ))}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
