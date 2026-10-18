import Image from "next/image";
import Tag from "../ui/Tag";
import MotionCard, { MotionCardMedia } from "../motion/MotionCard";
import Morph from "../motion/Morph";
import { morphName } from "../../lib/motion";
import Thumb from "../paw/Thumb";

export type BlogCardData = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readingTime?: string;
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
};

export default function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <MotionCard
      href={`/blog/${post.slug}`}
      className="group h-full bg-card border border-line rounded-2xl flex flex-col overflow-hidden"
    >
      {post.coverImage ? (
        <>
          <Morph name={morphName.blogCover(post.slug)}>
            <MotionCardMedia className="w-full aspect-[16/9]">
              <Image src={post.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </MotionCardMedia>
          </Morph>
          <BlogCardBody post={post} />
        </>
      ) : (
        // No cover yet: the text sits on the token-built artwork rather than
        // under an empty block of it.
        <Thumb variant="violet" aspect="auto" className="h-full rounded-none">
          <BlogCardBody post={post} withTags />
        </Thumb>
      )}
    </MotionCard>
  );
}

function BlogCardBody({ post, withTags = false }: { post: BlogCardData; withTags?: boolean }) {
  return (
    <div className="p-6 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 flex-wrap">
        {post.category && <Tag variant="plum">{post.category}</Tag>}
        {post.readingTime && <span className="text-xs text-muted">{post.readingTime}</span>}
      </div>
      <Morph name={morphName.blogTitle(post.slug)}>
        <h2 className="text-xl font-semibold text-ink group-hover:text-primary self-start">{post.title}</h2>
      </Morph>
      <p className="text-sm text-muted leading-relaxed">{post.excerpt}</p>
      {withTags && !!post.tags?.length && (
        <span className="self-start px-3 py-2 rounded-lg bg-[color-mix(in_srgb,var(--surface-container-lowest)_75%,transparent)] border border-line font-mono text-[12px] leading-5 text-[var(--on-surface)]">
          {post.tags.slice(0, 3).join(" · ")}
        </span>
      )}
      <span className="mt-auto text-xs text-muted">
        {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </span>
    </div>
  );
}
