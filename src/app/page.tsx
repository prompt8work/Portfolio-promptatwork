import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageTransition from "../components/PageTransition";
import Hero from "../components/home/Hero";
import Courses from "../components/home/Courses";
import AILabSections from "../components/home/AILabSections";
import Instructor from "../components/home/Instructor";
import Testimonial from "../components/home/Testimonial";
import ContentPreview from "../components/home/ContentPreview";
import SiteFooter from "../components/SiteFooter";
import JsonLd from "../components/JsonLd";
import { buildMetadata } from "../lib/site";
import { buildHomeJsonLd } from "../lib/seo";
import { getHomePage, getSiteSettings } from "../lib/content";

// Interim revalidation strategy until the Sanity webhook is wired up
// (needs a deployed URL first — see Phase 2 doc). Hero, Courses and
// ContentPreview fetch Sanity data inside this page's tree.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  return buildMetadata({ title: home.seoTitle, description: home.seoDescription, path: "/" });
}

export default async function Home() {
  const settings = await getSiteSettings();
  return (
    // Section order follows the redesign's Hub boards; the Downloadable Notes and Newsletter boards are left out
    // until real notes and a newsletter provider exist.
    <PageTransition className="min-h-screen">
      <JsonLd data={buildHomeJsonLd(settings)} />
      <Nav />
      <main>
        <Hero />
        <Courses />
        <AILabSections />
        <Instructor />
        <Testimonial />
        <ContentPreview />
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
