import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageTransition from "../components/PageTransition";
import Hero from "../components/home/Hero";
import AboutMe from "../components/home/AboutMe";
import AILabBand from "../components/home/AILabBand";
import ContentPreview from "../components/home/ContentPreview";
import TrainingPreview from "../components/home/TrainingPreview";
import Testimonial from "../components/home/Testimonial";
import PortfolioCTA from "../components/home/PortfolioCTA";
import Contact from "../components/home/Contact";
import SiteFooter from "../components/SiteFooter";
import JsonLd from "../components/JsonLd";
import { buildMetadata } from "../lib/site";
import { homeJsonLd } from "../lib/seo";

// Interim revalidation strategy until the Sanity webhook is wired up
// (needs a deployed URL first — see Phase 2 doc). ContentPreview and
// TrainingPreview fetch Sanity data inside this page's tree.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Niharika Dhande — AI Enablement Officer, AI Solutions Engineer & Prompt Engineer, Indore | PromptAtWork",
  description:
    "Niharika Dhande is an AI Enablement Officer, AI Solutions Engineer and prompt engineering trainer in Indore, India: AI enablement, RAG and generative AI solutions, and hands-on Claude, ChatGPT and AI tools training for teams. Founder of Prompt at Work.",
  path: "/",
});

export default function Home() {
  return (
    <PageTransition className="min-h-screen bg-neutral-50">
      <JsonLd data={homeJsonLd} />
      <Nav />
      <main>
        <Hero />
        <AboutMe />
        <AILabBand />
        <ContentPreview />
        <TrainingPreview />
        <Testimonial />
        <PortfolioCTA />
        <Contact />
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
