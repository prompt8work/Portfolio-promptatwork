import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { getHomePage, getSiteSettings } from "../../lib/content";
import { brand } from "../../lib/navigation";
import { client } from "../../sanity/lib/client";
import { trainingsQuery } from "../../sanity/lib/queries";
import { getBatchesForTraining } from "../../supabase/trainingRepository";
import IntroFade from "../motion/IntroFade";
import WhatsAppAutomation from "./WhatsAppAutomation";

// Luminous SaaS hero (Hub-Hero board). The H1 stays the plain identity line
// for search (Docs/development-plan/13-seo-aeo.md); the display headline is
// the visual lead. The status beside the tag only appears when a course
// batch is actually open for registration.
async function openCourseTitle(): Promise<string | null> {
  const trainings: { slug: string; title: string }[] = await client.fetch(trainingsQuery);
  for (const t of trainings) {
    const batches = await getBatchesForTraining(t.slug);
    if (batches.some((b) => b.status === "OPEN")) return t.title;
  }
  return null;
}

export default async function Hero() {
  const [openCourse, home, settings] = await Promise.all([openCourseTitle(), getHomePage(), getSiteSettings()]);

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(45% 55% at 82% 25%, color-mix(in srgb, var(--accent-violet) 22%, transparent), transparent 70%), radial-gradient(35% 45% at 0% 0%, color-mix(in srgb, var(--accent-blue) 16%, transparent), transparent 70%), var(--canvas)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-14 pb-16 lg:pt-20 lg:pb-[88px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-[72px] items-center">
        <div className="flex flex-col items-start">
          <IntroFade className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="label-md inline-flex items-center h-[26px] px-2.5 rounded-md text-primary bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)]">
              {home.heroTag}
            </span>
            {openCourse && (
              <Link href="/training" className="text-[13px] text-muted hover:text-ink">
                · {openCourse} — registration open
              </Link>
            )}
          </IntroFade>

          <IntroFade step={1}>
            <h1 className="mt-5 text-sm sm:text-[15px] leading-snug font-medium text-muted max-w-[560px]">{home.heroIdentity}</h1>
          </IntroFade>

          <IntroFade step={2}>
            <p className="mt-4 mb-5 text-[40px] leading-[44px] sm:text-[52px] sm:leading-[56px] lg:text-[64px] lg:leading-[68px] font-semibold tracking-[-0.035em] text-ink">
              {home.heroDisplayLead}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{home.heroDisplayAccent}</span>
            </p>
          </IntroFade>

          <IntroFade as="p" step={3} className="mb-8 text-lg leading-7 text-muted max-w-[560px]">
            {home.heroLead}
          </IntroFade>

          <IntroFade step={4} className="flex flex-wrap gap-3">
            {(home.heroCtas ?? []).map((c, i) => (
              <Link key={c.href} href={c.href} className={`paw-btn ${i === 0 ? "paw-btn--primary" : "paw-btn--secondary bg-card"}`}>
                {i === 0 && <Play className="w-4 h-4 fill-current" aria-hidden="true" />}
                {c.label}
              </Link>
            ))}
          </IntroFade>

          <IntroFade step={5} className="mt-10 pt-7 border-t border-line flex flex-wrap items-center gap-6 w-full">
            <div className="flex items-center gap-3">
              <Image
                src="/images/niharika-headshot.jpg"
                alt={settings.personName}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover border border-line"
              />
              <div>
                <div className="text-[15px] font-semibold">{settings.personName}</div>
                <div className="text-[13px] text-muted">{home.heroPersonRole}</div>
              </div>
            </div>
            <span className="hidden sm:block w-px h-9 bg-line" aria-hidden="true" />
            <div>
              <div className="text-xl font-semibold tracking-[-0.01em]">{home.credentialValue}</div>
              <div className="text-[13px] text-muted">{home.credentialLabel}</div>
            </div>
          </IntroFade>
        </div>

        <IntroFade step={3} className="relative lg:py-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl blur-[8px]"
            style={{ background: "radial-gradient(70% 70% at 70% 30%, color-mix(in srgb, var(--accent-violet) 25%, transparent), transparent 70%)" }}
          />
          <div className="relative">
            <WhatsAppAutomation
              title={home.heroCardTitle}
              meta={home.heroCardMeta}
              badge={home.heroCardBadge}
              customer={home.heroCardCustomer}
              reply={home.heroCardReply}
              steps={home.heroCardSteps ?? []}
              footer={home.heroCardFooter}
            />
          </div>
          <div
            className="paw-glass relative mt-4 lg:mt-0 lg:absolute lg:-left-8 lg:bottom-4 px-4 py-3 rounded-xl flex items-center gap-3 w-fit"
            style={{ boxShadow: "var(--elevation-glass)" }}
          >
            <Image src={brand.logo} alt="" width={36} height={36} className="w-9 h-9 rounded-[10px]" />
            <div>
              <div className="text-sm font-semibold">{home.heroChipTitle}</div>
              <div className="label-md text-muted">{home.heroChipMeta}</div>
            </div>
          </div>
        </IntroFade>
      </div>
    </section>
  );
}
