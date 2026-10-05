/**
 * Creates the two Portfolio profiles and the Portfolio settings singleton
 * from the approved POCs (Docs/design/poc/*.html). They replace the old
 * Resume singleton; the previous Resume and Experience documents are
 * backed up in Docs/backups/sanity-resume-experience-2026-10-04.json.
 *
 * Content rules agreed for this pass: no metrics (they'll be added later in
 * Studio), no career-break entry, no PDF, and nothing that isn't in the
 * resume, the portfolio copy or Niharika's own notes.
 *
 * One-time migration — after it runs, Sanity Studio is the place to edit.
 * Re-running with --write overwrites Studio edits to these three documents.
 *
 * Dry run (prints JSON):  npx tsx scripts/seed-portfolio.ts
 * Write to Sanity:        npx tsx scripts/seed-portfolio.ts --write
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createReadStream } from "node:fs";
import path from "node:path";
import { createClient } from "next-sanity";

const write = process.argv.includes("--write");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !dataset || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_TOKEN in .env.local");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

// Array-of-object items need a stable _key for Studio editing.
const keyed = <T extends object>(prefix: string, items: T[]) => items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

type Cta = { label: string; href: string; style?: "primary" | "secondary" | "link" };
const ctas = (prefix: string, items: Cta[]) => keyed(prefix, items);

const SOLUTIONS = "portfolio-ai-solutions-engineer";
const ENABLEMENT = "portfolio-ai-enablement-officer";
const SOLUTIONS_URL = "/portfolio/ai-solutions-engineer";
const ENABLEMENT_URL = "/portfolio/ai-enablement-officer";

// Uploaded once per run; Sanity de-duplicates identical files by hash.
async function image(file: string, alt: string) {
  if (!write) return { _type: "image", alt, asset: { _type: "reference", _ref: `(upload ${file})` } };
  const asset = await client.assets.upload("image", createReadStream(path.join("public/images", file)), { filename: file });
  return { _type: "image", alt, asset: { _type: "reference", _ref: asset._id } };
}

type SeedDoc = { _id: string; _type: string } & Record<string, unknown>;

async function build(): Promise<SeedDoc[]> {
  const logos = {
    bia: await image("bia-logo.png", "Boston Institute of Analytics"),
    bignalytics: await image("bignalytics-logo.png", "Bignalytics"),
    niit: await image("niit-logo.png", "NIIT"),
  };

  const enablement = {
    _id: ENABLEMENT,
    _type: "portfolioProfile",
    title: "AI Enablement Officer & Corporate Trainer",
    slug: { _type: "slug", current: "ai-enablement-officer" },
    order: 1,
    summary:
      "Hands-on AI training for engineers, business teams and students: prompt engineering, AI-assisted coding, agentic AI and AI in everyday office tools.",
    seoTitle: "AI Corporate Trainer & AI Enablement Officer — Niharika Dhande | PromptAtWork",

    heroImage: await image("corporate-trainer.png", "Niharika Dhande delivering a training session"),
    heroEyebrow: "AI Training • Enablement • Workshops",
    heroHeadline: "I help teams turn *AI tools* into *everyday results.*",
    heroLead:
      "Hands-on AI training for engineers, business teams and students. I find where AI fits in your work, build it with you, and make sure everyone in the room can use it on their own.",
    heroCtas: ctas("hc", [
      { label: "Book a workshop", href: "/contact", style: "primary" },
      { label: "Explore workshops", href: "/training" },
      { label: "See my engineering work", href: SOLUTIONS_URL },
    ]),
    heroChecks: ["Tech & non-tech tracks", "Hands-on, on your own work", "Claude • Gemini • ChatGPT", "Reusable prompt templates"],
    heroStripLabel: "Trained learners and teams at",
    heroLogos: keyed("hl", [logos.bia, logos.bignalytics, logos.niit]),
    profileRole:
      "Founder, Prompt at Work · AI Enablement Officer & Corporate Trainer. A software engineer who teaches, so every session is built on systems I have shipped.",
    profileTags: ["Prompt Engineering", "AI-Assisted Coding", "Agentic AI & MCP", "AI at Work"],
    profileCtas: ctas("pc", [
      { label: "Book a discovery call", href: "/contact", style: "primary" },
      { label: "Read my story", href: "/#about" },
    ]),

    // The page shows the workshops and institutes from src/lib/trainings.ts
    // (shared with /training); only these sections' headings are read here.
    offerings: {
      anchorId: "workshops",
      eyebrow: "Workshops & courses",
      title: "Pick the session that fits your team",
      intro:
        "Every session is hands-on: participants work on real tasks from their own job and leave with prompts, templates and a workflow they can keep using.",
      items: keyed("of", [
        {
          title: "Prompt Engineering for Business Teams",
          category: "Non-technical",
          tone: "green",
          thumbStyle: "banner",
          thumbVariant: 1,
          thumbTitle: "Prompt *engineering* for business teams",
          thumbTools: ["Claude", "Gemini", "ChatGPT"],
          meta: ["Prompt patterns", "Role-based libraries"],
          description:
            "Write prompts that give reliable results for everyday work: documents, emails, analysis and meeting notes. Comes with ready-to-use prompts organised by role.",
          footLabel: "Ideal for",
          footText: "Managers • Product Owners • Operations",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "Advanced Prompt Engineering for Engineers",
          category: "Technical",
          tone: "cyan",
          thumbStyle: "banner",
          thumbVariant: 2,
          thumbTitle: "Advanced prompt engineering *for engineers*",
          thumbTools: ["Claude API", "OpenAI", "2-day course"],
          meta: ["2-day course", "Chain-of-thought", "LLM APIs"],
          description:
            "Foundations, advanced prompt patterns and production integration with Claude, OpenAI and other LLM platforms, with real-world case studies and a reusable prompt library.",
          footLabel: "Ideal for",
          footText: "Developers • QA Engineers",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "AI-First Assisted Coding",
          category: "Technical",
          tone: "cyan",
          thumbStyle: "banner",
          thumbVariant: 3,
          thumbTitle: "AI-first *assisted coding*",
          thumbTools: ["Claude Code", "Copilot", "MCP"],
          meta: ["Claude Code", "Prompt patterns", "Agentic workflows"],
          description:
            "Use Claude Code, GitHub Copilot and V0.dev as everyday coding partners: prompt patterns for code, agentic workflows and connecting tools through MCP servers.",
          footLabel: "Ideal for",
          footText: "Developers • QA • Tech leads",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "Full-Stack Web Development with AI",
          category: "Technical",
          tone: "cyan",
          thumbStyle: "banner",
          thumbVariant: 4,
          thumbTitle: "Full-stack development *with AI*",
          thumbTools: ["React", "Python", "REST APIs"],
          meta: ["Requirements → deploy", "AI pair-programming"],
          description:
            "Build and ship a working web application end to end with AI assistants, from requirements and design through code, tests and deployment.",
          footLabel: "Ideal for",
          footText: "Developers • Engineering students",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "Fundamentals Workshop for AI Builders",
          category: "Tech + non-tech",
          tone: "violet",
          thumbStyle: "banner",
          thumbVariant: 5,
          thumbTitle: "AI builder *fundamentals*",
          thumbTools: ["LLMs", "RAG", "APIs"],
          meta: ["LLMs", "Embeddings & RAG", "Tool use"],
          description:
            "The building blocks behind every AI product: models, prompts, embeddings, retrieval, APIs and tools, explained through building a first working AI app.",
          footLabel: "Ideal for",
          footText: "Students • Professionals • Product teams",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "Agentic AI, LLM Frameworks & MCP",
          category: "Technical",
          tone: "cyan",
          thumbStyle: "banner",
          thumbVariant: 6,
          thumbTitle: "Agentic AI *& MCP*",
          thumbTools: ["LangChain", "LangGraph", "CrewAI", "AutoGen"],
          meta: ["Chains", "AI agents", "Model Context Protocol"],
          description:
            "Build chains, AI agents and agentic workflows with LangChain, LangGraph, CrewAI and AutoGen, and connect them to real systems through the Model Context Protocol.",
          footLabel: "Ideal for",
          footText: "Developers • Data & AI students",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "AI Concepts, Clearly Explained",
          category: "Tech + non-tech",
          tone: "violet",
          thumbStyle: "banner",
          thumbVariant: 7,
          thumbTitle: "AI concepts, *clearly explained*",
          thumbTools: ["No code", "How LLMs work"],
          meta: ["Conceptual class", "No coding needed"],
          description:
            "How generative AI actually works, what it is good and bad at, and how to judge its output, taught so that technical and non-technical learners leave with the same mental model.",
          footLabel: "Ideal for",
          footText: "Leaders • Mixed teams • Students",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "AI at Work: Claude, Google Workspace & Microsoft 365",
          category: "Non-technical",
          tone: "green",
          thumbStyle: "banner",
          thumbVariant: 8,
          thumbTitle: "AI in your *office tools*",
          thumbTools: ["Claude", "Google Workspace", "Microsoft 365"],
          meta: ["claude.ai", "Gemini in Docs, Sheets, Gmail, Meet", "Microsoft 365"],
          description:
            "Use Claude, Gemini for Google Workspace and Microsoft 365 for daily work, department by department, with clear usage guidelines and data handling practices so adoption stays secure.",
          footLabel: "Ideal for",
          footText: "MIS • Accounts • Sales • Admin • Design",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
        {
          title: "AI-Enabled SDLC",
          category: "Technical",
          tone: "cyan",
          thumbStyle: "banner",
          thumbVariant: 9,
          thumbTitle: "AI-enabled *SDLC*",
          thumbTools: ["Requirements", "Testing", "Templates"],
          meta: ["Every delivery phase", "Setup guides", "Document templates"],
          description:
            "Use AI across every phase of software delivery, from requirements gathering to maintenance, with setup guides for Claude.ai, GitHub Copilot and VS Code and reusable document templates.",
          footLabel: "Ideal for",
          footText: "Dev teams • QA • Project managers",
          link: { label: "Enquire", href: "/contact", style: "primary" },
        },
      ]),
    },

    audience: {
      eyebrow: "Who it's for",
      title: "One trainer for the whole room",
      intro:
        "Most AI training is either too technical for business users or too shallow for engineers. I teach both, often in the same session.",
      panels: keyed("ap", [
        {
          eyebrow: "Technical teams",
          title: "Engineers, QA & tech students",
          intro: "Go from using AI in a chat window to building with it in code.",
          points: [
            "AI-assisted coding with Claude Code and Copilot",
            "LLM APIs, tool use, RAG pipelines and AI agents",
            "Agentic workflows and MCP server integrations",
            "AI across the full SDLC, with templates",
          ],
        },
        {
          eyebrow: "Business teams",
          title: "Managers, operations & professionals",
          intro: "Get dependable results from AI tools in the work you already do.",
          points: [
            "Prompt patterns that work in Claude, Gemini and ChatGPT",
            "Role-based prompt libraries ready to reuse",
            "AI inside Google Workspace and Microsoft 365",
            "Usage guidelines and safe data handling",
          ],
        },
      ]),
    },

    process: {
      eyebrow: "How a corporate engagement works",
      title: "From your workflow to a trained team",
      intro: "Training starts with how your team works today, not with a fixed slide deck.",
      steps: keyed("ps", [
        { title: "Discover", description: "Workflow discovery session with team leads to find where AI will actually help." },
        { title: "Design", description: "Tailor the curriculum to your roles, your tools and your real tasks." },
        { title: "Deliver", description: "Live, hands-on sessions where people practise on their own work." },
        { title: "Equip", description: "Hand over prompt libraries, templates, guides and usage guidelines." },
        { title: "Iterate", description: "Review what the team is using, then refine the material and next session." },
      ]),
      loopNote: "Feedback from step 05 loops back into step 02 for the next batch.",
    },

    institutes: {
      eyebrow: "Training engagements",
      title: "Institutes I've trained for",
      intro: "From .NET classrooms to agentic AI cohorts, teaching has run alongside my engineering work since 2010.",
      items: keyed("in", [
        {
          name: "Boston Institute of Analytics",
          logo: logos.bia,
          period: "Prompt at Work · Oct 2026 – Present",
          description: "Training on LLM application frameworks: chains, AI agents, agentic workflows and the Model Context Protocol.",
          tags: ["LangChain", "LangGraph", "CrewAI", "AutoGen", "MCP"],
        },
        {
          name: "Bignalytics",
          logo: logos.bignalytics,
          period: "6-day programme · Sep 2026",
          description:
            "A complete AI enablement programme for a corporate client (name confidential), covering basic and advanced prompt engineering and AI in the tools each team uses every day.",
          highlightLabel: "Teams trained",
          highlightText: "MIS, Design, Accounts, Sales, Pre-sales and Administration.",
          tags: ["Prompt engineering", "Google Workspace", "Claude", "Microsoft 365"],
        },
        {
          name: "NIIT Ltd., Bhopal",
          logo: logos.niit,
          period: "Technical Trainer · Jul 2010 – May 2013",
          description:
            "Ran .NET training for junior developers and interns, and built the curriculum and hands-on exercises for software engineering concepts.",
          tags: [".NET", "Curriculum design", "Hands-on labs"],
        },
      ]),
    },

    experience: {
      eyebrow: "Experience",
      title: "From technical trainer to AI enablement",
      roles: keyed("ro", [
        {
          role: "Founder",
          company: "Prompt at Work · Indore",
          period: "Oct 2026 – Present",
          major: true,
          highlights: [
            "Founded an AI enablement and training firm delivering AI solutions and training programmes for companies and institutes.",
            "Plan, deliver and iterate on AI training sessions and workshops for mixed groups of business users and technical staff, covering Claude, Claude Code and Google Gemini for Workspace.",
            "Deliver training for institutes including Boston Institute of Analytics on LangChain, LangGraph, CrewAI and AutoGen, covering AI agents, agentic workflows and MCP.",
            "Run the Prompt at Work knowledge base and learning platform for prompt engineers across the website, YouTube and LinkedIn.",
          ],
        },
        {
          role: "AI Solutions Engineer",
          company: "Gate6 Technologies Pvt. Ltd. · Indore",
          period: "Feb 2024 – Sep 2026",
          major: true,
          highlights: [
            "Partnered with client and internal stakeholders to identify workflow pain points, assess where AI fits and translate business requirements into working AI solutions.",
            "Designed production prompt systems, system prompts and reusable prompt templates for client projects.",
            "Coached developers on AI-assisted development: advanced Claude Code usage, prompt patterns, agentic workflows and MCP server integrations, alongside GitHub Copilot, V0.dev and Blackbox.",
            "Documented AI solutions for end users and engineers, covering setup guides, usage guidelines and technical handover, with data handling and acceptable-use practices built in.",
          ],
        },
        {
          role: "Co-founder & Consultant",
          company: "Dhande Creatives · Indore",
          period: "Jan 2020 – Dec 2023",
          highlights: ["Technical consultant to clients, running requirement discovery and managing projects end to end."],
        },
      ]),
    },

    whyMe: {
      eyebrow: "Why learn with me",
      title: "I build what I teach",
      intro: "Every workshop draws on AI systems I have designed and shipped, not just tools I have read about.",
      items: keyed("wm", [
        { icon: "code", title: "Engineer first", description: "Software engineer since 2013, building RAG pipelines, chatbots and API integrations in production." },
        { icon: "graduation", title: "Trainer since 2010", description: "Started as a technical trainer at NIIT and has designed curriculum ever since, for companies and institutes." },
        {
          icon: "document",
          title: "Material you keep",
          description: "Role-based prompt libraries for Managers, Developers, Product Owners and QA Engineers, plus templates and guides.",
        },
        { icon: "shield", title: "Responsible by default", description: "Approved tools, usage guidelines and data handling built into every rollout. Certified ScrumMaster." },
      ]),
    },

    ctaBand: {
      title: "Let's make AI work for your team.",
      text: "Whether you need a workshop, a prompt library or a full training programme, tell me what your team is trying to do and I'll show you where AI fits.",
      ctas: ctas("cb", [
        { label: "Get in touch", href: "/contact", style: "primary" },
        { label: "Engineering profile", href: SOLUTIONS_URL },
      ]),
    },

    faq: {
      title: "Frequently asked questions",
      items: keyed("fq", [
        {
          question: "Do participants need coding skills?",
          answer: "Not for the non-technical tracks. Prompt engineering for business teams, AI at work and AI concepts need no code at all.",
        },
        {
          question: "Can you tailor a workshop to our tools?",
          answer: "Yes. Every engagement starts with a discovery session, and the exercises use your team's real tasks on the AI platform you have approved.",
        },
        {
          question: "What do participants keep afterwards?",
          answer: "Prompt templates, role-based prompt libraries, setup guides and usage guidelines they can reuse in their day-to-day work.",
        },
        {
          question: "Can you train several departments at once?",
          answer: "Yes. A recent 6-day programme trained MIS, Design, Accounts, Sales, Pre-sales and Administration teams in one programme.",
        },
        {
          question: "Do you train students as well as companies?",
          answer: "Yes. I run sessions for institutes such as Boston Institute of Analytics as well as for corporate teams.",
        },
      ]),
    },
  };

  const solutions = {
    _id: SOLUTIONS,
    _type: "portfolioProfile",
    title: "AI Solutions Engineer",
    slug: { _type: "slug", current: "ai-solutions-engineer" },
    order: 0,
    summary:
      "AI solutions that plug into the systems you already use: RAG assistants, chatbots, agents, MCP and API integrations, from proof of concept to production.",
    seoTitle: "AI Solutions Engineer — Niharika Dhande, RAG, Agents & AI Integrations | PromptAtWork",

    heroImage: await image("headshot.png", "Niharika Dhande"),
    heroEyebrow: "AI Solutions • Integrations • Developer Enablement",
    heroHeadline: "I build *AI solutions* that plug into the *systems you already use.*",
    heroLead:
      "I turn business requirements into working AI: RAG assistants grounded in your documents, chatbots, agents, and integrations with your internal systems through REST APIs and MCP. Built in Python and JavaScript, from proof of concept to production.",
    heroCtas: ctas("hc", [
      { label: "Discuss a project", href: "/contact", style: "primary" },
      { label: "See projects", href: "#projects" },
      { label: "Training profile", href: ENABLEMENT_URL },
    ]),
    heroChecks: ["Requirement → working PoC, fast", "Secure by design (OAuth 2.0)", "Documented hand-over", "Developers coached to own it"],
    heroStripLabel: "Platforms I build on",
    heroChips: ["Claude / Anthropic API", "Gemini", "OpenAI", "Groq", "FastAPI", "LangChain", "LangGraph", "FAISS", "MCP"],
    profileRole:
      "AI Solutions Engineer · Founder, Prompt at Work. A software engineer since 2013 who now builds and integrates AI for business and engineering teams.",
    profileTags: ["RAG & Retrieval", "AI Agents & MCP", "API Integration", "Claude Code"],
    profileCtas: ctas("pc", [
      { label: "Book a discovery call", href: "/contact", style: "primary" },
      { label: "View experience", href: "#experience" },
    ]),

    offerings: {
      anchorId: "solutions",
      eyebrow: "What I build",
      title: "AI solutions, end to end",
      intro:
        "Each one starts with a workflow discovery session and ends with something your team runs every day, connected to the tools and data you already have.",
      items: keyed("of", [
        {
          title: "RAG Assistants & Knowledge Search",
          category: "Build",
          tone: "cyan",
          thumbStyle: "terminal",
          snippet: "# grounded answers\ndocs → embed → FAISS\nquery → retrieve → LLM\n       → answer + sources",
          meta: ["RAG", "Embeddings", "Semantic search"],
          description:
            "Assistants that answer from your company's own knowledge: meeting transcripts, uploaded files and Google Drive documents across PDF, DOCX, XLSX and PPTX.",
          footLabel: "Stack",
          footText: "Python • FastAPI • FAISS • Groq",
        },
        {
          title: "AI Chatbots & Document Generation",
          category: "Build",
          tone: "cyan",
          thumbStyle: "terminal",
          snippet: '# multi-turn generation\nuser: "draft the test cases"\nbot → context + history\n    → document / unit tests',
          meta: ["Multi-turn", "System prompts"],
          description:
            "Chatbots that draft management documents and unit test cases through guided multi-turn conversations, built into the stack your team already uses.",
          footLabel: "Stack",
          footText: "C# MVC • OpenAI • Gemini",
        },
        {
          title: "AI Agents & MCP Integrations",
          category: "Integrate",
          tone: "green",
          thumbStyle: "terminal",
          snippet: "# agent with tools\nLLM ⇄ MCP server\n    ⇄ REST API\n    ⇄ internal system",
          meta: ["Tool use", "Agentic workflows", "MCP"],
          description:
            "Agents that can act, not just answer: tool use, agentic workflows and Model Context Protocol servers that give AI safe access to your systems.",
          footLabel: "Stack",
          footText: "Claude • Anthropic API • MCP",
        },
        {
          title: "API & Internal-System Integration",
          category: "Integrate",
          tone: "green",
          thumbStyle: "terminal",
          snippet: "# secure sync\nOAuth 2.0 → Google Drive API\n  → parse → re-index\n  # runs automatically",
          meta: ["REST APIs", "OAuth 2.0", "Automation scripts"],
          description:
            "Connect Claude, Gemini, OpenAI and Groq to internal tools and data through REST APIs, with secure authentication and automated document synchronisation.",
          footLabel: "Stack",
          footText: "REST • Google Drive API • OAuth 2.0",
        },
        {
          title: "Prompt Systems & Workflow Automation",
          category: "Build",
          tone: "cyan",
          thumbStyle: "terminal",
          snippet: "# prompt system\nsystem prompt + template\n  → LLM → evaluate\n  → ship ↺ iterate",
          meta: ["System prompts", "Templates", "Testing & evaluation"],
          description:
            "Production prompt systems and reusable templates that automate client business tasks, with testing, evaluation and quality checks built into every workflow.",
          footLabel: "Stack",
          footText: "OpenAI • Gemini • Claude",
        },
        {
          title: "Developer Enablement",
          category: "Enable",
          tone: "violet",
          thumbStyle: "terminal",
          snippet: "# AI-assisted dev\n$ claude\n> plan → code → test\n> MCP tools • prompt patterns",
          meta: ["Claude Code", "GitHub Copilot", "V0.dev"],
          description:
            "Coaching engineering teams on AI-assisted development: advanced Claude Code use, prompt patterns, agentic workflows and MCP server integrations.",
          footLabel: "For",
          footText: "Developers • QA engineers",
          link: { label: "See workshops →", href: `${ENABLEMENT_URL}#workshops`, style: "link" },
        },
      ]),
    },

    featuredProject: {
      eyebrow: "Featured · RAG",
      title: "RAG-Based Intelligent Meeting Assistant",
      description:
        "A production RAG pipeline that answers questions from Fireflies meeting transcripts and company documents. Files in Google Drive sync automatically, so answers stay grounded in the latest version.",
      tags: ["Python", "FastAPI", "Groq API", "FAISS", "sentence-transformers", "Google OAuth"],
      link: { label: "Read the case study in AI Lab →", href: "/ai-lab/work/rag-meeting-intelligence-platform", style: "secondary" },
      diagramRows: keyed("dr", [
        {
          nodes: keyed("n", [
            { title: "Fireflies", detail: "meeting transcripts", tone: "source" },
            { title: "Google Drive", detail: "OAuth sync", tone: "source" },
            { title: "Uploads", detail: "PDF·DOCX·XLSX·PPTX", tone: "source" },
          ]),
        },
        { nodes: keyed("n", [{ title: "Document processing", detail: "parse → chunk", tone: "plain" }]) },
        {
          nodes: keyed("n", [
            { title: "Embed", detail: "sentence-transformers", tone: "core" },
            { title: "Index", detail: "FAISS vector DB", tone: "core" },
            { title: "Retrieve", detail: "semantic search", tone: "core" },
          ]),
        },
        {
          nodes: keyed("n", [
            { title: "FastAPI", detail: "backend", tone: "plain" },
            { title: "Groq API", detail: "LLM", tone: "core" },
            { title: "Answer", detail: "meeting insights", tone: "output" },
          ]),
        },
      ]),
      diagramCaption:
        "How a question becomes a grounded answer: sources are processed and indexed once, then each query retrieves the relevant chunks before the LLM responds.",
    },

    projects: {
      eyebrow: "Selected projects",
      title: "Shipped, not just prototyped",
      intro: "Full write-ups with architecture and learnings live in the AI Lab. Here is the short version.",
      items: keyed("pr", [
        {
          kind: "Automation",
          title: "AI Workflow Automation System",
          description: "Prompt systems on OpenAI and Gemini APIs that automate client business tasks, with testing, evaluation and quality assurance for every workflow.",
          tags: ["OpenAI", "Gemini", "Evaluation"],
          link: { label: "Case study in AI Lab →", href: "/ai-lab/work/ai-workflow-automation-platform", style: "link" },
        },
        {
          kind: "Chatbot",
          title: "AI Document & Test-Case Generator",
          description: "A C# MVC chatbot using OpenAI and Gemini that drafts management documents and unit test cases through multi-turn conversations.",
          tags: ["C# MVC", "OpenAI", "Gemini"],
        },
        {
          kind: "Internal tool",
          title: "Internal Operations Chrome Extension",
          description: "A Chrome extension for internal operations with OAuth 2.0 authentication, built for a VPN-secured environment and its security requirements.",
          tags: ["Chrome Extension", "OAuth 2.0", "VPN"],
        },
        {
          kind: "Healthcare",
          title: "Hospital Management System",
          description: "Microservices REST APIs for patient records, appointments and billing, with Angular dashboards for real-time data visualisation and reporting.",
          tags: ["Microservices", "REST", "Angular"],
        },
        {
          kind: "Pharma · regulated",
          title: "Pharmaceutical Management System",
          description:
            "Scalable microservices for inventory, order processing and compliance tracking in a regulated industry, with Angular components for real-time stock and sales monitoring.",
          tags: ["Microservices", "Compliance", "Angular"],
        },
      ]),
      closingCard: {
        kind: "More in AI Lab",
        title: "Case studies, experiments & tools",
        description: "Architecture diagrams, decisions and lessons from each build.",
        link: { label: "Open AI Lab →", href: "/ai-lab/work", style: "secondary" },
      },
    },

    audience: {
      eyebrow: "Who I work with",
      title: "The bridge between the business and the code",
      intro: "I sit between technology, product and people: I can scope the problem with a department head and write the integration with the engineers.",
      panels: keyed("ap", [
        {
          eyebrow: "Business & product stakeholders",
          title: "Department heads & product owners",
          intro: "You know the workflow pain. I find where AI actually helps.",
          points: [
            "Workflow discovery sessions and AI use-case assessment",
            "Proof-of-concept pilots before any big commitment",
            "Solutions on Claude Enterprise or Gemini for Workspace",
            "Approved tools, usage guidelines and data handling",
          ],
        },
        {
          eyebrow: "Engineering teams",
          title: "Developers, QA & tech leads",
          intro: "You own the systems. I help AI fit into them cleanly.",
          points: [
            "LLM API integration: system prompts, tool use, multi-turn",
            "RAG pipelines, vector search and embeddings",
            "MCP servers and agentic workflows",
            "Claude Code coaching and technical handover",
          ],
        },
      ]),
    },

    process: {
      eyebrow: "How I build",
      title: "From requirement to running solution",
      intro: "Short cycles, a working proof of concept early, and documentation that lets your team own the result.",
      steps: keyed("ps", [
        { title: "Discover", description: "Workflow discovery with stakeholders to find the pain points worth solving." },
        { title: "Assess", description: "Check whether AI fits, pick the platform and plan the integration." },
        { title: "Prototype", description: "Build a working proof of concept on real data in a short cycle." },
        { title: "Integrate", description: "Connect it to internal systems through APIs, OAuth and MCP." },
        { title: "Hand over", description: "Setup guides, usage guidelines and coaching so the team owns it." },
      ]),
      loopNote: "Feedback from the prototype loops back into the assessment before anything is scaled.",
    },

    stack: {
      eyebrow: "Tools & platforms",
      title: "The stack behind the work",
      featured: {
        eyebrow: "Agentic AI",
        title: "Agentic AI & LLM frameworks",
        intro:
          "Chains, agents and multi-agent workflows, connected to real systems through the Model Context Protocol. The same frameworks I teach in institute cohorts.",
        items: keyed("fi", [
          { name: "LangChain", detail: "Chains, tools & retrieval" },
          { name: "LangGraph", detail: "Stateful agent graphs" },
          { name: "CrewAI", detail: "Role-based multi-agent teams" },
          { name: "AutoGen", detail: "Conversational multi-agent systems" },
          { name: "Model Context Protocol", detail: "MCP servers & integrations" },
          { name: "Anthropic API", detail: "Tool use & multi-turn" },
        ]),
        tags: ["Chains", "AI agents", "Agentic workflows", "Tool use / function calling", "Multi-turn conversations", "MCP servers"],
      },
      groups: keyed("sg", [
        { title: "AI platforms", items: ["Claude (claude.ai)", "Claude Enterprise", "Claude Code", "Anthropic API", "Gemini API", "OpenAI API", "Groq API"] },
        {
          title: "AI engineering",
          items: ["RAG pipelines", "FAISS vector DB", "Embeddings (sentence-transformers)", "Semantic search", "Document processing", "Chatbot development", "FastAPI"],
        },
        {
          title: "Prompt engineering & reusable AI",
          items: ["System prompts", "Custom instructions", "AI skills", "Prompt templates", "Role-based prompt libraries", "Chain-of-thought", "Prompt testing & evaluation"],
        },
        { title: "Workplace AI", items: ["Gemini for Google Workspace", "Docs • Sheets • Gmail • Meet", "Microsoft 365", "Usage guidelines", "Data handling"] },
        {
          title: "Development",
          items: ["Python", "JavaScript", "TypeScript", "C#", "ASP.NET Core", "Angular", "React", "REST APIs", "Microservices", "SQL Server"],
        },
        { title: "AI-assisted development", items: ["Claude Code", "Cursor", "Google Antigravity", "GitHub Copilot", "V0.dev", "Tabnine", "Blackbox"] },
      ]),
    },

    experience: {
      eyebrow: "Experience",
      title: "From .NET engineer to AI solutions",
      roles: keyed("ro", [
        {
          role: "Founder",
          company: "Prompt at Work · Indore",
          period: "Oct 2026 – Present",
          major: true,
          highlights: [
            "Founded an AI enablement and training firm delivering AI solutions and training for companies and institutes.",
            "Run workflow discovery sessions with client companies and translate business requirements into AI-powered solutions.",
          ],
        },
        {
          role: "AI Solutions Engineer",
          company: "Gate6 Technologies Pvt. Ltd. · Indore",
          period: "Feb 2024 – Sep 2026",
          major: true,
          highlights: [
            "Partnered with client and internal stakeholders to assess AI fit and deliver proof-of-concept builds in short cycles.",
            "Integrated Claude, Gemini, OpenAI and Groq APIs into internal tooling and development workflows via REST, using system prompts, tool use and multi-turn conversations.",
            "Built a RAG pipeline and chatbot in Python (FastAPI) with the Groq API, grounded in Fireflies meeting data, uploads and Google Drive documents.",
            "Implemented FAISS with sentence-transformers embeddings for semantic search across PDF, DOCX, XLSX and PPTX files.",
            "Built a C# MVC chatbot with OpenAI and Gemini, and a secure Chrome extension with OAuth 2.0 for a VPN-secured environment.",
            "Coached developers on Claude Code, prompt patterns, agentic workflows and MCP server integrations.",
          ],
        },
        {
          role: "Co-founder & Consultant",
          company: "Dhande Creatives · Indore",
          period: "Jan 2020 – Dec 2023",
          highlights: ["Technical consultant to clients, running requirement discovery and delivering custom .NET and web solutions end to end."],
        },
      ]),
    },

    whyMe: {
      eyebrow: "Why work with me",
      title: "An engineer who also explains it",
      items: keyed("wm", [
        { icon: "code", title: "Production engineering", description: "A software engineering career since 2013: enterprise apps, microservices and now AI systems." },
        { icon: "target", title: "Business to code", description: "Discovery with stakeholders first, so what gets built solves the problem the team actually has." },
        { icon: "shield", title: "Secure & regulated", description: "OAuth 2.0, VPN-secured tooling, data handling standards, and systems built for healthcare and pharma." },
        { icon: "graduation", title: "Your team keeps it", description: "Docs for end users and engineers, plus coaching, so the solution doesn't depend on me." },
      ]),
    },

    ctaBand: {
      title: "Have a workflow AI should be handling?",
      text: "Tell me what your team is trying to do. I'll show you where AI fits and what a first proof of concept would look like.",
      ctas: ctas("cb", [
        { label: "Get in touch", href: "/contact", style: "primary" },
        { label: "Explore AI Lab", href: "/ai-lab" },
      ]),
    },

    faq: {
      title: "Frequently asked questions",
      items: keyed("fq", [
        {
          question: "Which AI platforms do you work with?",
          answer:
            "Claude and the Anthropic API, Google Gemini, OpenAI and Groq, plus AI coding environments such as Claude Code, Cursor and Google Antigravity. I build on whichever platform your organisation has approved, and I can integrate any other model or tool you already use in your environment.",
        },
        {
          question: "Can it connect to our internal systems?",
          answer: "Yes. Integrations run through REST APIs, the Google Drive API, OAuth 2.0 and MCP servers, so AI works with your data where it already lives.",
        },
        {
          question: "How do you handle security?",
          answer: "Secure authentication, data handling and acceptable-use practices are part of the design, including builds for VPN-secured environments.",
        },
        { question: "What do we get at hand-over?", answer: "Setup guides, usage guidelines and technical handover documentation for both end users and engineers." },
        {
          question: "Can you upskill our developers too?",
          answer: "Yes. I coach teams on Claude Code and AI-assisted development. See the training profile for workshops.",
          link: { label: "See workshops →", href: `${ENABLEMENT_URL}#workshops`, style: "link" },
        },
        {
          question: "How is an engagement priced?",
          answer: "Every engagement is scoped to your team's needs, so pricing depends on what we build together. Tell me about your project and I'll share a tailored proposal.",
          link: { label: "Contact me for pricing →", href: "/contact", style: "primary" },
        },
      ]),
    },
  };

  const settings = {
    _id: "portfolio-settings",
    _type: "portfolioSettings",
    landingEyebrow: "Portfolio",
    landingTitle: "Two ways I work with teams",
    landingIntro: "I build AI solutions for engineering teams, and I train people to use AI well. Pick the profile that matches what you need.",
    servicesEyebrow: "Prompt at Work",
    servicesTitle: "Services I offer",
    servicesIntro: "Enablement, solutions and training under one roof.",
    services: keyed("sv", [
      {
        title: "AI Solutions Engineer",
        description: "Chatbots, RAG pipelines, agents, automation and REST API integrations that connect AI to the systems your team already uses.",
        profile: { _type: "reference", _ref: SOLUTIONS },
        linkLabel: "Solutions profile →",
      },
      {
        title: "AI Enablement Officer",
        description: "Workflow discovery, reusable prompt libraries and AI skills, and documented usage guidelines so adoption stays secure and consistent.",
        profile: { _type: "reference", _ref: ENABLEMENT },
        linkLabel: "Enablement profile →",
      },
      {
        title: "Corporate Trainer",
        description: "Hands-on workshops for mixed audiences, so business users and technical staff both leave able to use AI on their own work.",
        profile: { _type: "reference", _ref: ENABLEMENT },
        anchor: "workshops",
        linkLabel: "See workshops →",
      },
    ]),
    earlierRoles: keyed("er", [
      { role: "Lead Software Engineer", company: "Cyber Infrastructure", period: "Dec 2017 – Jul 2018" },
      { role: "Lead Software Engineer", company: "Galaxy Weblinks", period: "Apr 2017 – Nov 2017" },
      { role: "Software Engineer", company: "Infobeans Technologies", period: "Aug 2015 – Nov 2016" },
      { role: "Software Engineer", company: "Gate6 Technologies", period: "Jan 2015 – Aug 2015" },
      { role: "Software Engineer", company: "Om Software", period: "2013 – 2014" },
      { role: "Technical Trainer", company: "NIIT Ltd.", period: "Jul 2010 – May 2013" },
    ]),
    credentials: [
      "Certified ScrumMaster (CSM) · Scrum Alliance",
      "GNIIT Diploma in Software Engineering · NIIT",
      "B.Sc. Biotechnology · Barkatullah University",
    ],
  };

  return [solutions, enablement, settings];
}

async function main() {
  const docs = await build();
  if (!write) {
    console.log(JSON.stringify(docs, null, 2));
    console.log("\nDry run only — re-run with --write to save these documents to Sanity.");
    return;
  }
  // Profiles first: the settings document references them.
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();
  console.log(`Wrote ${docs.map((d) => d._id).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
