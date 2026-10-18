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
import { homeJsonLd } from "../lib/seo";

// Interim revalidation strategy until the Sanity webhook is wired up
// (needs a deployed URL first — see Phase 2 doc). Hero, Courses and
// ContentPreview fetch Sanity data inside this page's tree.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Niharika Dhande — AI Enablement Officer, AI Solutions Engineer & Prompt Engineer, Indore | PromptAtWork",
  description:
    "Niharika Dhande is an AI Enablement Officer, AI Solutions Engineer and prompt engineering trainer in Indore, India: AI enablement, RAG and generative AI solutions, and hands-on Claude, ChatGPT and AI tools training for teams. Founder of Prompt at Work.",
  path: "/",
});

export default function Home() {
  return (
    // paw-page: rebuilt on the Luminous SaaS tokens, so it follows the
    // light/dark toggle (globals.css). Section order follows the redesign's
    // Hub boards; the Downloadable Notes and Newsletter boards are left out
    // until real notes and a newsletter provider exist.
    <PageTransition className="paw-page min-h-screen">
      <JsonLd data={homeJsonLd} />
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
