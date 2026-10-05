import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader from "../../../components/docs/DocsHeader";
import ToolsFilterGrid, { type ToolListItem } from "../../../components/ai-lab/ToolsFilterGrid";
import { client } from "../../../sanity/lib/client";
import { toolsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "AI Tools Research — Claude, Claude Code, Gemini, OpenAI & Groq Reviewed | PromptAtWork",
  description:
    "AI tools, features, concepts and platforms researched hands-on — reviews, practical use cases and learning resources.",
  path: "/ai-lab/tools",
});

export const revalidate = 60;

export default async function ToolsPage() {
  const tools: ToolListItem[] = await client.fetch(toolsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader
          eyebrow="AI Lab / Tools & Research"
          title="Tools & Research"
          description="Research, practical use cases, tutorials and learning resources for AI tools, features and concepts explored hands-on — not a generic feature comparison."
        />
        {tools.length > 0 ? (
          <ToolsFilterGrid tools={tools} />
        ) : (
          <Callout title="Nothing published yet">No tool reviews are published yet. New entries appear here as they&apos;re written up.</Callout>
        )}
      </DocsArticle>
    </PageTransition>
  );
}
