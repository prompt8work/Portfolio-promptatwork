import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageTransition from "../components/PageTransition";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

// Rendered for any unmatched URL and for every notFound() call (e.g. a
// private project or an unpublished slug) — same shell as other pages so
// a dead link still leaves the visitor inside the site.
export const metadata: Metadata = {
  title: "Page not found — PromptAtWork",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <PageTransition className="paw-page min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <section className="w-full">
          <div className="max-w-[760px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24">
            <PageHeader
              eyebrow="404"
              title="This page isn't here"
              description="The link may be old, or the content may have moved into the AI Lab."
            />
            <div className="flex flex-wrap gap-3 mt-8">
              <Button href="/ai-lab">Browse the AI Lab</Button>
              <Button href="/" variant="secondary">
                Go home
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
