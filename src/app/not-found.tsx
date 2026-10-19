import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageTransition from "../components/PageTransition";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { getPage } from "../lib/content";

// Rendered for any unmatched URL and for every notFound() call (e.g. a
// private project or an unpublished slug) — same shell as other pages so
// a dead link still leaves the visitor inside the site.
export const metadata: Metadata = {
  title: "Page not found — PromptAtWork",
  robots: { index: false },
};

export default async function NotFound() {
  const page = await getPage("not-found");
  return (
    <PageTransition className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <section className="w-full">
          <div className="max-w-[760px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24">
            <PageHeader
              eyebrow={page.eyebrow}
              title={page.title ?? ""}
              description={page.intro}
            />
            <div className="flex flex-wrap gap-3 mt-8">
              {(page.ctas ?? []).map((c, i) => (
                <Button key={c.href} href={c.href} variant={i === 0 ? "primary" : "secondary"}>
                  {c.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
