import type { MetadataRoute } from "next";
import { client } from "../sanity/lib/client";
import {
  automationSlugsQuery,
  blogSlugsQuery,
  experimentSlugsQuery,
  portfolioSlugsQuery,
  projectSlugsQuery,
  promptSlugsQuery,
  toolSlugsQuery,
  trainingSlugsQuery,
} from "../sanity/lib/queries";
import { getCanonicalUrl } from "../lib/site";

// Real, generated URLs only — every dynamic segment below is pulled from
// the exact same Sanity queries the pages themselves use (never a
// hand-maintained list that can drift from what's actually published).
// /studio is deliberately excluded — see robots.ts.
export const revalidate = 3600;

const staticPaths = [
  "/",
  "/ai-lab",
  "/ai-lab/work",
  "/ai-lab/engineering",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, toolSlugs, promptSlugs, experimentSlugs, automationSlugs, blogSlugs, trainingSlugs, portfolioSlugs] =
    await Promise.all([
      client.fetch<string[]>(projectSlugsQuery),
      client.fetch<string[]>(toolSlugsQuery),
      client.fetch<string[]>(promptSlugsQuery),
      client.fetch<string[]>(experimentSlugsQuery),
      client.fetch<string[]>(automationSlugsQuery),
      client.fetch<string[]>(blogSlugsQuery),
      client.fetch<string[]>(trainingSlugsQuery),
      client.fetch<string[]>(portfolioSlugsQuery),
    ]);

  const dynamicPaths = [
    ...projectSlugs.map((s) => `/ai-lab/work/${s}`),
    ...toolSlugs.map((s) => `/ai-lab/tools/${s}`),
    ...promptSlugs.map((s) => `/ai-lab/prompts/${s}`),
    ...experimentSlugs.map((s) => `/ai-lab/experiments/${s}`),
    ...automationSlugs.map((s) => `/ai-lab/automations/${s}`),
    ...blogSlugs.map((s) => `/blog/${s}`),
    ...trainingSlugs.map((s) => `/training/${s}`),
    ...portfolioSlugs.map((s) => `/portfolio/${s}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: getCanonicalUrl(path),
    lastModified: new Date(),
    priority: priorityFor(path),
  }));
}
