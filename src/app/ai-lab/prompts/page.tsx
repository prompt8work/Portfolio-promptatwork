import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry } from "../../../components/docs/DocsHeader";
import Thumb from "../../../components/paw/Thumb";
import { client } from "../../../sanity/lib/client";
import { promptsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";
import { getPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("ai-lab-prompts");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/ai-lab/prompts" });
}

export const revalidate = 60;

type PromptListItem = {
  slug: string;
  title: string;
  category: string;
  purpose?: string;
  toolName?: string;
  cardImage?: string;
};

export default async function PromptsPage() {
  const page = await getPage("ai-lab-prompts");
  const prompts: PromptListItem[] = await client.fetch(promptsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader eyebrow={page.eyebrow} title={page.title ?? ""} description={page.intro} />
        {prompts.length === 0 && (
          <Callout title="Nothing published yet">No prompts are published yet. New entries appear here as they&apos;re written up.</Callout>
        )}
        <div>
          {prompts.map((p) => (
            <DocsEntry
              key={p.slug}
              id={p.slug}
              eyebrow={[p.category, p.toolName].filter(Boolean).join(" · ")}
              title={p.title}
              href={`/ai-lab/prompts/${p.slug}`}
              media={p.cardImage && <Thumb image={p.cardImage} sizes="(max-width: 640px) 100vw, 220px" />}
              cta="View and copy the prompt"
            >
              {p.purpose && <p className="text-[15.5px] leading-[1.75] text-on-surface-variant">{p.purpose}</p>}
            </DocsEntry>
          ))}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
