import type { Cta, Offering, PortfolioImage } from "./portfolio";

// The one source for the workshops & courses and the institutes trained
// for. /training, /training/[slug] and the "Workshops & courses" and
// "Institutes I've trained for" sections of /portfolio/ai-enablement-officer
// all read from here, so a change made in this file shows up everywhere.
// Copy is verbatim from the portfolio page; don't add syllabus, duration,
// pricing or outcomes that haven't happened (Docs/design/content-guidelines.md).

export const trainingCategories = [
  { slug: "non-technical", label: "Non-technical" },
  { slug: "technical", label: "Technical" },
  { slug: "tech-non-tech", label: "Tech + non-tech" },
] as const;

export type TrainingCategory = (typeof trainingCategories)[number]["label"];

/** One module of a training's outline. None are written up yet. */
export type TrainingModule = { title: string; description?: string };

export type Training = {
  slug: string;
  category: TrainingCategory;
  title: string;
  /** Cover headline; "*word*" segments are highlighted. */
  coverTitle: string;
  /** Cover artwork, 1–9 (see OfferingCard). */
  coverVariant: number;
  tone: "cyan" | "green" | "violet";
  tags: string[];
  highlights: string[];
  description: string;
  idealFor: string[];
  // PLACEHOLDER: module outlines are added later. While this is empty the
  // detail page shows a "coming soon" note in the Modules section.
  modules?: TrainingModule[];
};

export const trainings: Training[] = [
  {
    slug: "prompt-engineering-for-business-teams",
    category: "Non-technical",
    title: "Prompt Engineering for Business Teams",
    coverTitle: "Prompt *engineering* for business teams",
    coverVariant: 1,
    tone: "green",
    tags: ["Claude", "Gemini", "ChatGPT"],
    highlights: ["Prompt patterns", "Role-based libraries"],
    description:
      "Write prompts that give reliable results for everyday work: documents, emails, analysis and meeting notes. Comes with ready-to-use prompts organised by role.",
    idealFor: ["Managers", "Product Owners", "Operations"],
  },
  {
    slug: "advanced-prompt-engineering-for-engineers",
    category: "Technical",
    title: "Advanced Prompt Engineering for Engineers",
    coverTitle: "Advanced prompt engineering *for engineers*",
    coverVariant: 2,
    tone: "cyan",
    tags: ["Claude API", "OpenAI", "2-day course"],
    highlights: ["2-day course", "Chain-of-thought", "LLM APIs"],
    description:
      "Foundations, advanced prompt patterns and production integration with Claude, OpenAI and other LLM platforms, with real-world case studies and a reusable prompt library.",
    idealFor: ["Developers", "QA Engineers"],
  },
  {
    slug: "ai-first-assisted-coding",
    category: "Technical",
    title: "AI-First Assisted Coding",
    coverTitle: "AI-first *assisted coding*",
    coverVariant: 3,
    tone: "cyan",
    tags: ["Claude Code", "Copilot", "MCP"],
    highlights: ["Claude Code", "Prompt patterns", "Agentic workflows"],
    description:
      "Use Claude Code, GitHub Copilot and V0.dev as everyday coding partners: prompt patterns for code, agentic workflows and connecting tools through MCP servers.",
    idealFor: ["Developers", "QA", "Tech leads"],
  },
  {
    slug: "full-stack-web-development-with-ai",
    category: "Technical",
    title: "Full-Stack Web Development with AI",
    coverTitle: "Full-stack development *with AI*",
    coverVariant: 4,
    tone: "cyan",
    tags: ["React", "Python", "REST APIs"],
    highlights: ["Requirements → deploy", "AI pair-programming"],
    description:
      "Build and ship a working web application end to end with AI assistants, from requirements and design through code, tests and deployment.",
    idealFor: ["Developers", "Engineering students"],
  },
  {
    slug: "fundamentals-workshop-for-ai-builders",
    category: "Tech + non-tech",
    title: "Fundamentals Workshop for AI Builders",
    coverTitle: "AI builder *fundamentals*",
    coverVariant: 5,
    tone: "violet",
    tags: ["LLMs", "RAG", "APIs"],
    highlights: ["LLMs", "Embeddings & RAG", "Tool use"],
    description:
      "The building blocks behind every AI product: models, prompts, embeddings, retrieval, APIs and tools, explained through building a first working AI app.",
    idealFor: ["Students", "Professionals", "Product teams"],
  },
  {
    slug: "agentic-ai-llm-frameworks-and-mcp",
    category: "Technical",
    title: "Agentic AI, LLM Frameworks & MCP",
    coverTitle: "Agentic AI *& MCP*",
    coverVariant: 6,
    tone: "cyan",
    tags: ["LangChain", "LangGraph", "CrewAI", "AutoGen"],
    highlights: ["Chains", "AI agents", "Model Context Protocol"],
    description:
      "Build chains, AI agents and agentic workflows with LangChain, LangGraph, CrewAI and AutoGen, and connect them to real systems through the Model Context Protocol.",
    idealFor: ["Developers", "Data & AI students"],
  },
  {
    slug: "ai-concepts-clearly-explained",
    category: "Tech + non-tech",
    title: "AI Concepts, Clearly Explained",
    coverTitle: "AI concepts, *clearly explained*",
    coverVariant: 7,
    tone: "violet",
    tags: ["No code", "How LLMs work"],
    highlights: ["Conceptual class", "No coding needed"],
    description:
      "How generative AI actually works, what it is good and bad at, and how to judge its output, taught so that technical and non-technical learners leave with the same mental model.",
    idealFor: ["Leaders", "Mixed teams", "Students"],
  },
  {
    slug: "ai-at-work-claude-google-workspace-microsoft-365",
    category: "Non-technical",
    title: "AI at Work: Claude, Google Workspace & Microsoft 365",
    coverTitle: "AI in your *office tools*",
    coverVariant: 8,
    tone: "green",
    tags: ["Claude", "Google Workspace", "Microsoft 365"],
    highlights: ["claude.ai", "Gemini in Docs, Sheets, Gmail, Meet", "Microsoft 365"],
    description:
      "Use Claude, Gemini for Google Workspace and Microsoft 365 for daily work, department by department, with clear usage guidelines and data handling practices so adoption stays secure.",
    idealFor: ["MIS", "Accounts", "Sales", "Admin", "Design"],
  },
  {
    slug: "ai-enabled-sdlc",
    category: "Technical",
    title: "AI-Enabled SDLC",
    coverTitle: "AI-enabled *SDLC*",
    coverVariant: 9,
    tone: "cyan",
    tags: ["Requirements", "Testing", "Templates"],
    highlights: ["Every delivery phase", "Setup guides", "Document templates"],
    description:
      "Use AI across every phase of software delivery, from requirements gathering to maintenance, with setup guides for Claude.ai, GitHub Copilot and VS Code and reusable document templates.",
    idealFor: ["Dev teams", "QA", "Project managers"],
  },
];

