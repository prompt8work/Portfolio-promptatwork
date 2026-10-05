import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry } from "../../../components/docs/DocsHeader";
import { client } from "../../../sanity/lib/client";
import { experimentsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "AI Experiments — Hands-On LLM & RAG Tests by Niharika Dhande | PromptAtWork",
  description: "Hands-on AI experiments by Niharika Dhande: the objective, setup, what worked, what failed and what was learned.",
  path: "/ai-lab/experiments",
});

export const revalidate = 60;

type ExperimentListItem = {
  slug: string;
  title: string;
  objective: string;
  toolName?: string;
};

export default async function ExperimentsPage() {
  const experiments: ExperimentListItem[] = await client.fetch(experimentsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader
          eyebrow="AI Lab / Experiments"
          title="Experiments"
          description="Objective → setup → what worked, what failed, what was learned — documented as I build, not written up after the fact."
        />
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
              cta="Read the experiment"
            >
              <p className="text-[15.5px] leading-[1.75] text-neutral-700">{e.objective}</p>
            </DocsEntry>
          ))}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
