import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import IntroFade from "../../components/motion/IntroFade";
import Reveal from "../../components/motion/Reveal";
import { PortfolioFooter } from "../../components/portfolio/PortfolioProfileView";
import { cardStrong, eyebrow, muted } from "../../components/portfolio/ui";
import { getPortfolioProfiles, getPortfolioSettings, portfolioPath } from "../../lib/portfolio";
import { buildMetadata } from "../../lib/site";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Portfolio — Niharika Dhande, AI Solutions Engineer & AI Corporate Trainer | PromptAtWork",
  description:
    "Two profiles of Niharika Dhande: AI Solutions Engineer building RAG, agents and AI integrations, and AI Enablement Officer & Corporate Trainer running hands-on AI workshops.",
  path: "/portfolio",
});

// Landing page that points to the two Sanity portfolio profiles.
export default async function PortfolioPage() {
  const [profiles, settings] = await Promise.all([getPortfolioProfiles(), getPortfolioSettings()]);

  return (
    <PageTransition className="relative min-h-screen overflow-x-hidden bg-[#07111f] bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(56,200,230,0.12),transparent_60%),radial-gradient(900px_600px_at_95%_5%,rgba(47,211,154,0.08),transparent_60%)] text-[#eaf2f8]">
      <Nav tone="dark" />
      <main className="mx-auto max-w-[1200px] px-4 pt-14 pb-20 md:px-8 lg:pt-[72px]">
        <div className="mx-auto mb-12 max-w-[740px] text-center">
          {settings?.landingEyebrow && (
            <IntroFade as="span" className={eyebrow}>
              {settings.landingEyebrow}
            </IntroFade>
          )}
          <h1 className="mt-3 mb-4 text-[clamp(32px,4.6vw,50px)] leading-[1.1] font-extrabold tracking-tight">
            {settings?.landingTitle ?? "Portfolio"}
          </h1>
          {settings?.landingIntro && <p className={`text-lg ${muted}`}>{settings.landingIntro}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {profiles.map((p, i) => (
            <Reveal key={p.slug} index={i}>
              <Link
                href={portfolioPath(p.slug)}
                className={`${cardStrong} group flex h-full flex-col overflow-hidden p-[18px] transition hover:-translate-y-1 hover:border-[#38c8e6]`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0f2036]">
                  <Image
                    src={p.heroImage.url}
                    alt={p.heroImage.alt ?? p.title}
                    fill
                    sizes="(min-width: 768px) 560px, 100vw"
                    className="object-cover object-[50%_20%] transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                {p.heroEyebrow && <span className={`${eyebrow} mt-5`}>{p.heroEyebrow}</span>}
                <h2 className="mt-2 text-2xl font-bold text-[#eaf2f8]">{p.title}</h2>
                <p className={`mt-2 mb-5 flex-1 ${muted}`}>{p.summary}</p>
                <span className="font-semibold text-[#38c8e6]">View profile →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <PortfolioFooter />
    </PageTransition>
  );
}
