import Link from "next/link";
import { BookOpen, Boxes, GraduationCap } from "lucide-react";
import Reveal from "../motion/Reveal";
import type { PageBlock } from "../../lib/content";

// "Training for teams" (New-Teams board). The copy is the "teams" block of
// the Courses page document; icons and colours are matched to its three
// items in order.
const looks = [
  { icon: BookOpen, tone: "bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] text-primary" },
  { icon: Boxes, tone: "bg-[color-mix(in_srgb,var(--accent-violet)_16%,transparent)] text-secondary" },
  { icon: GraduationCap, tone: "bg-[color-mix(in_srgb,var(--tertiary-container)_18%,transparent)] text-tertiary" },
];

export default function TeamsBand({ block }: { block?: PageBlock }) {
  if (!block) return null;
  return (
    <Reveal as="section" id="teams" className="rounded-3xl border border-line p-6 sm:p-10 flex flex-col gap-8 bg-surface-container-low bg-[radial-gradient(60%_90%_at_0%_0%,color-mix(in_srgb,var(--accent-blue)_18%,transparent),transparent_70%),radial-gradient(50%_80%_at_100%_100%,color-mix(in_srgb,var(--accent-violet)_18%,transparent),transparent_70%)]">
      <div className="flex flex-col gap-4">
        {block.eyebrow && <p className="paw-section-head__eyebrow m-0">{block.eyebrow}</p>}
        <h2 className="m-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-10 font-semibold tracking-[-0.03em] scroll-mt-28">
          {block.title}
        </h2>
        {block.text && <p className="m-0 text-base leading-[26px] text-muted">{block.text}</p>}
        {block.ctas?.length ? (
          <div className="flex flex-wrap gap-3 mt-1">
            {block.ctas.map((c, i) =>
              c.href.startsWith("#") ? (
                <a key={c.href} href={c.href} className={`paw-btn ${i === 0 ? "paw-btn--primary" : "paw-btn--secondary"}`}>
                  {c.label}
                </a>
              ) : (
                <Link key={c.href} href={c.href} className={`paw-btn ${i === 0 ? "paw-btn--primary" : "paw-btn--secondary"}`}>
                  {c.label}
                </Link>
              ),
            )}
          </div>
        ) : null}
      </div>
      <ul className="m-0 p-0 list-none flex flex-col gap-3">
        {(block.items ?? []).map(({ title, text: body }, i) => {
          const { icon: Icon, tone } = looks[i % looks.length];
          return (
          <li key={title} className="paw-glass flex gap-5 px-6 py-[22px] rounded-2xl">
            <span className={`w-11 h-11 rounded-lg grid place-items-center shrink-0 ${tone}`}>
              <Icon className="paw-icon" aria-hidden="true" />
            </span>
            <div>
              <h3 className="m-0 mb-1 text-lg font-semibold">{title}</h3>
              <p className="m-0 text-sm leading-5 text-muted">{body}</p>
            </div>
          </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
