// Single source for every site-wide link list: the header menu (Nav.tsx,
// used on every page including /portfolio), the AI Lab dropdown and sidebar
// groups, and the footer columns. Edit here, not in the components.
//
// Absolute paths throughout, even for homepage anchors (/#about, not
// #about) — a bare #anchor silently does nothing from any route other
// than "/", since there's no matching id on the current page to scroll to.

import { personalInfo } from "../../data";

export type NavLink = { href: string; label: string; external?: boolean };

// The chevron-network mark (design/promptatwork-redesign/assets/logos). The
// old "P/" text mark is retired.
export const brand = { name: "PromptAtWork", logo: "/images/brand/promptatwork-mark.png" };

// The AI Lab hub's groups, in reading order, for Nav's dropdown. Only
// sections with published entries are listed: add Tools & Research
// (/ai-lab/tools), Experiments (/ai-lab/experiments) or Prompt Library
// (/ai-lab/prompts) back here once they have content. The AI Lab sidebar
// does this automatically (src/app/ai-lab/layout.tsx).
export const aiLabSections: (NavLink & { description: string })[] = [
  { href: "/ai-lab", label: "Overview", description: "Where to start and how the lab is organised." },
  {
    href: "/ai-lab/work",
    label: "Work & Case Studies",
    description: "Shipped projects: the problem, how it was solved, and the future scope.",
  },
  {
    href: "/ai-lab/engineering",
    label: "Engineering",
    description: "Capabilities, each backed by real project evidence.",
  },
  {
    href: "/ai-lab/automations",
    label: "Automations",
    description: "Trigger → AI processing → action, end to end.",
  },
];

// The AI Lab overview's section cards, in order. Copy lives here so the
// card images (src/lib/card-images) are generated from the same text.
export const aiLabHubSections = [
  { href: "/ai-lab/work", label: "Work & Case Studies", body: "Shipped projects: the problem, how it was solved, and the future scope." },
  { href: "/ai-lab/engineering", label: "Engineering", body: "Each capability, linked to the project that proves it." },
  { href: "/ai-lab/automations", label: "Automations", body: "Pipelines and connectors from those projects, laid out step by step." },
  { href: "/ai-lab/tools", label: "Tools & Research", body: "Hands-on reviews of the tools used." },
  { href: "/ai-lab/prompts", label: "Prompt Library", body: "Reusable prompt templates." },
  { href: "/ai-lab/experiments", label: "Experiments", body: "What worked, what failed and what was decided." },
] as const;

// The two portfolio profiles (Sanity "Portfolio profile" documents). Static
// here rather than fetched, like the AI Lab groups above.
export const portfolioSections: (NavLink & { description: string })[] = [
  { href: "/portfolio", label: "Overview", description: "Both profiles side by side." },
  {
    href: "/portfolio/ai-solutions-engineer",
    label: "AI Solutions Engineer",
    description: "RAG, agents, MCP and AI integrations, built end to end.",
  },
  {
    href: "/portfolio/ai-enablement-officer",
    label: "AI Enablement & Training",
    description: "Hands-on AI workshops for technical and business teams.",
  },
];

// Labels follow the redesign (Courses = /training, TV = /videos); the URLs
// are unchanged. The logo links home, so there's no Home item.
export const mainNav: (NavLink & { children?: typeof aiLabSections })[] = [
  { href: "/ai-lab", label: "AI Lab", children: aiLabSections },
  { href: "/training", label: "Courses" },
  { href: "/videos", label: "TV" },
  { href: "/blog", label: "Blog" },
  { href: "/portfolio", label: "Portfolio", children: portfolioSections },
];

export const contactCta: NavLink = { href: "/contact", label: "Let's Connect" };

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "AI Lab",
    links: [
      { href: "/ai-lab/work", label: "Work & Case Studies" },
      { href: "/ai-lab/engineering", label: "Engineering" },
      { href: "/ai-lab/automations", label: "Automations" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/training", label: "Courses" },
      { href: "/videos", label: "TV" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/testimonials", label: "Testimonials" },
      // LinkedIn is a distribution channel for this site's blog content, not
      // an imported content source (PRD 04.2).
      { href: `https://${personalInfo.linkedin}`, label: "LinkedIn", external: true },
      { href: "/portfolio", label: "Portfolio" },
    ],
  },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
