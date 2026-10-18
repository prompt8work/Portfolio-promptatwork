import type { Cta, Offering, PortfolioImage } from "./portfolio";
import { staticCardImage, staticCardKey } from "./card-images/static";

// The one source for the workshops & courses and the institutes trained
// for. /training, /training/[slug] and the "Workshops & courses" and
// "Institutes I've trained for" sections of /portfolio/ai-enablement-officer
// all read from here, so a change made in this file shows up everywhere.
// Copy is verbatim from the portfolio page; don't add syllabus, duration,
// pricing or outcomes that haven't happened (Docs/design/content-guidelines.md).
// A detailed course (session format, programs, modules, timelines) is
// copied from its curriculum in "Docs/Training courses/".

export const trainingCategories = [
  { slug: "non-technical", label: "Non-technical" },
  { slug: "technical", label: "Technical" },
  { slug: "tech-non-tech", label: "Tech + non-tech" },
] as const;

export type TrainingCategory = (typeof trainingCategories)[number]["label"];

/** A titled group of module names, e.g. "Generative AI" or "Python Basics". */
export type ModuleGroup = { title: string; note?: string; modules: string[] };

/** One part of the weekly rhythm, e.g. a 2-hr class or the Saturday doubt session. */
export type SessionPart = { part: string; time: string; what: string };

/** One row of a program timeline: a week (or an hour, for a workshop). */
export type TimelineRow = { label: string; concept: string; practical: string };

export type Capstone = { title: string; description: string; resumeLine: string };

/** A run of timeline rows, e.g. one month, optionally ending in a capstone. */
export type TimelineBlock = { title?: string; rows: TimelineRow[]; capstone?: Capstone };

/** One way to take the course: a workshop, a crash course, a 3-month course… */
export type TrainingProgram = {
  name: string;
  mode: string;
  schedule: string;
  duration: string;
  sessions: string;
  projects: string;
  /** The timeline's subtitle line. */
  summary: string;
  /** Column headings for the timeline rows: label, concept, practical. */
  columns: [string, string, string];
  blocks: TimelineBlock[];
};

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
  // The detailed outline. Each part is optional; a training without
  // `modules` shows a "coming soon" note in its Modules section.
  sessionFormat?: { heading?: string; intro?: string; parts: SessionPart[]; outcome: string };
  programs?: TrainingProgram[];
  modules?: ModuleGroup[];
};

// Weekly rhythm for the multi-week programs (set by Niharika, 2026-10-19):
// two batches to choose from, Mon/Wed/Fri or Tue/Thu, 2-hr classes, plus a
// 1-hr doubt session every Saturday. Per week: MWF = 3 classes (6 hrs) + 1
// (1 hr) = 4 sessions, 7 hrs; TT = 2 classes (4 hrs) + 1 = 3 sessions, 5 hrs.
const weekColumns: TrainingProgram["columns"] = ["Week", "Concept & demo", "Practical"];
const batchSchedule = "Mon/Wed/Fri or Tue/Thu batch · 2-hr classes · Sat 1-hr doubt session";
/** Sessions and hours for `weeks` weeks of each batch, doubt sessions included. */
const batchSessions = (weeks: number) =>
  `MWF ${weeks * 4} sessions, ${weeks * 7} hrs · TT ${weeks * 3} sessions, ${weeks * 5} hrs`;

