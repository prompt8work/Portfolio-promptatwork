import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, GraduationCap } from "lucide-react";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import IntroFade from "../../components/motion/IntroFade";
import { StaggerGrid, StaggerItem } from "../../components/motion/StaggerGrid";
import { TagList } from "../../components/paw/Tag";
import { getPortfolioProfiles, getPortfolioSettings, portfolioPath } from "../../lib/portfolio";
import { buildMetadata } from "../../lib/site";
import { getPage, getSiteSettings } from "../../lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("portfolio");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/portfolio" });
}

const icons = [Code, GraduationCap];

// Portfolio overview (Page-Portfolio board, header): the two Sanity
// portfolio profiles side by side, the first one highlighted. The board's
// featured case study, projects, process, stack and institutes sections
// already live on each profile page, so they aren't repeated here.
export default async function PortfolioPage() {
  const [profiles, settings, site] = await Promise.all([getPortfolioProfiles(), getPortfolioSettings(), getSiteSettings()]);

  return (
    <PageTransition className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <main
        style={{
          background:
            "radial-gradient(45% 60% at 85% 0%, color-mix(in srgb, var(--accent-violet) 18%, transparent), transparent 70%), radial-gradient(35% 50% at 0% 10%, color-mix(in srgb, var(--accent-blue) 14%, transparent), transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8 pt-14 pb-20 lg:pt-20 grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-16 items-start">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">
            <IntroFade as="p" className="paw-section-head__eyebrow m-0">
              {(settings?.landingEyebrow ?? "Portfolio").toUpperCase()} · {site.personName.toUpperCase()}
            </IntroFade>
            <IntroFade step={1}>
              <h1 className="m-0 text-[40px] leading-[44px] sm:text-[56px] sm:leading-[60px] font-semibold tracking-[-0.035em]">
                {settings?.landingTitle ?? "Portfolio"}
              </h1>
            </IntroFade>
            {settings?.landingIntro && (
              <IntroFade as="p" step={2} className="m-0 text-lg leading-7 text-muted max-w-[520px]">
                {settings.landingIntro}
              </IntroFade>
            )}
          </div>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profiles.map((p, i) => {
              const Icon = icons[i % icons.length];
              return (
                <StaggerItem key={p.slug} className="h-full">
                  <Link
                    href={portfolioPath(p.slug)}
                    className={`paw-card group h-full p-3 pb-6 gap-5 ${i === 0 ? "border-[color-mix(in_srgb,var(--accent-violet)_60%,transparent)] shadow-[var(--glow-sm)]" : ""}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-container">
                      <Image
                        src={p.heroImage.url}
                        alt={p.heroImage.alt ?? p.title}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover object-[50%_20%] transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                    <div className="px-3 flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-[10px] grid place-items-center bg-canvas border border-line text-primary">
                          <Icon className="paw-icon" aria-hidden="true" />
                        </span>
                        <span className="label-md text-muted">PROFILE {String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h2 className="m-0 text-[22px] leading-7 font-semibold tracking-[-0.01em]">{p.title}</h2>
                      <p className="m-0 text-sm leading-[22px] text-muted flex-1">{p.summary}</p>
                      {p.profileTags && p.profileTags.length > 0 && <TagList items={p.profileTags} />}
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        View profile <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
