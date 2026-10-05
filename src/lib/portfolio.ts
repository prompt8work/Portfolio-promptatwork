import { client } from "../sanity/lib/client";
import {
  portfolioAiLabProjectsQuery,
  portfolioProfileBySlugQuery,
  portfolioProfilesQuery,
  portfolioSettingsQuery,
  portfolioSlugsQuery,
} from "../sanity/lib/queries";

// Loaders and types for the Sanity-driven portfolio pages (/portfolio and
// /portfolio/[slug]). Schema: src/sanity/schemaTypes/portfolioProfile.ts.

export type PortfolioImage = { alt?: string; url: string; width: number; height: number };
export type Cta = { _key?: string; label?: string; href?: string; style?: "primary" | "secondary" | "link" };

type SectionHead = { eyebrow?: string; title?: string; intro?: string; anchorId?: string };

export type Offering = {
  _key: string;
  title: string;
  category: string;
  tone?: "cyan" | "green" | "violet";
  thumbStyle?: "banner" | "terminal";
  thumbTitle?: string;
  thumbVariant?: number;
  thumbTools?: string[];
  snippet?: string;
  meta?: string[];
  description?: string;
  footLabel?: string;
  footText?: string;
  link?: Cta;
};

export type DiagramNode = { _key: string; title: string; detail?: string; tone?: "plain" | "source" | "core" | "output" };

export type PortfolioProfile = {
  title: string;
  slug: string;
  summary: string;
  seoTitle?: string;
  heroImage: PortfolioImage;
  heroEyebrow?: string;
  heroHeadline: string;
  heroLead?: string;
  heroCtas?: Cta[];
  heroChecks?: string[];
  heroStripLabel?: string;
  heroLogos?: PortfolioImage[];
  heroChips?: string[];
  profileRole?: string;
  profileTags?: string[];
  profileCtas?: Cta[];
  offerings?: SectionHead & { items?: Offering[] };
  featuredProject?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    tags?: string[];
    link?: Cta;
    diagramRows?: { _key: string; nodes?: DiagramNode[] }[];
    diagramCaption?: string;
  };
  projects?: SectionHead & {
    items?: { _key: string; kind?: string; title: string; description?: string; tags?: string[]; link?: Cta }[];
    closingCard?: { kind?: string; title?: string; description?: string; link?: Cta };
  };
  audience?: SectionHead & { panels?: { _key: string; eyebrow?: string; title: string; intro?: string; points?: string[] }[] };
  process?: SectionHead & { steps?: { _key: string; title: string; description?: string }[]; loopNote?: string };
  stack?: SectionHead & {
    featured?: SectionHead & { items?: { _key: string; name: string; detail?: string }[]; tags?: string[] };
    groups?: { _key: string; title: string; items?: string[] }[];
  };
  institutes?: SectionHead & {
    items?: {
      _key: string;
      name: string;
      logo?: PortfolioImage;
      period?: string;
      description?: string;
      highlightLabel?: string;
      highlightText?: string;
      tags?: string[];
    }[];
  };
  experience?: SectionHead & {
    roles?: { _key: string; role: string; company: string; period: string; major?: boolean; highlights?: string[] }[];
  };
  whyMe?: SectionHead & {
    items?: { _key: string; icon?: "code" | "graduation" | "document" | "shield" | "target"; title: string; description?: string }[];
  };
  ctaBand?: { title?: string; text?: string; ctas?: Cta[] };
  faq?: SectionHead & { items?: { _key: string; question: string; answer: string; link?: Cta }[] };
};

export type PortfolioCard = Pick<PortfolioProfile, "title" | "slug" | "summary" | "heroEyebrow" | "heroImage">;

export type PortfolioSettings = {
  landingEyebrow?: string;
  landingTitle: string;
  landingIntro?: string;
  servicesEyebrow?: string;
  servicesTitle?: string;
  servicesIntro?: string;
  services?: { title: string; description?: string; anchor?: string; linkLabel?: string; profileSlug?: string }[];
  earlierRoles: { _key: string; role: string; company: string; period?: string }[];
  credentials: string[];
};

export type AiLabProject = {
  slug: string;
  title: string;
  category?: string;
  summary: string;
  stats?: string[];
  tech?: string[];
};

export const portfolioPath = (slug: string) => `/portfolio/${slug}`;
export const aiLabProjectPath = (slug: string) => `/ai-lab/work/${slug}`;

export async function getAiLabProjects(): Promise<AiLabProject[]> {
  return client.fetch(portfolioAiLabProjectsQuery);
}

export async function getPortfolioProfile(slug: string): Promise<PortfolioProfile | null> {
  return client.fetch(portfolioProfileBySlugQuery, { slug });
}

export async function getPortfolioProfiles(): Promise<PortfolioCard[]> {
  return client.fetch(portfolioProfilesQuery);
}

export async function getPortfolioSlugs(): Promise<string[]> {
  return client.fetch(portfolioSlugsQuery);
}

export async function getPortfolioSettings(): Promise<PortfolioSettings | null> {
  return client.fetch(portfolioSettingsQuery);
}
