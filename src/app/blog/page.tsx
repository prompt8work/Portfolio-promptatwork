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
import { getPage } from "../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("blog");
  return buildMetadata({ title: page.seoTitle ?? "", description: page.seoDescription ?? "", path: "/blog" });
}

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
  const [posts, page]: [BlogListItem[], Awaited<ReturnType<typeof getPage>>] = await Promise.all([client.fetch(blogPostsQuery), getPage("blog")]);

  return (
    <PageTransition className="min-h-screen">
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24 sm:pb-28">
            <SectionHeading
              level="page"
              eyebrow={page.eyebrow ?? ""}
              title={page.title ?? ""}
              description={page.intro}
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