export type Institute = {
  name: string;
  logo: PortfolioImage;
  period: string;
  description: string;
  highlightLabel?: string;
  highlightText?: string;
  tags: string[];
};

export const institutes: Institute[] = [
  {
    name: "Boston Institute of Analytics",
    logo: { url: "/images/bia-logo.png", alt: "Boston Institute of Analytics", width: 800, height: 202 },
    period: "Prompt at Work · Oct 2026 – Present",
    description: "Training on LLM application frameworks: chains, AI agents, agentic workflows and the Model Context Protocol.",
    tags: ["LangChain", "LangGraph", "CrewAI", "AutoGen", "MCP"],
  },
  {
    name: "Bignalytics",
    logo: { url: "/images/bignalytics-logo.png", alt: "Bignalytics", width: 573, height: 353 },
    period: "6-day programme · Sep 2026",
    description:
      "A complete AI enablement programme for a corporate client (name confidential), covering basic and advanced prompt engineering and AI in the tools each team uses every day.",
    highlightLabel: "Teams trained",
    highlightText: "MIS, Design, Accounts, Sales, Pre-sales and Administration.",
    tags: ["Prompt engineering", "Google Workspace", "Claude", "Microsoft 365"],
  },
  {
    name: "NIIT Ltd., Bhopal",
    logo: { url: "/images/niit-logo.png", alt: "NIIT", width: 798, height: 439 },
    period: "Technical Trainer · Jul 2010 – May 2013",
    description:
      "Ran .NET training for junior developers and interns, and built the curriculum and hands-on exercises for software engineering concepts.",
    tags: [".NET", "Curriculum design", "Hands-on labs"],
  },
];

export const trainingPath = (slug: string) => `/training/${slug}`;

export const categorySlug = (label: TrainingCategory) => trainingCategories.find((c) => c.label === label)!.slug;

/** The filtered hub, e.g. /training?category=technical. */
export const trainingCategoryPath = (label: TrainingCategory) => `/training?category=${categorySlug(label)}`;

export const getTraining = (slug: string) => trainings.find((t) => t.slug === slug);

/**
 * A training as a card (OfferingCard). `link` is the card's button; the
 * portfolio passes its "Enquire" CTA, /training passes none.
 */
export function trainingToOffering(t: Training, link?: Cta): Offering {
  return {
    _key: t.slug,
    title: t.title,
    category: t.category,
    tone: t.tone,
    thumbStyle: "banner",
    thumbTitle: t.coverTitle,
    thumbVariant: t.coverVariant,
    thumbTools: t.tags,
    meta: t.highlights,
    description: t.description,
    footLabel: "Ideal for",
    footText: t.idealFor.join(" • "),
    href: trainingPath(t.slug),
    link,
  };
}
