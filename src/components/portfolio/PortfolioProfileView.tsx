import Image from "next/image";
import type { ReactNode } from "react";
import {
  CodeXml,
  FileText,
  GraduationCap,
  ShieldCheck,
  Target,
} from "lucide-react";
import IntroFade from "../motion/IntroFade";
import Reveal from "../motion/Reveal";
import AiLabProjects from "./AiLabProjects";
import OfferingsGrid from "./OfferingsGrid";
import InstituteCarousel from "../training/InstituteCarousel";
import {
  Band,
  CtaButton,
  CtaRow,
  Highlight,
  SectionHead,
  Tags,
  TickList,
  card,
  cardStrong,
  eyebrow,
  faint,
  muted,
} from "./ui";
import {
  portfolioPath,
  type AiLabProject,
  type DiagramNode,
  type PortfolioProfile,
  type PortfolioSettings,
} from "../../lib/portfolio";

// One template for both portfolio profiles. Sections render in a fixed
// order and only when they have content; the striped background
// alternates across whichever sections are present.

const whyIcons = {
  code: CodeXml,
  graduation: GraduationCap,
  document: FileText,
  shield: ShieldCheck,
  target: Target,
};

const nodeTone = {
  plain: "border-outline-variant bg-surface-container-lowest/70",
  source: "border-accent-violet/45 bg-surface-container-lowest/70",
  core: "border-primary/55 bg-primary/[0.07]",
  output: "border-secondary/55 bg-secondary/[0.07]",
};

