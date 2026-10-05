import type { Metadata } from "next";
import Link from "next/link";
import PageTransition from "../../components/PageTransition";
import DocsArticle from "../../components/docs/DocsArticle";
import Callout, { InlineCode } from "../../components/docs/Callout";
import WordReveal from "../../components/motion/WordReveal";
import IntroFade from "../../components/motion/IntroFade";
import Reveal from "../../components/motion/Reveal";
import { buildMetadata } from "../../lib/site";
import { client } from "../../sanity/lib/client";
import { aiLabOverviewQuery } from "../../sanity/lib/queries";

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "AI Lab — Generative & Agentic AI Projects by Niharika Dhande | PromptAtWork",
  description:
    "Generative AI and agentic AI work by Niharika Dhande: case studies, engineering capabilities and automations, each explained step by step with process diagrams — in one place.",
  path: "/ai-lab",
});

type Part = { _type: string; slug: string; title: string };
type Overview = {
  projects: { slug: string; title: string; category?: string; summary: string; parts?: (Part | null)[] | null }[];
  counts: Record<"tools" | "experiments" | "prompts" | "automations", number>;
};

const partHref: Record<string, string> = {
  automation: "/ai-lab/automations",
  tool: "/ai-lab/tools",
  prompt: "/ai-lab/prompts",
  experiment: "/ai-lab/experiments",
};
const partLabel: Record<string, string> = {
  automation: "Automation",
  tool: "Tool",
  prompt: "Prompt",
  experiment: "Experiment",
};

const headline = "Real projects, documented end to end.";

export default async function AiLabPage() {
  const { projects, counts }: Overview = await client.fetch(aiLabOverviewQuery);

  // Sections with nothing published yet are left out, like in the sidebar.
  const sections = [
    { href: "/ai-lab/work", label: "Work & Case Studies", body: "The problem, how it was solved, and the future scope." },
    { href: "/ai-lab/engineering", label: "Engineering", body: "Each capability, linked to the project that proves it." },
    counts.automations > 0 && {
      href: "/ai-lab/automations",
      label: "Automations",
      body: "Pipelines and connectors from those projects, laid out step by step.",
    },
    counts.tools > 0 && { href: "/ai-lab/tools", label: "Tools & Research", body: "Hands-on reviews of the tools used." },
    counts.prompts > 0 && { href: "/ai-lab/prompts", label: "Prompt Library", body: "Reusable prompt templates." },
    counts.experiments > 0 && {
      href: "/ai-lab/experiments",
      label: "Experiments",
      body: "What worked, what failed and what was decided.",
    },
  ].filter((s): s is { href: string; label: string; body: string } => Boolean(s));

  return (
    <PageTransition>
      <DocsArticle>
        <header className="pb-10 border-b border-neutral-200">
          <IntroFade as="span" className="font-mono text-xs tracking-[0.14em] font-semibold text-cyan-700">
            AI LAB
          </IntroFade>
          <WordReveal
            as="h1"
            className="mt-4 font-display text-[40px] sm:text-[56px] leading-[1.04] font-semibold tracking-tight text-neutral-900"
          >
            {headline}
          </WordReveal>
          <IntroFade as="p" after={headline} step={1} className="mt-6 text-[18px] leading-relaxed text-neutral-600 max-w-[560px]">
            Each project is written up as a case study and split into pages for its parts. Every page explains the
            process in text and diagrams and links to the rest of the same project.
          </IntroFade>
          <IntroFade after={headline} step={2} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ai-lab/work"
              className="motion-btn inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-neutral-800 hover:text-white"
            >
              Read the case studies
            </Link>
          </IntroFade>
        </header>

        <div className="mt-10">
          <h2 id="projects" className="font-sans text-[26px] font-semibold tracking-tight text-neutral-900 scroll-mt-28">
            Projects
          </h2>
          <div className="mt-5 flex flex-col gap-5">
            {projects.map((p) => {
              const parts = (p.parts ?? []).filter((r): r is Part => Boolean(r?.slug && partHref[r._type]));
              return (
                <Reveal key={p.slug} className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
                  {p.category && (
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-cyan-700 font-semibold">{p.category}</p>
                  )}
                  <h3 className="mt-1.5 text-[20px] font-semibold tracking-tight text-neutral-900">
                    <Link href={`/ai-lab/work/${p.slug}`} className="hover:text-cyan-700">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[15.5px] leading-[1.7] text-neutral-700">{p.summary}</p>
                  <ol className="mt-4 flex flex-col gap-1.5 border-t border-neutral-100 pt-4">
                    {[{ label: "Case study", title: p.title, href: `/ai-lab/work/${p.slug}` }, ...parts.map((r) => ({
                      label: partLabel[r._type],
                      title: r.title,
                      href: `${partHref[r._type]}/${r.slug}`,
                    }))].map((page, i) => (
                      <li key={page.href} className="flex gap-3 text-[14.5px]">
                        <span className="font-mono text-[11px] text-neutral-400 pt-1">{String(i + 1).padStart(2, "0")}</span>
                        <span>
                          <span className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-neutral-500 mr-2">{page.label}</span>
                          <Link href={page.href} className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-cyan-600">
                            {page.title}
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              );
            })}
          </div>

          <h2 id="sections" className="mt-14 font-sans text-[26px] font-semibold tracking-tight text-neutral-900 scroll-mt-28">
            Sections
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {sections.map((s) => (
              <li key={s.href} className="text-[15.5px] leading-[1.75] text-neutral-700">
                <Link href={s.href} className="font-semibold">
                  {s.label}
                </Link>{" "}
                — {s.body}
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <Callout title="Unsure where to start?">
              Press <InlineCode>⌘K</InlineCode> (or <InlineCode>Ctrl K</InlineCode>) to search everything in the lab.
              If that&apos;s not enough, <Link href="/contact">ask me directly</Link>.
            </Callout>
          </div>
        </div>
      </DocsArticle>
    </PageTransition>
  );
}
