import type { Metadata } from "next";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import Contact from "../../components/contact/Contact";
import { buildMetadata } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact Niharika Dhande — AI Training & Prompt Engineering, Indore | PromptAtWork",
  description:
    "Get in touch with Niharika Dhande in Indore, India about prompt engineering and Generative AI training, workshops, AI consulting, job opportunities or collaboration.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    // paw-page: rebuilt on the Luminous SaaS tokens (follows the light/dark toggle).
    <PageTransition className="paw-page min-h-screen">
      <Nav />
      <main>
        <Contact />
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