function Hero({ p }: { p: PortfolioProfile }) {
  // Frame follows the photo: portrait and square photos get a narrower
  // card so faces aren't cropped; landscape ones fill the column at 4:3.
  const ratio = p.heroImage.height / p.heroImage.width;
  const shape =
    ratio > 1.05 ? "portrait" : ratio < 0.95 ? "landscape" : "square";
  const frame = {
    portrait: "aspect-[4/4.4]",
    square: "aspect-square",
    landscape: "aspect-[4/3]",
  }[shape];
  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 pt-14 pb-10 md:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:pt-[72px] lg:pb-14">
      <div>
        {p.heroEyebrow && (
          <IntroFade
            as="span"
            className={`inline-flex items-center gap-2 rounded-full border border-outline-variant bg-primary/[0.06] px-3.5 py-1.5 text-[13px] ${muted}`}
          >
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            {p.heroEyebrow}
          </IntroFade>
        )}
        <h1 className="mt-[18px] mb-4 text-[clamp(34px,5.2vw,56px)] leading-[1.08] font-extrabold tracking-tight text-ink">
          <Highlight text={p.heroHeadline} />
        </h1>
        {p.heroLead && (
          <p className={`mb-[26px] max-w-[620px] text-lg ${muted}`}>
            {p.heroLead}
          </p>
        )}
        <CtaRow ctas={p.heroCtas} />
        {!!p.heroChecks?.length && (
          <ul
            className={`mt-[22px] flex flex-wrap gap-x-[18px] gap-y-2 text-sm ${muted}`}
          >
            {p.heroChecks.map((c) => (
              <li key={c}>
                <span className="mr-1.5 font-bold text-secondary">✓</span>
                {c}
              </li>
            ))}
          </ul>
        )}
        {(!!p.heroLogos?.length || !!p.heroChips?.length) && (
          <div className="mt-[30px]">
            {p.heroStripLabel && (
              <p className={`mb-3 text-[13px] ${faint}`}>{p.heroStripLabel}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {p.heroLogos?.length
                ? p.heroLogos.map((l) => (
                    <div
                      key={l.url}
                      className="grid h-16 place-items-center rounded-[14px] border border-line bg-white px-[18px] py-2.5"
                    >
                      <Image
                        src={l.url}
                        alt={l.alt ?? ""}
                        width={l.width}
                        height={l.height}
                        className="h-auto max-h-10 w-auto"
                        sizes="160px"
                      />
                    </div>
                  ))
                : p.heroChips?.map((c) => (
                    <span
                      key={c}
                      className="rounded-[10px] border border-outline-variant bg-primary/[0.06] px-3.5 py-2 font-mono text-[13px] text-ink"
                    >
                      {c}
                    </span>
                  ))}
            </div>
          </div>
        )}
      </div>

      <aside
        className={`${cardStrong} w-full justify-self-center p-[18px] shadow-[var(--elevation-glass)] ${shape === "landscape" ? "" : "max-w-[460px]"}`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl bg-surface-container ${frame}`}
        >
          <Image
            src={p.heroImage.url}
            alt={p.heroImage.alt ?? p.title}
            fill
            priority
            sizes="(min-width: 1024px) 460px, 100vw"
            className={`object-cover ${shape === "portrait" ? "object-[50%_15%]" : ""}`}
          />
        </div>
        <h2 className="mt-4 mb-0.5 text-xl font-semibold text-ink">
          Niharika Dhande
        </h2>
        {p.profileRole && (
          <p className={`mb-3 text-sm ${muted}`}>{p.profileRole}</p>
        )}
        <Tags items={p.profileTags} className="mb-4" />
        <CtaRow ctas={p.profileCtas} small />
      </aside>
    </div>
  );
}

function FeaturedProject({
  f,
}: {
  f: NonNullable<PortfolioProfile["featuredProject"]>;
}) {
  const row = (nodes: DiagramNode[] = []) => (
    <div
      className={`grid grid-cols-1 gap-2.5 ${nodes.length > 1 ? "sm:grid-cols-3" : ""}`}
    >
      {nodes.map((n) => (
        <div
          key={n._key}
          className={`rounded-xl border px-3.5 py-3 ${nodeTone[n.tone ?? "plain"]}`}
        >
          <b className="block text-sm text-ink">{n.title}</b>
          {n.detail && (
            <span className={`block font-mono text-[12.5px] ${muted}`}>
              {n.detail}
            </span>
          )}
        </div>
      ))}
    </div>
  );
  return (
    <Reveal
      className={`${cardStrong} grid gap-7 p-6 lg:grid-cols-[1fr_1.25fr] lg:p-[34px]`}
    >
      <div>
        {f.eyebrow && <span className={eyebrow}>{f.eyebrow}</span>}
        {f.title && (
          <h3 className="mt-1.5 mb-2.5 text-[26px] leading-tight font-bold text-ink">
            {f.title}
          </h3>
        )}
        {f.description && <p className={`mb-4 ${muted}`}>{f.description}</p>}
        <Tags items={f.tags} className="mb-4" />
        <CtaButton cta={f.link} small />
      </div>
      {!!f.diagramRows?.length && (
        <figure
          className="grid content-start gap-2.5"
          aria-label={`Architecture of ${f.title ?? "the project"}`}
        >
          {f.diagramRows.map((r, i) => (
            <div key={r._key} className="grid gap-2.5">
              {i > 0 && (
                <div className="text-center leading-none font-bold text-primary">
                  ↓
                </div>
              )}
              {row(r.nodes)}
            </div>
          ))}
          {f.diagramCaption && (
            <figcaption className={`mt-1 text-[12.5px] ${faint}`}>
              {f.diagramCaption}
            </figcaption>
          )}
        </figure>
      )}
    </Reveal>
  );
}

function ProcessFlow({
  steps,
  loopNote,
}: {
  steps: NonNullable<NonNullable<PortfolioProfile["process"]>["steps"]>;
  loopNote?: string;
}) {
  const cols =
    {
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "lg:grid-cols-6",
    }[steps.length] ?? "lg:grid-cols-5";
  return (
    <>
      <ol className={`grid grid-cols-1 gap-3.5 ${cols}`}>
        {steps.map((s, i) => (
          <li
            key={s._key}
            className={`${card} relative rounded-2xl px-[18px] py-5`}
          >
            <span className="font-mono text-xs text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-1.5 mb-1.5 text-[17px] font-semibold text-ink">
              {s.title}
            </h4>
            {s.description && (
              <p className={`text-sm ${muted}`}>{s.description}</p>
            )}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute -bottom-3.5 left-1/2 z-10 -translate-x-1/2 bg-canvas px-1 font-bold text-primary lg:top-1/2 lg:-right-3.5 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:-translate-y-1/2 lg:px-0.5"
              >
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      {loopNote && (
        <p
          className={`mt-[18px] flex items-center justify-center gap-2.5 text-center text-sm ${muted}`}
        >
          <svg
            width="36"
            height="20"
            viewBox="0 0 36 20"
            fill="none"
            aria-hidden
            className="flex-none"
          >
            <path
              d="M30 4H10a6 6 0 0 0 0 12h18"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M24 8l4 4-4 4"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {loopNote}
        </p>
      )}
    </>
  );
}

export default function PortfolioProfileView({
  p,
  settings,
  aiLabProjects,
}: {
  p: PortfolioProfile;
  settings: PortfolioSettings | null;
  // When given, the projects section is built from these AI Lab case studies
  // instead of the profile's hand-written featured project.
  aiLabProjects?: AiLabProject[];
}) {
  const sections: { id: string; node: ReactNode; plain?: boolean }[] = [];
  const add = (id: string | undefined, node: ReactNode, plain = false) =>
    sections.push({ id: id ?? "", node, plain });

  if (p.offerings?.items?.length) {
    add(
      p.offerings.anchorId ?? "offerings",
      <>
        <SectionHead {...p.offerings} />
        <OfferingsGrid items={p.offerings.items} />
      </>,
    );
  }

  if (
    aiLabProjects?.length ||
    p.featuredProject?.title ||
    p.projects?.items?.length
  ) {
    const cc = p.projects?.closingCard;
    add(
      p.projects?.anchorId ?? "projects",
      <>
        <SectionHead {...p.projects} />
        {aiLabProjects?.length ? (
          <AiLabProjects projects={aiLabProjects} />
        ) : (
          <>
            {p.featuredProject?.title && (
              <FeaturedProject f={p.featuredProject} />
            )}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {p.projects?.items?.map((pr) => (
                <article
                  key={pr._key}
                  className={`${card} flex flex-col p-[22px]`}
                >
                  {pr.kind && (
                    <div className="mb-2 font-mono text-xs text-primary">
                      {pr.kind}
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-semibold text-ink">
                    {pr.title}
                  </h3>
                  {pr.description && (
                    <p className={`mb-3.5 flex-1 text-[15px] ${muted}`}>
                      {pr.description}
                    </p>
                  )}
                  <Tags items={pr.tags} className="mb-3" />
                  <CtaButton cta={pr.link} small />
                </article>
              ))}
              {cc?.title && (
                <article
                  className={`${card} flex flex-col items-start justify-center border-dashed p-[22px]`}
                >
                  {cc.kind && (
                    <div className="mb-2 font-mono text-xs text-primary">
                      {cc.kind}
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-semibold text-ink">
                    {cc.title}
                  </h3>
                  {cc.description && (
                    <p className={`mb-3.5 text-[15px] ${muted}`}>
                      {cc.description}
                    </p>
                  )}
                  <CtaButton cta={cc.link} small />
                </article>
              )}
            </div>
          </>
        )}
      </>,
    );
  }

  if (p.audience?.panels?.length) {
    add(
      p.audience.anchorId ?? "who",
      <>
        <SectionHead {...p.audience} />
        <div className="grid gap-5 md:grid-cols-2">
          {p.audience.panels.map((pa) => (
            <Reveal key={pa._key} className={`${card} p-[26px]`}>
              {pa.eyebrow && <span className={eyebrow}>{pa.eyebrow}</span>}
              <h3 className="mt-1.5 mb-2 text-[22px] font-semibold text-ink">
                {pa.title}
              </h3>
              {pa.intro && <p className={`mb-[18px] ${muted}`}>{pa.intro}</p>}
              <TickList items={pa.points} />
            </Reveal>
          ))}
        </div>
      </>,
    );
  }

  if (p.process?.steps?.length) {
    add(
      p.process.anchorId ?? "how",
      <>
        <SectionHead {...p.process} />
        <ProcessFlow steps={p.process.steps} loopNote={p.process.loopNote} />
      </>,
    );
  }

  if (p.stack?.featured?.title || p.stack?.groups?.length) {
    const f = p.stack.featured;
    add(
      p.stack.anchorId ?? "stack",
      <>
        <SectionHead {...p.stack} />
        <div className="grid gap-4 md:grid-cols-2">
          {f?.title && (
            <Reveal className="rounded-[20px] border border-primary bg-linear-to-br from-primary/[0.08] to-accent-violet/[0.06] p-[26px] md:col-span-2">
              {f.eyebrow && <span className={eyebrow}>{f.eyebrow}</span>}
              <h3 className="mt-1.5 mb-1.5 text-[21px] font-semibold text-ink">
                {f.title}
              </h3>
              {f.intro && (
                <p className={`mb-4 text-[15px] ${muted}`}>{f.intro}</p>
              )}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {f.items?.map((it) => (
                  <div
                    key={it._key}
                    className="rounded-xl border border-outline-variant bg-surface-container-lowest/60 px-3.5 py-3"
                  >
                    <b className="block text-[15px] text-ink">
                      {it.name}
                    </b>
                    {it.detail && (
                      <span className={`block text-[13px] ${muted}`}>
                        {it.detail}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <Tags items={f.tags} className="mt-3.5" />
            </Reveal>
          )}
          {p.stack.groups?.map((g) => (
            <Reveal key={g._key} className={`${card} p-[26px]`}>
              <h3 className="mb-3 text-[17px] font-semibold text-ink">
                {g.title}
              </h3>
              <Tags items={g.items} />
            </Reveal>
          ))}
        </div>
      </>,
    );
  }

  if (p.institutes?.items?.length) {
    add(
      p.institutes.anchorId ?? "institutes",
      <>
        <SectionHead {...p.institutes} />
        <InstituteCarousel items={p.institutes.items} />
      </>,
    );
  }

  if (p.experience?.roles?.length) {
    const earlier = settings?.earlierRoles ?? [];
    const dotBase =
      "absolute top-1.5 -left-[27px] h-3 w-3 rounded-full border-2 border-primary";
    add(
      p.experience.anchorId ?? "experience",
      <>
        <SectionHead {...p.experience} />
        <div className="relative mx-auto max-w-[880px] pl-7 before:absolute before:top-1.5 before:bottom-1.5 before:left-[7px] before:w-0.5 before:bg-linear-to-b before:from-primary before:to-primary/10">
          {p.experience.roles.map((r) => (
            <Reveal key={r._key} className="relative pb-[26px]">
              <span
                className={`${dotBase} ${r.major ? "bg-primary shadow-[0_0_12px_var(--primary)]" : "bg-canvas"}`}
              />
              <div className="font-mono text-[12.5px] text-primary">
                {r.period}
              </div>
              <h3 className="mt-0.5 mb-0.5 text-lg font-semibold text-ink">
                {r.role}
              </h3>
              <div className={`mb-2 text-[15px] ${muted}`}>{r.company}</div>
              {!!r.highlights?.length && (
                <ul className={`list-disc pl-[18px] text-[15px] ${muted}`}>
                  {r.highlights.map((h) => (
                    <li key={h} className="mb-1">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
          {!!earlier.length && (
            <Reveal className="relative pb-2">
              <span className={`${dotBase} bg-canvas`} />
              <div className="font-mono text-[12.5px] text-primary">
                Earlier roles
              </div>
              <div className="mt-1 grid gap-2">
                {earlier.map((e) => (
                  <div
                    key={e._key}
                    className="flex flex-wrap justify-between gap-x-4 gap-y-1 rounded-[10px] border border-line bg-ink/[0.02] px-3.5 py-2.5 text-[14.5px]"
                  >
                    <b className="text-ink">
                      {e.role} · {e.company}
                    </b>
                    {e.period && (
                      <span className={`font-mono text-[12.5px] ${faint}`}>
                        {e.period}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
        <Tags
          items={settings?.credentials}
          className="mt-[30px] justify-center"
        />
      </>,
    );
  }

  if (settings?.services?.length) {
    add(
      "services",
      <>
        <SectionHead
          eyebrow={settings.servicesEyebrow}
          title={settings.servicesTitle}
          intro={settings.servicesIntro}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {settings.services.map((s) => {
            const here = s.profileSlug === p.slug;
            const hash = s.anchor ? `#${s.anchor}` : "";
            const href = !s.profileSlug
              ? undefined
              : here
                ? hash || "#top"
                : `${portfolioPath(s.profileSlug)}${hash}`;
            return (
              <Reveal
                key={s.title}
                className={`${card} flex flex-col p-[26px] ${here ? "border-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_25%,transparent)]" : ""}`}
              >
                {here && (
                  <span className="mb-2 self-start rounded-md bg-primary/[0.12] px-2 py-0.5 text-xs font-semibold text-primary">
                    You are here
                  </span>
                )}
                <h3 className="mb-2 text-[19px] font-semibold text-ink">
                  {s.title}
                </h3>
                {s.description && (
                  <p className={`mb-3.5 flex-1 text-[15px] ${muted}`}>
                    {s.description}
                  </p>
                )}
                {href && s.linkLabel && (
                  <CtaButton
                    cta={{ label: s.linkLabel, href, style: "link" }}
                  />
                )}
              </Reveal>
            );
          })}
        </div>
      </>,
    );
  }

  if (p.whyMe?.items?.length) {
    const cols =
      p.whyMe.items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
    add(
      p.whyMe.anchorId ?? "why",
      <>
        <SectionHead {...p.whyMe} />
        <div className={`grid gap-4 md:grid-cols-2 ${cols}`}>
          {p.whyMe.items.map((w) => {
            const Icon = whyIcons[w.icon ?? "code"];
            return (
              <Reveal key={w._key} className={`${card} p-[26px]`}>
                <div className="grid h-[42px] w-[42px] place-items-center rounded-xl border border-outline-variant bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 mb-2 text-lg font-semibold text-ink">
                  {w.title}
                </h3>
                {w.description && (
                  <p className={`text-[15px] ${muted}`}>{w.description}</p>
                )}
              </Reveal>
            );
          })}
        </div>
      </>,
    );
  }

  if (p.ctaBand?.title) {
    add(
      "contact",
      <Reveal className="grid items-center gap-5 rounded-3xl border border-outline-variant bg-linear-to-r from-accent-blue/20 to-accent-violet/20 p-[30px] md:grid-cols-[1fr_auto] md:px-10 md:py-9">
        <div>
          <h3 className="mb-1.5 text-2xl font-semibold text-ink">
            {p.ctaBand.title}
          </h3>
          {p.ctaBand.text && <p className={muted}>{p.ctaBand.text}</p>}
        </div>
        <CtaRow ctas={p.ctaBand.ctas} />
      </Reveal>,
      true,
    );
  }

  if (p.faq?.items?.length) {
    add(
      p.faq.anchorId ?? "faq",
      <>
        {p.faq.title && (
          <h2 className="mb-7 text-[clamp(26px,3.4vw,38px)] font-bold tracking-tight text-ink">
            {p.faq.title}
          </h2>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {p.faq.items.map((q) => (
            <Reveal key={q._key} className={`${card} flex flex-col p-[26px]`}>
              <h3 className="mb-2 text-[17px] font-semibold text-ink">
                {q.question}
              </h3>
              <p className={`text-[15px] ${muted} ${q.link ? "mb-3.5" : ""}`}>
                {q.answer}
              </p>
              {q.link && (
                <div className="mt-auto">
                  <CtaButton cta={q.link} small />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </>,
      true,
    );
  }

  let stripe = 0;
  return (
    <>
      <Hero p={p} />
      {sections.map((s) => {
        const alt = !s.plain && stripe++ % 2 === 0;
        return (
          <Band key={s.id} id={s.id} alt={alt}>
            {s.node}
          </Band>
        );
      })}
    </>
  );
}
