import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Nav from "../../../components/Nav";
import PageTransition from "../../../components/PageTransition";
import SiteFooter from "../../../components/SiteFooter";
import ArrowLink from "../../../components/ui/ArrowLink";
import Tag from "../../../components/ui/Tag";
import PageHeader from "../../../components/ui/PageHeader";
import Reveal from "../../../components/motion/Reveal";
import Morph from "../../../components/motion/Morph";
import { StaggerGrid, StaggerItem } from "../../../components/motion/StaggerGrid";
import { morphName } from "../../../lib/motion";
import RelatedContent from "../../../components/ai-lab/RelatedContent";
import ReactionBar from "../../../components/blog/ReactionBar";
import ShareActions from "../../../components/blog/ShareActions";
import CommentForm from "../../../components/blog/CommentForm";
import JsonLd from "../../../components/JsonLd";
import DiagramBody from "../../../components/diagrams/DiagramBody";
import type { Diagram } from "../../../components/diagrams/types";
import { client } from "../../../sanity/lib/client";
import { blogPostBySlugQuery, blogSlugsQuery } from "../../../sanity/lib/queries";
import { getReactionCounts, type ReactionCounts } from "../../../supabase/blogReactionRepository";
import { getPublishedComments, type PublishedComment } from "../../../supabase/commentRepository";
import { buildBreadcrumbJsonLd, buildMetadata, getCanonicalUrl } from "../../../lib/site";
import { personRef } from "../../../lib/seo";
import { getSiteSettings } from "../../../lib/content";

export const revalidate = 60;

type BlogPostDetail = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category?: string;
  tags?: string[];
  author?: string;
  readingTime?: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string;
  diagrams?: Diagram[];
  relatedContent?: {
    _type: "project" | "tool" | "prompt" | "experiment" | "automation";
    slug: string;
    title?: string;
    name?: string;
  }[];
};

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(blogSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post: BlogPostDetail | null = await client.fetch(blogPostBySlugQuery, { slug });
  if (!post) return {};
  // buildMetadata adds "| PromptAtWork"; share cards show the post's own
  // title rather than a "— Blog —" breadcrumb.
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const metadata = buildMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.coverImage,
    card: { title: post.title, subtitle: post.excerpt, eyebrow: post.category || "Blog" },
  });
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, publishedTime: post.publishedAt, authors: post.author ? [post.author] : undefined, tags: post.tags },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: BlogPostDetail | null = await client.fetch(blogPostBySlugQuery, { slug });
  if (!post) notFound();

  const contentId = `blog-${post.slug}`;
  const canonicalUrl = getCanonicalUrl(`/blog/${post.slug}`);
  const [reactionCounts, comments, settings]: [ReactionCounts, PublishedComment[], Awaited<ReturnType<typeof getSiteSettings>>] =
    await Promise.all([getReactionCounts(contentId), getPublishedComments(contentId), getSiteSettings()]);
  const person = personRef(settings);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    author: !post.author || post.author === settings.personName ? person : { "@type": "Person", name: post.author },
    publisher: person,
    ...(post.coverImage ? { image: post.coverImage } : {}),
    mainEntityOfPage: canonicalUrl,
  };

  return (
    <PageTransition key={slug} className="min-h-screen">
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[800px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24 sm:pb-28 flex flex-col gap-10">
            <PageHeader
              back={
                <ArrowLink href="/blog" size="sm" direction="back">
                  Blog
                </ArrowLink>
              }
              eyebrow={
                <span className="flex items-center gap-2 flex-wrap font-sans font-normal tracking-normal">
                  {post.category && <Tag variant="plum">{post.category}</Tag>}
                  {post.readingTime && <span className="text-xs text-muted">{post.readingTime}</span>}
                  <span className="text-xs text-muted">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </span>
              }
              title={post.title}
              titleMorph={morphName.blogTitle(post.slug)}
              description={post.excerpt}
            >
              {post.author && <span className="text-sm text-muted">By {post.author}</span>}
            </PageHeader>

            {post.coverImage && (
              <Morph name={morphName.blogCover(post.slug)}>
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 800px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              </Morph>
            )}

            <Reveal className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-line">
              <ReactionBar contentId={contentId} initialCounts={reactionCounts} />
              <ShareActions url={canonicalUrl} title={post.title} summary={post.excerpt} />
            </Reveal>

            <DiagramBody body={post.body} diagrams={post.diagrams} />

            {post.tags && post.tags.length > 0 && (
              <StaggerGrid className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <StaggerItem key={t}>
                    <Tag>{t}</Tag>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}

            <RelatedContent items={post.relatedContent} />

            <div className="pt-8 border-t border-line flex flex-col gap-6">
              <Reveal>
                <h2 className="text-xl font-semibold text-ink">
                  Comments{comments.length > 0 ? ` (${comments.length})` : ""}
                </h2>
              </Reveal>

              {comments.length > 0 && (
                <StaggerGrid className="flex flex-col gap-5">
                  {comments.map((c) => (
                    <StaggerItem key={c.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{c.name}</span>
                        <span className="text-xs text-muted">
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{c.comment}</p>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              )}

              <Reveal className="bg-card border border-line rounded-2xl p-6">
                <p className="text-xs text-muted mb-4">Comments are reviewed before they appear publicly.</p>
                <CommentForm contentId={contentId} />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
