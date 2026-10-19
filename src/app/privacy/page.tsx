import type { Metadata } from "next";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/motion/Reveal";
import { buildMetadata } from "../../lib/site";
import { getPage } from "../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("privacy");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/privacy" });
}

const heading = "text-xl font-semibold text-ink mt-10 mb-3";
const body = "text-[15px] leading-relaxed text-on-surface-variant";

// The policy text is the "Privacy policy" Page document's rich-text body:
// headings, paragraphs, bold labels and links.
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className={heading}>{children}</h2>,
    normal: ({ children }) => <p className={body}>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-ink">{children}</strong>,
    link: ({ value, children }) => (
      <a href={value?.href} className="text-primary hover:text-primary underline">
        {children}
      </a>
    ),
  },
};

/** Splits the body at each heading, so every section reveals on its own. */
function sections(blocks: PortableTextBlock[]) {
  const out: PortableTextBlock[][] = [];
  for (const b of blocks) {
    if (b.style === "h2" || out.length === 0) out.push([]);
    out[out.length - 1].push(b);
  }
  return out;
}

export default async function PrivacyPage() {
  const page = await getPage("privacy");
  return (
    <PageTransition className="min-h-screen">
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[760px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24">
            <PageHeader eyebrow={page.eyebrow} title={page.title ?? ""} description={page.intro} />
            {sections(page.body ?? []).map((blocks, i) => (
              <Reveal key={blocks[0]?._key ?? i}>
                <PortableText value={blocks} components={components} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
