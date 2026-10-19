import Image from "next/image";
import Link from "next/link";
import { getHomePage, getSiteSettings } from "../../lib/content";
import Reveal from "../motion/Reveal";
import Tag from "../paw/Tag";

// "Meet the instructor" (New-Instructor board). Replaces the old About me
// section and keeps its #about anchor, which /about redirects to. All copy
// is the Home page document's "Meet the instructor" group.
const chipTones = ["blue", "violet", "neutral"] as const;

export default async function Instructor() {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()]);
  const [lead, ...more] = home.aboutParagraphs ?? [];
  const facts = home.aboutFacts ?? [];

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
              alt={settings.personName}
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
          <div className="paw-glass absolute right-3 sm:right-0 top-12 px-[18px] py-3.5 rounded-xl flex flex-col gap-0.5">
            <span className="text-[28px] leading-8 font-semibold tracking-[-0.02em]">{home.aboutBadgeValue}</span>
            <span className="label-md text-muted">{home.aboutBadgeLabel}</span>
          </div>
          <div className="paw-glass absolute right-3 sm:right-0 bottom-16 px-4 py-3 rounded-xl flex gap-2 items-center">
            {(home.aboutChips ?? []).map((c, i) => (
              <Tag key={c} tone={chipTones[i % chipTones.length]}>
                {c}
              </Tag>
            ))}
          </div>
        </Reveal>

        <Reveal index={1} className="flex flex-col gap-5 max-w-[640px]">
          <p className="paw-section-head__eyebrow m-0">{home.aboutEyebrow}</p>
          <h2 className="m-0 text-[36px] leading-10 sm:text-5xl sm:leading-[52px] font-semibold tracking-[-0.03em]">{home.aboutHeading}</h2>
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
            {(home.aboutCtas ?? []).map((c, i) => (
              <Link key={c.href} href={c.href} className={`paw-btn ${i === 0 ? "paw-btn--primary" : "paw-btn--secondary"}`}>
                {c.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
