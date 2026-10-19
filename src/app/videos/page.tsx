import type { Metadata } from "next";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import VideoBrowser from "../../components/videos/VideoBrowser";
import { type VideoCardData } from "../../components/videos/VideoCard";
import JsonLd from "../../components/JsonLd";
import { client } from "../../sanity/lib/client";
import { videosQuery } from "../../sanity/lib/queries";
import { buildMetadata } from "../../lib/site";
import { getBlock, getPage } from "../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("videos");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/videos" });
}

export const revalidate = 60;

export default async function VideosPage() {
  const [videos, page]: [VideoCardData[], Awaited<ReturnType<typeof getPage>>] = await Promise.all([client.fetch(videosQuery), getPage("videos")]);
  const count = `${videos.length} video${videos.length === 1 ? "" : "s"}`;

  const videosJsonLd =
    videos.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: videos.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "VideoObject",
              name: v.title,
              description: v.description || v.title,
              thumbnailUrl: v.thumbnailUrl,
              uploadDate: v.publishedAt,
              embedUrl: `https://www.youtube.com/embed/${v.externalId}`,
              contentUrl: v.externalUrl,
            },
          })),
        }
      : null;

  return (
    // PromptAtWork TV (TV-Header / TV-Browse boards), on the Luminous SaaS
    // tokens. Deliberately neutral, no glows: the thumbnails are the colour.
    // The board's bell, profile avatar and sidebar (Shorts, Playlists,
    // Bootcamps, Library) are left out until there's something behind them.
    <PageTransition className="min-h-screen">
      {videosJsonLd && <JsonLd data={videosJsonLd} />}
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-10 sm:pt-12 pb-20">
            <div className="flex flex-col items-center text-center gap-2 mb-8">
              <span className="paw-tvtag">{page.eyebrow}</span>
              <h1 className="m-0 text-[32px] leading-10 font-semibold tracking-[-0.02em]">{page.title}</h1>
              <p className="m-0 text-sm text-muted">
                {videos.length > 0
                  ? (page.intro ?? "").replace("{count}", count)
                  : getBlock(page, "empty")?.text}
              </p>
            </div>

            {videos.length === 0 ? (
              <div className="rounded-2xl border border-line p-10 text-center text-muted">No videos synced yet. Check back soon.</div>
            ) : (
              <VideoBrowser videos={videos} />
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
