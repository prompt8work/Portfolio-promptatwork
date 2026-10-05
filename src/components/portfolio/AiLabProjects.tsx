import Reveal from "../motion/Reveal";
import { CtaButton, Tags, card, cardStrong, eyebrow, muted } from "./ui";
import { aiLabProjectPath, type AiLabProject } from "../../lib/portfolio";

// Projects section fed only by AI Lab case studies
// (portfolioAiLabProjectsQuery), newest first, so a project published in AI
// Lab shows up here without editing the portfolio. The newest is marked
// Featured.

const kindOf = (category?: string) => category?.split("·")[0].trim();

function ProjectCard({ project, featured }: { project: AiLabProject; featured: boolean }) {
  const kind = kindOf(project.category);
  return (
    <Reveal className={`${featured ? cardStrong : card} flex flex-col p-6 lg:p-[30px]`}>
      <span className={eyebrow}>{[featured && "Featured", kind].filter(Boolean).join(" · ")}</span>
      <h3 className="mt-1.5 mb-2.5 text-[24px] leading-tight font-bold text-[#eaf2f8]">{project.title}</h3>
      <p className={`mb-4 flex-1 ${muted}`}>{project.summary}</p>
      {!!project.stats?.length && (
        <ul className="mb-4 grid gap-2 sm:grid-cols-2">
          {project.stats.map((s) => (
            <li key={s} className="rounded-xl border border-cyan-300/15 bg-white/[0.02] px-3 py-2 text-[13.5px] text-[#eaf2f8]">
              {s}
            </li>
          ))}
        </ul>
      )}
      <Tags items={project.tech?.slice(0, 6)} className="mb-4" />
      <div>
        <CtaButton cta={{ label: "Read the case study in AI Lab →", href: aiLabProjectPath(project.slug), style: "secondary" }} small />
      </div>
    </Reveal>
  );
}

export default function AiLabProjects({ projects }: { projects: AiLabProject[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} featured={i === 0} />
      ))}
    </div>
  );
}
