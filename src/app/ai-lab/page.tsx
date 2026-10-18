import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import Callout, { InlineCode } from "../../components/docs/Callout";
import IntroFade from "../../components/motion/IntroFade";
import Reveal from "../../components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "../../components/motion/StaggerGrid";
import Tag, { type TagTone } from "../../components/paw/Tag";
import Thumb from "../../components/paw/Thumb";
import { staticCardImage, staticCardKey } from "../../lib/card-images/static";
import { aiLabHubSections } from "../../lib/navigation";
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
type Project = {
  slug: string;
  title: string;
  category?: string;
  summary: string;
  tech?: string[];
  problem?: string;
  solution?: string;
  futureScope?: string;
  flow?: { title?: string; steps?: string[] } | null;
  parts?: (Part | null)[] | null;
};
type Overview = {
  projects: Project[];
  engineering: { id: string; title: string; evidence: { title: string }[] }[];
  counts: Record<"tools" | "experiments" | "prompts" | "automations", number>;
};

const partHref: Record<string, string> = {
  automation: "/ai-lab/automations",
  tool: "/ai-lab/tools",
  prompt: "/ai-lab/prompts",
  experiment: "/ai-lab/experiments",
};
const partTone: Record<string, TagTone> = { automation: "warm", tool: "blue", prompt: "violet", experiment: "neutral" };
const tones: TagTone[] = ["blue", "violet", "warm"];
const toneText: Record<TagTone, string> = {
  blue: "text-primary",
  violet: "text-secondary",
  warm: "text-tertiary",
  neutral: "text-muted",
};
const toneFill: Record<TagTone, string> = {
  blue: "bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] text-primary",
  violet: "bg-[color-mix(in_srgb,var(--accent-violet)_16%,transparent)] text-secondary",
  warm: "bg-[color-mix(in_srgb,var(--tertiary-container)_18%,transparent)] text-tertiary",
  neutral: "bg-[color-mix(in_srgb,var(--text-secondary)_10%,transparent)] text-muted",
};

const validParts = (p: Project) => (p.parts ?? []).filter((r): r is Part => Boolean(r?.slug && partHref[r._type]));

