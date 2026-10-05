import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import Callout from "../../../components/docs/Callout";
import DocsHeader, { DocsEntry } from "../../../components/docs/DocsHeader";
import { client } from "../../../sanity/lib/client";
import { automationsQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "AI Workflow Automations — End-to-End AI Automation Builds | PromptAtWork",
  description: "AI workflow automations by Niharika Dhande, laid out end to end: trigger → input → AI processing → decision → action → output.",
  path: "/ai-lab/automations",
});

export const revalidate = 60;

type AutomationListItem = {
  slug: string;
  title: string;
  description: string;
  trigger?: string;
};

export default async function AutomationsPage() {
  const automations: AutomationListItem[] = await client.fetch(automationsQuery);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader
          eyebrow="AI Lab / Automations"
          title="Automations"
          description="Trigger → input → AI processing → decision → action → output, laid out end to end for each real workflow."
        />
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
              cta="See the workflow"
            >
              <p className="text-[15.5px] leading-[1.75] text-neutral-700">{a.description}</p>
            </DocsEntry>
          ))}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
