import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader from "../../../components/docs/DocsHeader";
import ToolsFilterGrid, { type ToolListItem } from "../../../components/ai-lab/ToolsFilterGrid";
import { client } from "../../../sanity/lib/client";
import { toolsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";
import { getPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("ai-lab-tools");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/ai-lab/tools" });
}

export const revalidate = 60;

export default async function ToolsPage() {
  const page = await getPage("ai-lab-tools");
  const tools: ToolListItem[] = await client.fetch(toolsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader eyebrow={page.eyebrow} title={page.title ?? ""} description={page.intro} />
        {tools.length > 0 ? (
          <ToolsFilterGrid tools={tools} />
        ) : (
          <Callout title="Nothing published yet">No tool reviews are published yet. New entries appear here as they&apos;re written up.</Callout>
        )}
      </DocsArticle>
    </PageTransition>
  );
}
