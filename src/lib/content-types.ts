import type { PortableTextBlock } from "next-sanity";
import type { Diagram } from "../components/diagrams/types";
import type { RelatedItem } from "../components/ai-lab/RelatedContent";

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

// --- AI Lab -------------------------------------------------------------
// One type per GROQ projection in src/sanity/lib/queries.ts; keep the two in
// step. Fields are optional unless the schema marks them required.
// Diagrams use the shared Diagram type (src/components/diagrams/types.ts).

type ToolRef = { slug: string; name: string };

export type ProjectListItem = {
  slug: string;
  title: string;
  category?: string;
  visibility: "public" | "generalized" | "private";
  confidentialityNote?: string;
  summary: string;
  stats?: string[];
  tech?: string[];
  aiModels?: string[];
  coverImage?: string;
};

export type ProjectDetail = ProjectListItem & {
  overview?: string;
  problem?: string;
  context?: string;
  solution?: string;
  role?: string;
  architecture?: string;
  workflow?: string;
  challenges?: string;
  results?: string;
  learnings?: string;
  futureScope?: string;
  diagrams?: Diagram[];
  relatedContent?: RelatedItem[];
};

/** Schema options for experiment.status (src/sanity/schemaTypes/experiment.ts). */
export const experimentStatuses = [
  { value: "designed", title: "Designed, not run yet", badge: "Designed · not run yet" },
  { value: "running", title: "Running", badge: "Running" },
  { value: "completed", title: "Completed", badge: "Completed" },
] as const;
export type ExperimentStatus = (typeof experimentStatuses)[number]["value"];

/** An experiment saved before the status field existed reads as completed. */
export const experimentStatus = (e: { status?: ExperimentStatus | null }): ExperimentStatus => e.status ?? "completed";

export type ExperimentListItem = {
  slug: string;
  title: string;
  objective: string;
  status?: ExperimentStatus | null;
  toolName?: string;
  cardImage?: string;
};

export type ExperimentDetail = {
  slug: string;
  title: string;
  status?: ExperimentStatus | null;
  cardImage?: string;
  objective: string;
  hypothesis?: string;
  problem?: string;
  setup?: string;
  promptOrWorkflow?: string;
  input?: string;
  output?: string;
  whatWorked?: string;
  whatFailed?: string;
  learning?: string;
  decision?: string;
  nextStep?: string;
  useCases?: string[];
  tool?: ToolRef;
  diagrams?: Diagram[];
  relatedContent?: RelatedItem[];
};

export type PromptListItem = {
  slug: string;
  title: string;
  category: string;
  purpose?: string;
  toolName?: string;
  cardImage?: string;
};

export type PromptDetail = {
  slug: string;
  title: string;
  cardImage?: string;
  category: string;
  purpose?: string;
  prompt: string;
  variables?: string[];
  exampleInput?: string;
  exampleOutput?: string;
  expectedBehavior?: string;
  failureModes: string[];
  difficulty?: string;
  tips?: string;
  tool?: ToolRef;
  diagrams?: Diagram[];
  relatedContent?: RelatedItem[];
};

export type AutomationListItem = {
  slug: string;
  title: string;
  description: string;
  trigger?: string;
  cardImage?: string;
};

export type AutomationDetail = {
  slug: string;
  title: string;
  cardImage?: string;
  category?: string;
  description: string;
  problem?: string;
  trigger?: string;
  steps?: { label: string; description?: string }[];
  architecture?: string;
  input?: string;
  output?: string;
  integrations: string[];
  limitations?: string;
  securityNotes?: string;
  learnings?: string;
  tools?: ToolRef[];
  diagrams?: Diagram[];
  relatedContent?: RelatedItem[];
};

export type EngineeringEvidence = { _type: "project" | "automation" | "prompt" | "experiment" | "tool"; slug: string; title: string };
export type EngineeringArea = { id: string; title: string; description: string; items?: string[] | null; evidence: EngineeringEvidence[] };

/** A named extra block on a page, e.g. getBlock(page, "teams"). */
export function getBlock(page: Page, key: string): PageBlock | undefined {
  return page.blocks?.find((b) => b.key === key);
}

/** "linkedin.com/in/…" → a full https:// URL. */
export const profileUrl = (handle: string) => `https://${handle}`;