// AI Lab overview (Page-AILab board): section cards with real counts, the
// newest case study featured with its own flow diagram's steps, the
// engineering capabilities with the entries that prove them, and an index
// of every project. The board's Grid/List toggle and index filters are left
// out: with this few projects they'd filter nothing.
export default async function AiLabPage() {
  const { projects, engineering, counts }: Overview = await client.fetch(aiLabOverviewQuery);
  const capabilities = engineering.filter((e) => e.evidence.length > 0);
  const featured = projects[0];
  const plural = (n: number, one: string, many = `${one}S`) => `${n} ${n === 1 ? one : many}`;

  // Sections with nothing published yet are left out, like in the sidebar.
  // Their copy is in src/lib/navigation.ts (aiLabHubSections).
  const sectionCounts: Record<string, string | false> = {
    "/ai-lab/work": plural(projects.length, "PROJECT"),
    "/ai-lab/engineering": plural(capabilities.length, "CAPABILITY", "CAPABILITIES"),
    "/ai-lab/automations": counts.automations > 0 && plural(counts.automations, "FLOW"),
    "/ai-lab/tools": counts.tools > 0 && plural(counts.tools, "TOOL"),
    "/ai-lab/prompts": counts.prompts > 0 && plural(counts.prompts, "PROMPT"),
    "/ai-lab/experiments": counts.experiments > 0 && plural(counts.experiments, "EXPERIMENT"),
  };
  const sections = aiLabHubSections.flatMap((s) => {
    const count = sectionCounts[s.href];
    return count ? [{ ...s, count }] : [];
  });

  const flowSteps = featured?.flow?.steps?.filter(Boolean) ?? [];
  const flowRows = [flowSteps.slice(0, 3), flowSteps.slice(3, 6)].filter((r) => r.length > 0);

  return (
    <PageTransition>
      <div
        className="px-4 sm:px-8 lg:px-14 pt-10 lg:pt-12 pb-16 flex flex-col gap-14"
        style={{ background: "radial-gradient(50% 12% at 90% 0%, color-mix(in srgb, var(--accent-violet) 14%, transparent), transparent 70%)" }}
      >
        <header className="max-w-[720px] flex flex-col gap-3.5">
          <IntroFade className="flex flex-wrap items-center gap-2.5">
            <span className="label-md inline-flex items-center h-[26px] px-2.5 rounded-md bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] text-primary">
              AI LAB · OVERVIEW
            </span>
            <span className="text-[13px] text-muted">Generative &amp; agentic AI, built in the open</span>
          </IntroFade>
          <IntroFade step={1}>
            <h1 className="m-0 text-[40px] leading-[44px] sm:text-[56px] sm:leading-[60px] font-semibold tracking-[-0.035em]">
              Real projects, documented end to end.
            </h1>
          </IntroFade>
          <IntroFade as="p" step={2} className="m-0 text-[17px] leading-[27px] text-muted">
            Each project is written up as a case study and split into pages for its parts. Every page explains the process in text and
            diagrams and links to the rest of the same project.
          </IntroFade>
        </header>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sections.map((s, i) => {
            const tone = tones[i % tones.length];
            return (
              <StaggerItem key={s.href} className="h-full">
                <Link
                  href={s.href}
                  className={`paw-card h-full p-6 gap-3 ${i === 0 ? "border-[color-mix(in_srgb,var(--accent-violet)_60%,transparent)] shadow-[var(--glow-sm)]" : ""}`}
                >
                  {staticCardImage(staticCardKey.section(s.href)) && (
                    <Thumb image={staticCardImage(staticCardKey.section(s.href))} aspect="16 / 8" className="-mx-3 -mt-3 mb-1" />
                  )}
                  <div className="flex justify-between items-center">
                    <span className={`w-10 h-10 rounded-[10px] grid place-items-center font-mono text-[13px] font-medium ${toneFill[tone]}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="label-md text-muted">{s.count}</span>
                  </div>
                  <h2 className="mt-1 mb-0 text-xl leading-7 font-semibold">{s.label}</h2>
                  <p className="m-0 text-sm leading-[21px] text-muted">{s.body}</p>
                  <span className="mt-auto text-sm font-semibold text-primary">Open →</span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {featured && (
          <Reveal as="section" className="flex flex-col gap-5">
            <div className="flex flex-wrap justify-between items-end gap-3">
              <div>
                <p className="paw-section-head__eyebrow">FEATURED · WORK &amp; CASE STUDIES</p>
                <h2 id="featured" className="m-0 text-[28px] leading-[34px] font-semibold tracking-[-0.02em] scroll-mt-28">
                  {featured.title}
                </h2>
              </div>
              <Link href={`/ai-lab/work/${featured.slug}`} className="text-sm font-semibold text-primary inline-flex items-center gap-1">
                Read the case study <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="paw-glass rounded-[20px] p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
              <div className="flex flex-col gap-4">
                {[
                  { label: "PROBLEM", text: featured.problem, cls: "text-tertiary" },
                  { label: "SOLUTION", text: featured.solution, cls: "text-primary" },
                  { label: "FUTURE SCOPE", text: featured.futureScope, cls: "text-secondary" },
                ]
                  .filter((b) => b.text)
                  .map((b) => (
                    <div key={b.label}>
                      <span className={`label-md ${b.cls}`}>{b.label}</span>
                      <p className={`mt-1.5 mb-0 text-[15px] leading-6 line-clamp-3 ${b.label === "FUTURE SCOPE" ? "text-muted" : ""}`}>{b.text}</p>
                    </div>
                  ))}
                {validParts(featured).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {[...new Set(validParts(featured).map((r) => r._type))].map((t) => (
                      <Tag key={t} tone={partTone[t]}>
                        {t.toUpperCase()}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              {flowRows.length > 0 && (
                // Code well: dark in both themes. Steps are the project's own
                // flow diagram, in order.
                <div data-theme="dark" className="self-start w-full p-6 rounded-[14px] bg-surface-container-lowest border border-line flex flex-col gap-3.5 font-mono text-ink">
                  <div className="flex justify-between gap-3 text-[11px] tracking-[0.05em] text-muted">
                    <span className="truncate">{(featured.flow?.title ?? "PIPELINE").toUpperCase()}</span>
                    <span className="text-tertiary shrink-0">● FROM THE CASE STUDY</span>
                  </div>
                  {flowRows.map((row, r) => (
                    <div key={r} className="flex flex-col gap-3.5">
                      {r > 0 && (
                        <span
                          aria-hidden="true"
                          className="self-center w-0.5 h-5"
                          style={{ background: "linear-gradient(var(--accent-blue), var(--accent-violet))" }}
                        />
                      )}
                      <ol className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-3 gap-2" start={r * 3 + 1}>
                        {row.map((step, i) => {
                          const n = r * 3 + i;
                          const last = n === flowSteps.length - 1;
                          return (
                            <li
                              key={step}
                              className={`p-2.5 rounded-lg text-xs text-center ${
                                last
                                  ? "bg-[color-mix(in_srgb,var(--tertiary-container)_18%,transparent)] text-tertiary"
                                  : r === 0
                                    ? "border border-line text-[var(--on-surface)]"
                                    : "bg-[color-mix(in_srgb,var(--accent-violet)_18%,transparent)] text-secondary"
                              }`}
                            >
                              {step}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        )}

        {capabilities.length > 0 && (
          <Reveal as="section" className="flex flex-col gap-5">
            <div>
              <p className="paw-section-head__eyebrow">ENGINEERING</p>
              <h2 id="engineering" className="m-0 text-[28px] leading-[34px] font-semibold tracking-[-0.02em] scroll-mt-28">
                Capabilities, each backed by real project evidence
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
              {capabilities.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/ai-lab/engineering#${c.id}`}
                  className="p-5 rounded-[14px] paw-glass flex flex-col gap-2.5 hover:border-outline transition-colors"
                >
                  <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full bg-current ${toneText[tones[i % 2]]}`} />
                  <span className="text-base leading-[22px] font-semibold">{c.title}</span>
                  <span className="text-xs leading-[18px] text-muted">Evidence: {c.evidence.map((e) => e.title).join(", ")}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal as="section" className="flex flex-col gap-4">
          <div>
            <p className="paw-section-head__eyebrow">PROJECT INDEX</p>
            <h2 id="projects" className="m-0 text-[28px] leading-[34px] font-semibold tracking-[-0.02em] scroll-mt-28">
              Everything in the lab
            </h2>
          </div>
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="hidden md:grid grid-cols-[2.2fr_1.4fr_1.4fr_1.2fr_32px] gap-4 px-6 py-3.5 border-b border-line label-md text-muted">
              <span>PROJECT</span>
              <span>CATEGORY</span>
              <span>STACK</span>
              <span>PARTS</span>
              <span />
            </div>
            {projects.map((p, i) => {
              const parts = validParts(p);
              const tone = tones[i % tones.length];
              return (
                <Link
                  key={p.slug}
                  href={`/ai-lab/work/${p.slug}`}
                  className="grid grid-cols-1 md:grid-cols-[2.2fr_1.4fr_1.4fr_1.2fr_32px] gap-2 md:gap-4 md:items-center px-6 py-4 border-b border-line last:border-b-0 text-sm hover:bg-surface-container transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-[3px] bg-current shrink-0 ${toneText[tone]}`} />
                    <span className="font-semibold">{p.title}</span>
                  </span>
                  <span className="text-muted">{p.category}</span>
                  <span className="font-mono text-xs text-muted">{(p.tech ?? []).slice(0, 3).join(" · ")}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {parts.length > 0 ? (
                      [...new Set(parts.map((r) => r._type))].map((t) => (
                        <Tag key={t} tone={partTone[t]}>
                          {t.toUpperCase()}
                        </Tag>
                      ))
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </span>
                  <span className="hidden md:block text-muted text-right" aria-hidden="true">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </Reveal>

        <div className="max-w-[720px]">
          <Callout title="Unsure where to start?">
            Press <InlineCode>⌘K</InlineCode> (or <InlineCode>Ctrl K</InlineCode>) to search everything in the lab. If that&apos;s not enough,{" "}
            <Link href="/contact">ask me directly</Link>.
          </Callout>
        </div>
      </div>
    </PageTransition>
  );
}
