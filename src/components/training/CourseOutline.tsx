import { BlockLabel } from "../ui/ContentSection";
import Reveal from "../motion/Reveal";
import { slugify } from "../../lib/slugify";
import type { Capstone, ModuleGroup, Training, TrainingProgram } from "../../lib/trainings";

// The detailed sections of a workshop page — session format, program
// formats, modules and week-by-week timelines — each drawn from the
// optional fields on a Training. A training without them shows none.

const eyebrow = "font-mono text-[11px] tracking-[0.08em] uppercase text-muted";
const card = "rounded-xl border border-outline-variant bg-surface-container-lowest";

/** How the course runs, drawn as a flow: each part → what the learner leaves with. */
export function SessionFormat({ format }: { format: NonNullable<Training["sessionFormat"]> }) {
  const total = format.parts.map((p) => p.time).join(" + ");
  return (
    <Reveal>
      <section className="flex flex-col gap-4">
        <BlockLabel>{format.heading ?? "How every session runs"}</BlockLabel>
        <p className="m-0 text-[15.5px] leading-relaxed text-on-surface-variant">{format.intro ?? `Every session is ${total}.`}</p>
        <ol className="m-0 p-0 list-none flex flex-col sm:flex-row sm:items-stretch gap-2">
          {format.parts.map((p, i) => (
            <li key={p.part} className="contents">
              <div className={`${card} flex-1 px-4 py-3.5 flex flex-col gap-1`}>
                <span className={eyebrow}>
                  Step {i + 1} · {p.time}
                </span>
                <span className="text-[15.5px] font-semibold text-ink">{p.part}</span>
                <span className="text-[14.5px] leading-relaxed text-on-surface-variant">{p.what}</span>
              </div>
              <Arrow />
            </li>
          ))}
          <li className="flex-1 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3.5 flex flex-col gap-1">
            <span className={eyebrow}>Outcome</span>
            <span className="text-[14.5px] leading-relaxed text-ink">{format.outcome}</span>
          </li>
        </ol>
      </section>
    </Reveal>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="self-center text-primary text-lg leading-none rotate-90 sm:rotate-0">
      →
    </span>
  );
}

/** The ways to take the course, side by side. */
export function ProgramFormats({ programs }: { programs: TrainingProgram[] }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-4">
        <BlockLabel>Program formats</BlockLabel>
        <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-3">
          {programs.map((p) => (
            <li key={p.name} className={`${card} px-4 py-4 flex flex-col gap-3`}>
              <div className="flex items-start justify-between gap-3">
                <a href={`#${slugify(p.name)}`} className="text-[16px] font-semibold text-ink hover:text-primary">
                  {p.name}
                </a>
                <span className="shrink-0 rounded-full border border-outline-variant px-2.5 py-0.5 text-[12px] text-muted">
                  {p.mode}
                </span>
              </div>
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px]">
                <Fact term="Schedule" value={p.schedule} />
                <Fact term="Duration" value={p.duration} />
                <Fact term="Sessions · Hours" value={p.sessions} />
                <Fact term="Projects" value={p.projects} />
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <>
      <dt className="text-muted">{term}</dt>
      <dd className="m-0 text-ink">{value}</dd>
    </>
  );
}

/** Module names in numbered groups. */
export function ModuleGroups({ groups }: { groups: ModuleGroup[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groups.map((g) => (
        <div key={g.title} className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 id={slugify(g.title)} className="m-0 text-[17px] font-semibold text-ink scroll-mt-28">
              {g.title}
            </h3>
            {g.note && <p className="m-0 text-[14px] text-muted">{g.note}</p>}
          </div>
          <ol className="m-0 p-0 list-none flex flex-col gap-2">
            {g.modules.map((m, i) => (
              <li key={m} className="flex gap-3">
                <span className="font-mono text-[11px] text-muted pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] text-ink">{m}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/** One collapsible timeline per program; the first starts open. */
export function ProgramTimelines({ programs, intro }: { programs: TrainingProgram[]; intro?: string }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-4">
        <BlockLabel>Program timelines</BlockLabel>
        {intro && <p className="m-0 text-[15.5px] leading-relaxed text-on-surface-variant">{intro}</p>}
        <div className="flex flex-col gap-3">
          {programs.map((p, i) => (
            <details key={p.name} open={i === 0} className={`${card} group`}>
              <summary className="cursor-pointer list-none px-4 py-3.5 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-0.5 [&::-webkit-details-marker]:hidden">
                <h3 id={slugify(p.name)} className="m-0 text-[16px] font-semibold text-ink scroll-mt-28">
                  {p.name}
                </h3>
                <span aria-hidden className="row-span-2 text-muted transition-transform group-open:rotate-180">
                  ▾
                </span>
                <span className="text-[13.5px] text-muted">{p.summary}</span>
              </summary>
              <div className="border-t border-outline-variant px-4 py-4 flex flex-col gap-6">
                {p.blocks.map((b, j) => (
                  <div key={b.title ?? j} className="flex flex-col gap-3">
                    {b.title && <p className="m-0 text-[15px] font-semibold text-ink">{b.title}</p>}
                    <Rows program={p} rows={b.rows} />
                    {b.capstone && <CapstoneCard c={b.capstone} />}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

// A table on wide screens; on phones each row stacks, with its column names inline.
function Rows({ program, rows }: { program: TrainingProgram; rows: TrainingProgram["blocks"][number]["rows"] }) {
  const [labelCol, conceptCol, practicalCol] = program.columns;
  const grid = "sm:grid sm:grid-cols-[80px_1fr_1fr] sm:gap-x-4";
  return (
    <div role="table" aria-label={`${program.name} timeline`} className="flex flex-col">
      <div role="row" className={`hidden ${grid} pb-2 border-b border-outline-variant`}>
        <span role="columnheader" className={eyebrow}>{labelCol}</span>
        <span role="columnheader" className={eyebrow}>{conceptCol}</span>
        <span role="columnheader" className={eyebrow}>{practicalCol}</span>
      </div>
      {rows.map((r) => (
        <div key={r.label} role="row" className={`${grid} flex flex-col gap-1 py-2.5 border-b border-outline-variant last:border-b-0`}>
          <span role="rowheader" className="font-mono text-[12px] text-primary sm:pt-0.5">
            {r.label}
          </span>
          <span role="cell" className="text-[14.5px] leading-relaxed text-ink">
            {r.concept}
          </span>
          <span role="cell" className="text-[14.5px] leading-relaxed text-on-surface-variant">
            <span className="sm:hidden text-muted">{practicalCol}: </span>
            {r.practical}
          </span>
        </div>
      ))}
    </div>
  );
}

function CapstoneCard({ c }: { c: Capstone }) {
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3.5 flex flex-col gap-1.5">
      <p className="m-0 text-[15px] font-semibold text-ink">{c.title}</p>
      <p className="m-0 text-[14.5px] leading-relaxed text-on-surface-variant">{c.description}</p>
      <p className="m-0 text-[14px] leading-relaxed text-on-surface-variant">
        <span className="font-semibold text-ink">Resume line:</span> <em>{c.resumeLine}</em>
      </p>
    </div>
  );
}
