import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry } from "../../../components/docs/DocsHeader";
import { client } from "../../../sanity/lib/client";
import { promptsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Prompt Library — AI Lab — PromptAtWork",
  description: "Categorized, copyable prompts with example input/output.",
  path: "/ai-lab/prompts",
});

export const revalidate = 60;

type PromptListItem = {
  slug: string;
  title: string;
  category: string;
  purpose?: string;
  toolName?: string;
};

export default async function PromptsPage() {
  const prompts: PromptListItem[] = await client.fetch(promptsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader
          eyebrow="AI Lab / Prompt Library"
          title="Prompt Library"
          description="Categorized, copyable prompts with example input and output — real templates behind real projects, not generic starter examples."
        />
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
              cta="View and copy the prompt"
            >
              {p.purpose && <p className="text-[15.5px] leading-[1.75] text-neutral-700">{p.purpose}</p>}
            </DocsEntry>
          ))}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
