// Single source for every site-wide link list: the header menu (Nav.tsx,
// used on every page including /portfolio), the AI Lab dropdown and sidebar
// groups, and the footer columns. Edit here, not in the components.
//
// Absolute paths throughout, even for homepage anchors (/#about, not
// #about) — a bare #anchor silently does nothing from any route other
// than "/", since there's no matching id on the current page to scroll to.

export type NavLink = { href: string; label: string; external?: boolean };

// The chevron-network mark (design/promptatwork-redesign/assets/logos). The
// old "P/" text mark is retired.
export const brand = { name: "PromptAtWork", logo: "/images/brand/promptatwork-mark.png" };

// The AI Lab hub's segments, in reading order, for Nav's dropdown. Tools &
// Research (/ai-lab/tools) is left out of the dropdown; it stays in the AI
// Lab sidebar and overview, which drop any section with nothing published
// (src/app/ai-lab/layout.tsx, src/app/ai-lab/page.tsx).
export const aiLabSections: (NavLink & { description: string })[] = [
  { href: "/ai-lab", label: "Overview", description: "Where to start and how the lab is organised." },
  {
    href: "/ai-lab/work",
    label: "Case Studies & Architecture",
    description: "Shipped systems: the problem, the architecture that solved it, and the future scope.",
  },
  {
    href: "/ai-lab/engineering",
    label: "Systems & Core Engineering",
    description: "Engineering capabilities, each backed by real project evidence.",
  },
  {
    href: "/ai-lab/experiments",
    label: "Applied Experiments & Benchmarks",
    description: "Designed and completed tests: the protocol, and the results once it has run.",
  },
  {
    href: "/ai-lab/prompts",
    label: "Prompt & Content Engineering",
    description: "Reusable enterprise prompts with example input, output and failure modes.",
  },
  {
    href: "/ai-lab/automations",
    label: "Intelligent Automations & Pipelines",
    description: "Trigger → AI processing → action, end to end.",
  },
];

// The AI Lab overview's section cards, in order. Copy lives here so the
// card images (src/lib/card-images) are generated from the same text.
export const aiLabHubSections = [
  { href: "/ai-lab/work", label: "Case Studies & Architecture", body: "Shipped systems: the problem, the architecture that solved it, and the future scope." },
  { href: "/ai-lab/engineering", label: "Systems & Core Engineering", body: "Each engineering capability, linked to the project that proves it." },
  { href: "/ai-lab/experiments", label: "Applied Experiments & Benchmarks", body: "Test protocols and benchmarks, marked designed, running or completed." },
  { href: "/ai-lab/prompts", label: "Prompt & Content Engineering", body: "Reusable enterprise prompt templates, ready to copy." },
  { href: "/ai-lab/automations", label: "Intelligent Automations & Pipelines", body: "Pipelines and connectors from those projects, laid out step by step." },
  { href: "/ai-lab/tools", label: "Tools & Research", body: "Hands-on reviews of the tools used." },
] as const;

/** Sidebar, breadcrumb and page-title label for an AI Lab segment, e.g. aiLabLabel("/ai-lab/work"). */
export function aiLabLabel(href: (typeof aiLabHubSections)[number]["href"]): string {
  return aiLabHubSections.find((s) => s.href === href)!.label;
}

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

/** Footer link columns; the LinkedIn link is the profile URL from Site settings (left out when it isn't known). */
export const footerColumns = (linkedinUrl?: string): { title: string; links: NavLink[] }[] => [
  {
    title: "AI Lab",
    links: [
      ...aiLabSections.filter((s) => s.href !== "/ai-lab").map(({ href, label }) => ({ href, label })),
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
      ...(linkedinUrl ? [{ href: linkedinUrl, label: "LinkedIn", external: true }] : []),
      { href: "/portfolio", label: "Portfolio" },
    ],
  },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
