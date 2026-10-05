import type { Metadata } from "next";
import PageTransition from "../../../components/PageTransition";
import DocsArticle from "../../../components/docs/DocsArticle";
import DocsHeader, { DocsTag } from "../../../components/docs/DocsHeader";
import ArrowLink from "../../../components/ui/ArrowLink";
import Reveal from "../../../components/motion/Reveal";
import { client } from "../../../sanity/lib/client";
import { engineeringAreasQuery } from "../../../sanity/lib/queries";
import { buildMetadata } from "../../../lib/site";

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Engineering — AI Lab — PromptAtWork",
  description:
    "Full-Stack AI Engineering, RAG & Retrieval, Generative AI, Agentic AI and AI Automation — each grounded in real, shipped work.",
  path: "/ai-lab/engineering",
});

type Evidence = { _type: string; slug: string; title: string };
type EngineeringArea = { id: string; title: string; description: string; items?: string[] | null; evidence: Evidence[] };

const evidenceBase: Record<string, string> = {
  project: "/ai-lab/work",
  automation: "/ai-lab/automations",
  prompt: "/ai-lab/prompts",
  experiment: "/ai-lab/experiments",
  tool: "/ai-lab/tools",
};
// Case studies first, since they're the fullest proof; then the entries that
// document a single piece of work.
const evidenceRank = ["project", "automation", "experiment", "prompt", "tool"];

export default async function EngineeringPage() {
  const areas: EngineeringArea[] = await client.fetch(engineeringAreasQuery);
  // An area with nothing published behind it isn't shown (content doc §32).
  const shown = areas.filter((a) => a.evidence.length > 0);

  return (
    <PageTransition>
      <DocsArticle>
        <DocsHeader
          eyebrow="AI Lab / Engineering"
          title="Generative AI, Agentic AI & Full-Stack AI Development"
          description="A software engineering foundation applied to Generative AI. Each area below links to the real project or content behind it."
        />

        <div>
          {shown.map((s, i) => {
            const evidence = [...s.evidence].sort(
              (a, b) => evidenceRank.indexOf(a._type) - evidenceRank.indexOf(b._type),
            );
            return (
              <Reveal key={s.id} className="py-8 first:pt-0 border-t border-neutral-200 first:border-t-0">
                <section className="flex flex-col gap-3">
                  <span className="font-mono text-[10.5px] tracking-[0.14em] font-semibold text-neutral-500">
                    {`${String(i + 1).padStart(2, "0")} — ${s.title.toUpperCase()}`}
                  </span>
                  <h2
                    id={s.id}
                    className="scroll-mt-28 font-sans text-[21px] sm:text-[22px] font-semibold tracking-tight text-neutral-900"
                  >
                    {s.title}
                  </h2>
                  <p className="text-[15.5px] leading-[1.75] text-neutral-700">{s.description}</p>
                  {s.items && s.items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map((item) => (
                        <DocsTag key={item}>{item}</DocsTag>
                      ))}
                    </div>
                  )}
                  <div className="pt-1 flex flex-col gap-1.5">
                    {evidence.map((e) => (
                      <ArrowLink key={`${e._type}-${e.slug}`} href={`${evidenceBase[e._type]}/${e.slug}`} size="sm">
                        Evidence: {e.title}
                      </ArrowLink>
                    ))}
                  </div>
                </section>
              </Reveal>
            );
          })}
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
