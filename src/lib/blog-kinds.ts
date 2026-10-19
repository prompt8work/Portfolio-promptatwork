// What kind of post a blog entry is, and its topic, for the /blog cards and
// filters. Nothing new is stored: it's read from fields the review writer
// (the tool-review-writer skill) already fills consistently:
//   category  "AI Tool Reviews" | "AI Model Reviews" | anything else
//   tags      [item name, company, Domain (tools) or Model type (models), …topics]
// Any other post is a general article, with no topic.

export type BlogKind = "tool" | "model" | "article";

export type BlogListPost = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readingTime?: string;
  publishedAt: string;
  tags?: string[];
};

export type BlogPostView = BlogListPost & {
  kind: BlogKind;
  /** Domain for a tool review, model type for a model review. */
  topic?: string;
  /** The reviewed tool or model and its company. */
  subject?: string;
  company?: string;
};

export function blogKind(category?: string): BlogKind {
  if (/tool review/i.test(category ?? "")) return "tool";
  if (/model review/i.test(category ?? "")) return "model";
  return "article";
}

export function toBlogView(post: BlogListPost): BlogPostView {
  const kind = blogKind(post.category);
  if (kind === "article") return { ...post, kind };
  const [subject, company, topic] = post.tags ?? [];
  return { ...post, kind, subject, company, topic };
}
