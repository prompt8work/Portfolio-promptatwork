import MotionCard from "../motion/MotionCard";
import Morph from "../motion/Morph";
import { morphName } from "../../lib/motion";
import { grid, Tools } from "../offerings/OfferingCard";
import type { BlogKind, BlogPostView } from "../../lib/blog-kinds";

// The /blog card, in the course-card style (OfferingCard on art): the
// text sits on a gradient, with no cover image, so nothing gets cropped.
// The colour says what kind of post it is, so a long list of reviews scans
// at a glance: teal-green for tools, violet-magenta for models, navy-indigo
// for articles. Dark in both themes, like every thumbnail.

export const kindStyle: Record<
  BlogKind,
  { label: string; gradient: string; dot: string }
> = {
  tool: {
    label: "Tool review",
    gradient: "from-[#0e7490] to-[#064e3b]",
    dot: "bg-[#5eead4]",
  },
  model: {
    label: "Model review",
    gradient: "from-[#4c1d95] to-[#9d174d]",
    dot: "bg-[#f0abfc]",
  },
  article: {
    label: "Article",
    gradient: "from-[#1e1b4b] to-[#1e3a8a]",
    dot: "bg-[#93c5fd]",
  },
};

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function BlogCard({ post }: { post: BlogPostView }) {
  const k = kindStyle[post.kind];
  const meta = [post.company, post.topic, post.readingTime].filter(
    Boolean,
  ) as string[];
  // Chips: the subject first, then topics not already in the meta line.
  const chips = [
    post.subject,
    // "AI Tool Review"-style tags only repeat the badge.
    ...(post.tags ?? []).filter((t) => t !== post.subject && !meta.includes(t) && !/\breviews?$/i.test(t)),
  ]
    .filter(Boolean)
    .slice(0, 3) as string[];

  return (
    <MotionCard
      href={`/blog/${post.slug}`}
      tone="dark"
      className={`group relative isolate h-full flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-linear-to-br p-6 ${k.gradient}`}
    >
      <div className={`${grid} -z-10`} />
      <span className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-xs font-semibold text-white/85">
        <i className={`h-[7px] w-[7px] rounded-full ${k.dot}`} />
        {k.label}
      </span>
      <Morph name={morphName.blogTitle(post.slug)}>
        <h2 className="mb-1.5 self-start text-lg sm:text-xl font-semibold text-white group-hover:underline decoration-white/40 underline-offset-4">
          {post.title}
        </h2>
      </Morph>
      {meta.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[13px] text-white/60">
          {meta.map((m, i) => (
            <span key={m}>
              {i > 0 && <span className="mr-2.5">•</span>}
              {m}
            </span>
          ))}
        </div>
      )}
      <p className="mb-5 flex-1 text-[15px] leading-relaxed text-white/75 line-clamp-4">
        {post.excerpt}
      </p>
      {chips.length > 0 && (
        <div className="mb-4">
          <Tools items={chips} />
        </div>
      )}
      <div className="flex items-center justify-between gap-3 text-[13px] text-white/60">
        <time dateTime={post.publishedAt}>{date(post.publishedAt)}</time>
        <span
          aria-hidden
          className="font-medium text-white/80 transition-transform group-hover:translate-x-0.5"
        >
          Read {post.kind === "article" ? "article" : "review"} →
        </span>
      </div>
    </MotionCard>
  );
}
