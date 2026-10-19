import type { PortableTextBlock } from "next-sanity";

// Types and pure helpers for the Sanity-backed site content. No server
// imports, so client components can use them; the fetchers are in
// src/lib/content.ts.

export type Cta = { _key?: string; label: string; href: string };
export type AiToolGroup = { _key?: string; category: string; description?: string; tools: string[] };

export type SiteSettings = {
  personName: string;
  personNameCaps?: string;
  personAlternateNames: string[];
  jobTitle: string;
  jobTitles: string[];
  occupations: string[];
  email: string;
  linkedin: string;
  github: string;
  location: string;
  address: { city: string; region: string; countryCode: string; countryName: string };
  brandName: string;
  brandAlternateNames: string[];
  footerBlurb: string;
  footerCopyright: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  toolKeywords: string[];
  personDescription: string;
  personKnowsAbout: string[];
  organizationDescription: string;
  organizationKnowsAbout: string[];
  services: string[];
  llmsTxt: string;
  aiTools: AiToolGroup[];
};

export type HomePage = {
  seoTitle: string;
  seoDescription: string;
  heroTag: string;
  heroIdentity: string;
  heroDisplayLead: string;
  heroDisplayAccent: string;
  heroLead: string;
  heroCtas: Cta[];
  heroPersonRole: string;
  credentialValue: string;
  credentialLabel: string;
  heroChipTitle: string;
  heroChipMeta: string;
  heroCardTitle: string;
  heroCardMeta: string;
  heroCardBadge: string;
  heroCardCustomer: string;
  heroCardReply: string;
  heroCardSteps: { _key?: string; label: string; note: string }[];
  heroCardFooter: string;
  aboutEyebrow: string;
  aboutHeading: string;
  aboutParagraphs: string[];
  aboutBadgeValue: string;
  aboutBadgeLabel: string;
  aboutChips: string[];
  aboutFacts: { _key?: string; title: string; sub: string }[];
  aboutCtas: Cta[];
  coursesHeading: SectionHeading;
  aiLabHeading: SectionHeading;
  testimonialsHeading: SectionHeading;
  contentHeading: SectionHeading;
  linkedinTitle: string;
  linkedinText: string;
};
export type SectionHeading = { eyebrow?: string; title?: string };

export type PageBlock = {
  _key?: string;
  key: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  items?: { _key?: string; title: string; text?: string }[];
  ctas?: Cta[];
};

export type Page = {
  key: string;
  eyebrow?: string;
  tagline?: string;
  title?: string;
  intro?: string;
  ctas?: Cta[];
  body?: PortableTextBlock[];
  blocks?: PageBlock[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

export type CoverLetter = {
  pageTitle: string;
  seoDescription: string;
  headerTitle: string;
  salutation: string;
  opening: string;
  sections: { _key?: string; heading: string; content: string }[];
  closing: string;
  callToAction: string;
  signOff: string;
  signatureName: string;
  signatureTitle: string;
  attachments: { _key?: string; name: string; description: string }[];
};

export type TrainingCategory = "Non-technical" | "Technical" | "Tech + non-tech";
export type SessionPart = { _key?: string; part: string; time: string; what: string };
export type TimelineRow = { _key?: string; label: string; concept: string; practical: string };
export type Capstone = { title: string; description: string; resumeLine: string };
export type TimelineBlock = { _key?: string; title?: string; rows: TimelineRow[]; capstone?: Capstone };
export type ModuleGroup = { _key?: string; title: string; note?: string; modules: string[] };
export type TrainingProgram = {
  _key?: string;
  name: string;
  mode: string;
  schedule: string;
  duration: string;
  sessions: string;
  projects: string;
  summary: string;
  columns: [string, string, string];
  blocks: TimelineBlock[];
};
export type Workshop = {
  slug: string;
  category: TrainingCategory;
  title: string;
  coverTitle: string;
  coverVariant: number;
  tone: "cyan" | "green" | "violet";
  tags: string[];
  highlights: string[];
  description: string;
  idealFor: string[];
  image?: string;
  sessionFormat?: { heading?: string; intro?: string; parts: SessionPart[]; outcome: string };
  programs?: TrainingProgram[];
  timelinesIntro?: string;
  modules?: ModuleGroup[];
};

export type Institute = {
  name: string;
  logo?: { url: string; alt?: string; width: number; height: number };
  period: string;
  description: string;
  highlightLabel?: string;
  highlightText?: string;
  tags: string[];
};

/** A named extra block on a page, e.g. getBlock(page, "teams"). */
export function getBlock(page: Page, key: string): PageBlock | undefined {
  return page.blocks?.find((b) => b.key === key);
}

/** "linkedin.com/in/…" → a full https:// URL. */
export const profileUrl = (handle: string) => `https://${handle}`;
