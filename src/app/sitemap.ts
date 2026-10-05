import type { MetadataRoute } from "next";
import { client } from "../sanity/lib/client";
import {
  automationSlugsQuery,
  blogSlugsQuery,
  experimentSlugsQuery,
  portfolioSlugsQuery,
  projectSlugsQuery,
  promptSlugsQuery,
  sitemapUpdatedAtQuery,
  toolSlugsQuery,
  trainingSlugsQuery,
} from "../sanity/lib/queries";
import { getCanonicalUrl } from "../lib/site";
import { trainings } from "../lib/trainings";

// Real, generated URLs only — every dynamic segment below is pulled from
// the exact same Sanity queries the pages themselves use (never a
// hand-maintained list that can drift from what's actually published).
// Training workshops come from src/lib/trainings.ts, the same file their
// pages are built from.
// /studio is deliberately excluded — see robots.ts.
export const revalidate = 3600;

const staticPaths = [
  "/",
  "/ai-lab",
  "/ai-lab/work",
  "/ai-lab/engineering",
  "/ai-lab/tools",
  "/ai-lab/experiments",
  "/ai-lab/prompts",
  "/ai-lab/automations",
  "/blog",
  "/contact",
  "/cover-letter",
  "/portfolio",
  "/privacy",
  "/testimonials",
  "/training",
  "/videos",
];

// Hint for crawlers about which pages matter most: the homepage and the
// training/AI Lab hubs carry the "prompt engineer / Generative AI trainer
// in Indore" positioning, so they rank above individual entries.
function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (["/training", "/ai-lab", "/contact", "/portfolio"].includes(path)) return 0.9;
  if (path.startsWith("/portfolio/")) return 0.9;
  if (path.startsWith("/training/") || path === "/blog") return 0.8;
  if (["/privacy", "/cover-letter"].includes(path)) return 0.3;
  return 0.6;
}

// URL prefix for each Sanity type that has its own page, to match a
// document's _updatedAt to its URL.
const pathPrefixByType: Record<string, string> = {
  project: "/ai-lab/work/",
  tool: "/ai-lab/tools/",
  prompt: "/ai-lab/prompts/",
  experiment: "/ai-lab/experiments/",
  automation: "/ai-lab/automations/",
  blog: "/blog/",
  training: "/training/",
  portfolioProfile: "/portfolio/",
};

// Section hubs list entries of these types, so a hub counts as changed
// whenever its newest entry changed.
const hubTypes: Record<string, string[]> = {
  "/ai-lab": ["project", "tool", "prompt", "experiment", "automation", "engineeringArea"],
  "/ai-lab/work": ["project"],
  "/ai-lab/engineering": ["engineeringArea", "project"],
  "/ai-lab/tools": ["tool"],
  "/ai-lab/prompts": ["prompt"],
  "/ai-lab/experiments": ["experiment"],
  "/ai-lab/automations": ["automation"],
  "/blog": ["blog"],
  "/training": ["training"],
  "/portfolio": ["portfolioProfile", "project"],
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, toolSlugs, promptSlugs, experimentSlugs, automationSlugs, blogSlugs, trainingSlugs, portfolioSlugs, updatedDocs] =
    await Promise.all([
      client.fetch<string[]>(projectSlugsQuery),
      client.fetch<string[]>(toolSlugsQuery),
      client.fetch<string[]>(promptSlugsQuery),
      client.fetch<string[]>(experimentSlugsQuery),
      client.fetch<string[]>(automationSlugsQuery),
      client.fetch<string[]>(blogSlugsQuery),
      client.fetch<string[]>(trainingSlugsQuery),
      client.fetch<string[]>(portfolioSlugsQuery),
      client.fetch<{ _type: string; slug: string; _updatedAt: string }[]>(sitemapUpdatedAtQuery),
    ]);

  // Search engines stop trusting <lastmod> when every URL claims "today",
  // so only real Sanity edit dates are sent; pages without one omit it.
  const updatedAtByPath = new Map<string, string>();
  const newestByType = new Map<string, string>();
  for (const doc of updatedDocs) {
    const prefix = pathPrefixByType[doc._type];
    if (prefix) updatedAtByPath.set(`${prefix}${doc.slug}`, doc._updatedAt);
    if ((newestByType.get(doc._type) ?? "") < doc._updatedAt) newestByType.set(doc._type, doc._updatedAt);
  }
  const lastModifiedFor = (path: string): Date | undefined => {
    const dates = path in hubTypes ? hubTypes[path].map((t) => newestByType.get(t)) : [updatedAtByPath.get(path)];
    const newest = dates.filter((d): d is string => Boolean(d)).sort().at(-1);
    return newest ? new Date(newest) : undefined;
  };

  const dynamicPaths = [
    ...projectSlugs.map((s) => `/ai-lab/work/${s}`),
    ...toolSlugs.map((s) => `/ai-lab/tools/${s}`),
    ...promptSlugs.map((s) => `/ai-lab/prompts/${s}`),
    ...experimentSlugs.map((s) => `/ai-lab/experiments/${s}`),
    ...automationSlugs.map((s) => `/ai-lab/automations/${s}`),
    ...blogSlugs.map((s) => `/blog/${s}`),
    ...trainings.map((t) => `/training/${t.slug}`),
    ...trainingSlugs.filter((s) => !trainings.some((t) => t.slug === s)).map((s) => `/training/${s}`),
    ...portfolioSlugs.map((s) => `/portfolio/${s}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: getCanonicalUrl(path),
    lastModified: lastModifiedFor(path),
    priority: priorityFor(path),
  }));
}
