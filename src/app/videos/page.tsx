import type { Metadata } from "next";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import SectionHeading from "../../components/ui/SectionHeading";
import { StaggerGrid, StaggerItem } from "../../components/motion/StaggerGrid";
import VideoCard, { type VideoCardData } from "../../components/videos/VideoCard";
import JsonLd from "../../components/JsonLd";
import { client } from "../../sanity/lib/client";
import { videosQuery } from "../../sanity/lib/queries";
import { buildMetadata } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Videos — Prompt Engineering & AI Tools by Niharika Dhande | PromptAtWork",
  description:
    "Every video, synced from the PromptAtWork YouTube channel — watch right here, or follow the title through to YouTube.",
  path: "/videos",
});

export const revalidate = 60;

export default async function VideosPage() {
  const videos: VideoCardData[] = await client.fetch(videosQuery);

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
    <PageTransition className="min-h-screen bg-neutral-50">
      {videosJsonLd && <JsonLd data={videosJsonLd} />}
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24 sm:pb-28">
            <SectionHeading
              level="page"
              eyebrow="CONTENT"
              title="Videos"
              description={
                videos.length > 0
                  ? `${videos.length} video${videos.length === 1 ? "" : "s"} so far — watch right here, or follow a title through to YouTube.`
                  : "Synced from the PromptAtWork YouTube channel — watch right here, or follow a title through to YouTube."
              }
              align="start"
            />

            {videos.length === 0 ? (
              <div className="border border-neutral-200 rounded-2xl p-10 text-center">
                <p className="text-neutral-600">No videos synced yet — check back soon.</p>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v) => (
                  <StaggerItem key={v.slug}>
                    <VideoCard video={v} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
