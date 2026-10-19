import type { Metadata } from "next";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import Contact from "../../components/contact/Contact";
import { buildMetadata } from "../../lib/site";
import { getPage, getSiteSettings } from "../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/contact" });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getSiteSettings()]);
  return (
    <PageTransition className="min-h-screen">
      <Nav />
      <main>
        <Contact page={page} settings={{ email: settings.email, linkedin: settings.linkedin, location: settings.location }} />
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
