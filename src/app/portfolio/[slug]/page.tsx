import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "../../../components/Nav";
import PageTransition from "../../../components/PageTransition";
import PortfolioProfileView, { PortfolioFooter } from "../../../components/portfolio/PortfolioProfileView";
import { getAiLabProjects, getPortfolioProfile, getPortfolioSettings, getPortfolioSlugs, portfolioPath } from "../../../lib/portfolio";
import { buildMetadata } from "../../../lib/site";
import { buildFaqJsonLd } from "../../../lib/seo";
import JsonLd from "../../../components/JsonLd";
import { institutes, trainings, trainingToOffering } from "../../../lib/trainings";

// One page per Sanity "Portfolio profile" (AI Solutions Engineer, AI
// Enablement Officer & Corporate Trainer). Replaced /resume, which now
// redirects to /portfolio. Dark like the old Resume page — the only dark
// area of the site.
export const revalidate = 60;

// Profiles whose projects section lists the AI Lab case studies instead of
// hand-written cards, so publishing a project in AI Lab adds it here too.
const aiLabProjectProfiles = new Set(["ai-solutions-engineer"]);

// Profiles whose workshops and institutes come from src/lib/trainings.ts,
// the same data /training uses, so each card links to its /training page.
// Section headings (eyebrow, title, intro) still come from Studio.
const trainingProfiles = new Set(["ai-enablement-officer"]);
const enquire = { label: "Enquire", href: "/contact", style: "primary" } as const;

export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPortfolioProfile(slug);
  if (!profile) return {};
  return buildMetadata({
    title: profile.seoTitle ?? `${profile.title} — Niharika Dhande | PromptAtWork`,
    description: profile.summary,
    path: portfolioPath(profile.slug),
  });
}

export default async function PortfolioProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [profile, settings, aiLabProjects] = await Promise.all([
    getPortfolioProfile(slug),
    getPortfolioSettings(),
    aiLabProjectProfiles.has(slug) ? getAiLabProjects() : undefined,
  ]);
  if (!profile) notFound();

  const view = trainingProfiles.has(slug)
    ? {
        ...profile,
        offerings: { ...profile.offerings, items: trainings.map((t) => trainingToOffering(t, enquire)) },
        institutes: { ...profile.institutes, items: institutes.map((it) => ({ _key: it.name, ...it })) },
      }
    : profile;

  return (
    <PageTransition
      key={slug}
      className="relative min-h-screen overflow-x-hidden bg-[#07111f] bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(56,200,230,0.12),transparent_60%),radial-gradient(900px_600px_at_95%_5%,rgba(47,211,154,0.08),transparent_60%)] text-[#eaf2f8]"
    >
      {profile.faq?.items?.length ? <JsonLd data={buildFaqJsonLd(profile.faq.items)} /> : null}
      <Nav tone="dark" />
      <main id="top">
        <PortfolioProfileView p={view} settings={settings} aiLabProjects={aiLabProjects} />
      </main>
      <PortfolioFooter />
    </PageTransition>
  );
}
