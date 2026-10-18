import Image from "next/image";
import Link from "next/link";
import { aboutMe } from "../../../data/aboutMe";
import { hero } from "../../../data/homeContent";
import Reveal from "../motion/Reveal";
import Tag from "../paw/Tag";

// "Meet the instructor" (New-Instructor board). Replaces the old About me
// section and keeps its #about anchor, which /about redirects to. Copy is
// data/aboutMe.ts (Niharika's portfolio copy); the facts row only states
// what that copy and the site footer already say.
export default function Instructor() {
  const [lead, ...more] = aboutMe.paragraphs;
  const facts = [
    { title: "AI Enablement Officer", sub: "Current role" },
    { title: "Founder, Prompt at Work", sub: "Enablement · solutions · training" },
    { title: "Indore, India", sub: "Based in" },
  ];

  return (
    <section
      id="about"
      className="w-full scroll-mt-20"
      style={{ background: "radial-gradient(40% 60% at 15% 50%, color-mix(in srgb, var(--accent-blue) 14%, transparent), transparent 70%)" }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-12 lg:gap-20 items-center">
        <Reveal className="relative h-[420px] sm:h-[580px] max-w-[520px] w-full">
          <div className="absolute inset-0 sm:right-10 rounded-3xl overflow-hidden border border-line" style={{ boxShadow: "var(--elevation-glass)" }}>
            <Image
              src="/images/niharika-portrait.jpg"
              alt="Niharika Dhande"
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
          <div className="paw-glass absolute right-3 sm:right-0 top-12 px-[18px] py-3.5 rounded-xl flex flex-col gap-0.5">
            <span className="text-[28px] leading-8 font-semibold tracking-[-0.02em]">{hero.credential.value.replace(" years", " yrs")}</span>
            <span className="label-md text-muted">ENGINEERING &amp; TRAINING</span>
          </div>
          <div className="paw-glass absolute right-3 sm:right-0 bottom-16 px-4 py-3 rounded-xl flex gap-2 items-center">
            <Tag>CLAUDE</Tag>
            <Tag tone="violet">GEMINI</Tag>
            <Tag tone="neutral">RAG</Tag>
          </div>
        </Reveal>

        <Reveal index={1} className="flex flex-col gap-5 max-w-[640px]">
          <p className="paw-section-head__eyebrow m-0">MEET THE INSTRUCTOR</p>
          <h2 className="m-0 text-[36px] leading-10 sm:text-5xl sm:leading-[52px] font-semibold tracking-[-0.03em]">{aboutMe.heading}</h2>
          <p className="m-0 text-lg leading-7 text-ink">{lead}</p>
          {more.map((p) => (
            <p key={p} className="m-0 text-base leading-[26px] text-muted">
              {p}
            </p>
          ))}
          <div className="flex flex-wrap gap-x-8 gap-y-4 py-5 border-y border-line">
            {facts.map((f) => (
              <div key={f.title}>
                <div className="text-[15px] font-semibold">{f.title}</div>
                <div className="text-[13px] text-muted">{f.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/portfolio" className="paw-btn paw-btn--primary">
              Read Full Profile
            </Link>
            <Link href="/contact" className="paw-btn paw-btn--secondary">
              Let&apos;s Connect
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