export const trainings: Training[] = [
  {
    // Source: Docs/Training courses/genai-python-curriculum-niharika-dhande.md
    slug: "generative-ai-and-python-basics",
    category: "Tech + non-tech",
    title: "Generative AI & Python Basics",
    coverTitle: "Generative AI *& Python basics*",
    coverVariant: 1,
    tone: "violet",
    tags: ["No-code AI", "Python", "Google Colab", "n8n", "Zapier"],
    highlights: ["Workshop to 6-month course", "2-hr classes + Sat doubt session", "Monthly capstones"],
    description:
      "A hands-on program in generative AI and Python. GenAI is taught with no-code tools. Python is taught as literacy, so learners can read, run and check the code AI writes for them.",
    idealFor: ["Engineering students", "College students", "Working professionals"],
    sessionFormat: {
      heading: "How each week runs",
      intro:
        "Pick a batch: classes on Mon/Wed/Fri or on Tue/Thu, 2 hours each. Every Saturday has a 1-hour doubt session for both batches.",
      parts: [
        { part: "Class", time: "2 hrs", what: "Concept and live demo with real examples, then learners build it themselves" },
        { part: "Saturday doubt session", time: "1 hr", what: "Questions on the week's classes and practicals" },
      ],
      outcome:
        "Each class ends with something the learner has built: a prompt set, a chatbot, a workflow, an agent or a working notebook.",
    },
    modules: [
      {
        title: "Generative AI",
        note: "No-code tools throughout",
        modules: [
          "GenAI Foundations & the LLM Landscape",
          "Prompt Engineering: Basics to Advanced Patterns",
          "AI Reliability, Safety & Evaluation",
          "AI Productivity & Meeting Intelligence",
          "Web Research with Citations",
          "Knowledge Management & RAG",
          "No-Code AI Chatbots",
          "AI for Content Creation",
          "Images, Video & Voice with AI",
          "Workflow Automation with n8n & Zapier",
          "AI Agents: Tools, Memory & MCP",
          "Building Agents Without Code",
          "Vibe Coding with No-Code IDEs",
          "Claude Skills, Artifacts & claude.md",
          "Prompt Management as a Practice",
          "AI System Design & Going Live",
        ],
      },
      {
        title: "Python Basics",
        note: "In Google Colab, with an AI assistant",
        modules: [
          "Data Types, Variables & Input/Output",
          "Operators",
          "Control Statements",
          "Loops",
          "Functions",
          "Lists",
          "Strings",
          "Sets, Tuples & Dictionaries",
          "File Handling",
          "Regular Expressions",
          "Functional Programming",
          "Object-Oriented Programming",
        ],
      },
    ],
    programs: [
      {
        name: "Workshop",
        mode: "Online / Offline",
        schedule: "1 day, 1 session",
        duration: "3 hours",
        sessions: "1 · 3 hrs",
        projects: "Hands-on build",
        summary: "1 day · 3 hours · Online / Offline",
        columns: ["Time", "Session", "Learners walk away with"],
        blocks: [
          {
            rows: [
              {
                label: "Hour 1",
                concept: "GenAI foundations: how LLMs work, the tool landscape, safe use (concept & demo)",
                practical: "A clear map of which AI tool to use when",
              },
              {
                label: "Hour 2",
                concept: "Prompt engineering: roles, context, examples, step-by-step reasoning (concept & demo)",
                practical: "A prompt framework they can reuse",
              },
              {
                label: "Hour 3",
                concept: "Practical: build a personal prompt library and a no-code chatbot on their own document",
                practical: "5 tested prompts + a working chatbot",
              },
            ],
          },
        ],
      },
      {
        name: "Winter Crash Course",
        mode: "Online / Offline",
        schedule: batchSchedule,
        duration: "10 weeks (about 2.5 months)",
        sessions: batchSessions(10),
        projects: "Mini project",
        summary: "10 weeks · Mon/Wed/Fri or Tue/Thu · 2-hr classes · Sat 1-hr doubt session · Online / Offline",
        columns: weekColumns,
        blocks: [
          {
            rows: [
              { label: "Week 1", concept: "GenAI foundations & the LLM landscape", practical: "Compare three AI tools on one real task" },
              { label: "Week 2", concept: "Prompt engineering: basics to advanced patterns", practical: "Build a personal prompt library" },
              { label: "Week 3", concept: "AI reliability, safety & web research with citations", practical: "Fact-check AI output; write a cited brief" },
              { label: "Week 4", concept: "Python I: data types, variables, I/O, operators", practical: "Set up Colab; run and edit an AI-written script" },
              { label: "Week 5", concept: "Python II: control statements, loops, functions", practical: "Batch-process prompts with a loop" },
              { label: "Week 6", concept: "Knowledge management, RAG & no-code chatbots", practical: "Chatbot that answers from your own documents" },
              { label: "Week 7", concept: "AI for content creation: images, video & voice", practical: "Poster, voice-over and short video" },
              { label: "Week 8", concept: "Workflow automation with n8n & Zapier", practical: "Form → AI summary → email workflow" },
              { label: "Week 9", concept: "AI agents: concepts, tools & no-code build", practical: "Build a first research or study agent" },
              { label: "Week 10", concept: "Vibe coding a simple app + project review", practical: "Mini project demo day" },
            ],
          },
        ],
      },
      {
        name: "3-Month Course",
        mode: "Online / Offline",
        schedule: batchSchedule,
        duration: "12 weeks",
        sessions: batchSessions(12),
        projects: "3 monthly capstones",
        summary: "12 weeks · Mon/Wed/Fri or Tue/Thu · 2-hr classes · Sat 1-hr doubt session · 3 capstones · Online / Offline",
        columns: weekColumns,
        blocks: [
          {
            title: "Month 1 · GenAI foundations & Python start",
            rows: [
              { label: "Week 1", concept: "GenAI foundations, LLM landscape & AI productivity tools", practical: "Set up a personal AI toolkit" },
              { label: "Week 2", concept: "Prompt engineering: anatomy to advanced patterns", practical: "Prompt library for study or work" },
              { label: "Week 3", concept: "AI reliability, safety, research & citations", practical: "Cited research report" },
              { label: "Week 4", concept: "Python: data types, variables, I/O, operators, control statements", practical: "Read and modify AI-written scripts in Colab" },
            ],
            capstone: {
              title: "Capstone 1 — AI Research & Productivity Assistant",
              description: "A tested prompt library plus a Colab script that researches a topic and writes a cited summary.",
              resumeLine: "Built an AI research assistant with a reusable prompt library and Python automation.",
            },
          },
          {
            title: "Month 2 · Python, knowledge & content",
            rows: [
              { label: "Week 5", concept: "Python: loops, functions, lists & strings", practical: "Reusable prompt function + batch run" },
              { label: "Week 6", concept: "Python: sets, tuples, dictionaries & file handling", practical: "Summarise a CSV or PDF with AI" },
              { label: "Week 7", concept: "Knowledge management, RAG & no-code chatbots", practical: "Deployed FAQ chatbot" },
              { label: "Week 8", concept: "AI for content creation: images, video & voice", practical: "Campaign kit: post, image, voice, video" },
            ],
            capstone: {
              title: "Capstone 2 — Document Q&A Chatbot",
              description: "A live chatbot that answers from a real college, shop or company document, with a launch poster and demo video.",
              resumeLine: "Deployed a RAG-based chatbot that answers questions from custom documents.",
            },
          },
          {
            title: "Month 3 · Automation, agents & final capstone",
            rows: [
              { label: "Week 9", concept: "Workflow automation with n8n & Zapier", practical: "Lead or feedback automation" },
              { label: "Week 10", concept: "AI agents: tools, memory & MCP", practical: "Agent design canvas" },
              { label: "Week 11", concept: "Building agents without code + vibe coding", practical: "Working agent or mini app" },
              { label: "Week 12", concept: "Prompt management & capstone review", practical: "Capstone build sprint" },
            ],
            capstone: {
              title: "Capstone 3 — AI Agent for a Real Workflow",
              description: "An agent plus automation that solves one real task end to end, presented on demo day.",
              resumeLine: "Built and demoed a no-code AI agent that automates a real business workflow.",
            },
          },
        ],
      },
      {
        name: "6-Month Course",
        mode: "Online",
        schedule: batchSchedule,
        duration: "24 weeks",
        sessions: batchSessions(24),
        projects: "6 monthly capstones",
        summary: "24 weeks · Mon/Wed/Fri or Tue/Thu · 2-hr classes · Sat 1-hr doubt session · 6 capstones · Online",
        columns: weekColumns,
        blocks: [
          {
            title: "Month 1 · GenAI foundations & prompting",
            rows: [
              { label: "Week 1", concept: "GenAI foundations & the LLM landscape", practical: "Compare AI tools on real tasks" },
              { label: "Week 2", concept: "AI productivity & meeting intelligence", practical: "Meeting-notes and email workflow" },
              { label: "Week 3", concept: "Prompt engineering: anatomy & core patterns", practical: "Prompt library, version 1" },
              { label: "Week 4", concept: "Advanced prompt patterns & prompt management", practical: "Tested, versioned prompt library" },
            ],
            capstone: {
              title: "Capstone 1 — Personal AI Productivity Kit",
              description: "A versioned prompt library plus a meeting-notes-to-action-items workflow.",
              resumeLine: "Designed a tested prompt library and AI productivity workflow.",
            },
          },
          {
            title: "Month 2 · Python basics I",
            rows: [
              { label: "Week 5", concept: "Data types, variables & input/output", practical: "Colab setup; first AI-written script" },
              { label: "Week 6", concept: "Operators & control statements", practical: "Trace and fix decision logic" },
              { label: "Week 7", concept: "Loops & functions", practical: "Batch-prompt notebook" },
              { label: "Week 8", concept: "Lists & strings", practical: "Clean text before sending it to AI" },
            ],
            capstone: {
              title: "Capstone 2 — AI Batch Summariser Notebook",
              description: "A Colab notebook that loops through many inputs, cleans the text and summarises each with AI.",
              resumeLine: "Built a Python notebook that batch-processes text with an LLM.",
            },
          },
          {
            title: "Month 3 · Python basics II & AI reliability",
            rows: [
              { label: "Week 9", concept: "Sets, tuples & dictionaries", practical: "Read JSON returned by AI tools" },
              { label: "Week 10", concept: "File handling & regular expressions", practical: "Extract data from files and AI output" },
              { label: "Week 11", concept: "Functional programming & OOP: reading the code", practical: "Explain an AI-written program line by line" },
              { label: "Week 12", concept: "AI reliability, safety & evaluation", practical: "Evaluation checklist for an AI answer" },
            ],
            capstone: {
              title: "Capstone 3 — Smart Document Extractor",
              description: "Reads CSV or PDF files, pulls out key fields with AI and regex, and checks the output for errors.",
              resumeLine: "Built an AI data-extraction tool with output validation in Python.",
            },
          },
          {
            title: "Month 4 · Knowledge, chatbots & content",
            rows: [
              { label: "Week 13", concept: "Web research with citations", practical: "Cited research report" },
              { label: "Week 14", concept: "Knowledge management & RAG", practical: "Document Q&A assistant" },
              { label: "Week 15", concept: "No-code AI chatbots", practical: "Deployed FAQ chatbot" },
              { label: "Week 16", concept: "Content creation: images, video & voice", practical: "Content campaign kit" },
            ],
            capstone: {
              title: "Capstone 4 — Knowledge Chatbot with Launch Kit",
              description: "A deployed chatbot on real documents, with a poster, voice-over and demo video to launch it.",
              resumeLine: "Deployed a RAG chatbot and produced its AI-generated launch content.",
            },
          },
          {
            title: "Month 5 · Automation & AI agents",
            rows: [
              { label: "Week 17", concept: "Workflow automation essentials", practical: "Map a real workflow end to end" },
              { label: "Week 18", concept: "Automating with n8n & Zapier", practical: "Working automation with AI steps" },
              { label: "Week 19", concept: "AI agents: tools, memory & MCP", practical: "Connect an agent to tools" },
              { label: "Week 20", concept: "Building agents without code & multi-agent systems", practical: "Personal assistant agent" },
            ],
            capstone: {
              title: "Capstone 5 — Business Automation Agent",
              description: "An n8n or Zapier workflow with an AI agent that handles a real process, such as leads, bookings or support.",
              resumeLine: "Automated a business process with an AI agent and n8n workflows.",
            },
          },
          {
            title: "Month 6 · Build, deploy & capstone",
            rows: [
              { label: "Week 21", concept: "Vibe coding with no-code IDEs", practical: "Mini web app" },
              { label: "Week 22", concept: "Claude skills, artifacts & claude.md", practical: "Reusable skill for a real task" },
              { label: "Week 23", concept: "AI system design & going live", practical: "Host the capstone online" },
              { label: "Week 24", concept: "Capstone review & portfolio", practical: "Capstone build sprint" },
            ],
            capstone: {
              title: "Capstone 6 — Live AI Application",
              description: "A hosted AI app solving a real problem, presented on demo day with a portfolio of all six capstones.",
              resumeLine: "Designed, built and deployed a live AI application end to end.",
            },
          },
        ],
      },
    ],
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
    image: staticCardImage(staticCardKey.training(t.slug)),
    link,
  };
}
