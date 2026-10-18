import Link from "next/link";
import { BookOpen, Boxes, GraduationCap } from "lucide-react";
import Reveal from "../motion/Reveal";

// "Training for teams" (New-Teams board). The three offerings and the lead
// paraphrase data/aboutMe.ts (Niharika's portfolio copy): enablement,
// solutions and training under one roof, on Claude and Google Gemini.
const offers = [
  {
    icon: BookOpen,
    title: "AI Enablement",
    body: "Reusable prompt libraries for each business function, built with the people who use them.",
    tone: "bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] text-primary",
  },
  {
    icon: Boxes,
    title: "AI Solutions",
    body: "RAG assistants grounded in company documents and API integrations with internal systems.",
    tone: "bg-[color-mix(in_srgb,var(--accent-violet)_16%,transparent)] text-secondary",
  },
  {
    icon: GraduationCap,
    title: "AI Training",
    body: "Hands-on workshops for technical and business teams, and Claude Code coaching for developers.",
    tone: "bg-[color-mix(in_srgb,var(--tertiary-container)_18%,transparent)] text-tertiary",
  },
];

export default function TeamsBand() {
  return (
    <Reveal as="section" id="teams" className="rounded-3xl border border-line p-6 sm:p-10 flex flex-col gap-8 bg-surface-container-low bg-[radial-gradient(60%_90%_at_0%_0%,color-mix(in_srgb,var(--accent-blue)_18%,transparent),transparent_70%),radial-gradient(50%_80%_at_100%_100%,color-mix(in_srgb,var(--accent-violet)_18%,transparent),transparent_70%)]">
      <div className="flex flex-col gap-4">
        <p className="paw-section-head__eyebrow m-0">FOR COMPANIES &amp; INSTITUTES</p>
        <h2 className="m-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-10 font-semibold tracking-[-0.03em] scroll-mt-28">
          Bring AI to your whole team — not just the early adopters.
        </h2>
        <p className="m-0 text-base leading-[26px] text-muted">
          Enablement, solutions and training under one roof: I learn how your teams work today, then turn that into working AI on Claude
          and Google Gemini.
        </p>
        <div className="flex flex-wrap gap-3 mt-1">
          <Link href="/contact" className="paw-btn paw-btn--primary">
            Book a Discovery Call
          </Link>
          <a href="#workshops" className="paw-btn paw-btn--secondary">
            See Training Formats
          </a>
        </div>
      </div>
      <ul className="m-0 p-0 list-none flex flex-col gap-3">
        {offers.map(({ icon: Icon, title, body, tone }) => (
          <li key={title} className="paw-glass flex gap-5 px-6 py-[22px] rounded-2xl">
            <span className={`w-11 h-11 rounded-lg grid place-items-center shrink-0 ${tone}`}>
              <Icon className="paw-icon" aria-hidden="true" />
            </span>
            <div>
              <h3 className="m-0 mb-1 text-lg font-semibold">{title}</h3>
              <p className="m-0 text-sm leading-5 text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
