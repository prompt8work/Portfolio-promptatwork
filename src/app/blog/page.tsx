import type { Metadata } from "next";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import SectionHeading from "../../components/ui/SectionHeading";
import { StaggerGrid, StaggerItem } from "../../components/motion/StaggerGrid";
import BlogCard from "../../components/blog/BlogCard";
import { client } from "../../sanity/lib/client";
import { blogPostsQuery } from "../../sanity/lib/queries";
import { buildMetadata } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Blog — Prompt Engineering & Generative AI Writing by Niharika Dhande | PromptAtWork",
  description: "Niharika Dhande writes on prompt engineering, Generative AI, Full-Stack AI Engineering and AI-assisted development.",
  path: "/blog",
});

export const revalidate = 60;

type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  author?: string;
  readingTime?: string;
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
};

export default async function BlogPage() {
  const posts: BlogListItem[] = await client.fetch(blogPostsQuery);

  return (
    <PageTransition className="min-h-screen">
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24 sm:pb-28">
            <SectionHeading
              level="page"
              eyebrow="CONTENT"
              title="Blog"
              description="Writing on Full-Stack AI Engineering, prompt engineering and AI-assisted development — documented as it happens."
              align="start"
            />

            {posts.length === 0 ? (
              <div className="border border-line rounded-2xl p-10 text-center">
                <p className="text-muted">No posts published yet — check back soon.</p>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <StaggerItem key={post.slug}>
                    <BlogCard post={post} />
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
