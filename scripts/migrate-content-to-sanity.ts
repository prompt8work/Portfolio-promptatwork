/**
 * One-time move of every piece of site content that lived in code into
 * Sanity (2026-10-19): site settings, home page, page intros and SEO, the
 * Privacy policy, workshops, institutes and the cover letter.
 *
 * Data already in code modules (data/*, src/lib/trainings.ts, src/lib/seo.ts)
 * is imported from those modules, so it is copied verbatim. Copy that sat
 * inside page components is transcribed below, exactly as it rendered.
 *
 * Documents use fixed _ids. By default a document that already exists is
 * left alone (so edits made in Studio are never overwritten); --force
 * replaces it. Images (institute logos, workshop card images) are uploaded
 * once and reused.
 *
 *   npx tsx scripts/migrate-content-to-sanity.ts            # dry run
 *   npx tsx scripts/migrate-content-to-sanity.ts --write    # create missing docs
 *   npx tsx scripts/migrate-content-to-sanity.ts --write --force
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "next-sanity";
import { personalInfo, coverLetter as coverLetterData } from "../data";
import { aboutMe } from "../data/aboutMe";
import { hero } from "../data/homeContent";
import { aiTools, siteKeywords } from "../src/lib/seo";
import { institutes, trainings } from "../src/lib/trainings";
import { staticCardImage, staticCardKey } from "../src/lib/card-images/static";

const WRITE = process.argv.includes("--write");
const FORCE = process.argv.includes("--force");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type Doc = { _id: string; _type: string; [k: string]: unknown };

// Every object inside an array needs a stable _key in Sanity.
let keySeq = 0;
function withKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => (v && typeof v === "object" && !Array.isArray(v) ? { _key: `k${(keySeq++).toString(36)}`, ...withKeys(v) } : withKeys(v))) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withKeys(v)])) as T;
  }
  return value;
}

const uploaded = new Map<string, string>();
async function imageFromPublic(publicPath: string, alt?: string) {
  if (!WRITE) return { _type: "image", asset: { _type: "reference", _ref: `(upload ${publicPath})` }, ...(alt ? { alt } : {}) };
  let ref = uploaded.get(publicPath);
  if (!ref) {
    const file = readFileSync(path.join(process.cwd(), "public", publicPath));
    const asset = await client.assets.upload("image", file, { filename: path.basename(publicPath) });
    ref = asset._id;
    uploaded.set(publicPath, ref);
  }
  return { _type: "image", asset: { _type: "reference", _ref: ref }, ...(alt ? { alt } : {}) };
}

// ---------------------------------------------------------------- settings

// The 12 tools siteKeywords turns into "<tool> training" / "<tool> expert in Indore".
const toolKeywords = ["ChatGPT", "Claude", "Claude Code", "GitHub Copilot", "Cursor", "Gemini", "Perplexity", "NotebookLM", "Notion AI", "n8n", "Zapier", "Midjourney"];
const baseKeywords = siteKeywords.slice(0, siteKeywords.length - toolKeywords.length * 2);

const llmsTxt = `# PromptAtWork — Niharika Dhande

> Niharika Dhande (also Niharika Saxena Dhande) is an AI Enablement Officer, AI Solutions Engineer, prompt engineer and corporate AI trainer based in Indore, Madhya Pradesh, India. PromptAtWork (also written "Prompt at Work") is the portfolio and teaching site of Niharika Dhande: practical Generative AI, RAG and AI-powered applications, built, documented and taught in the open.

## About
- Location: Indore, Madhya Pradesh, India
- Roles: AI Enablement Officer, AI Solutions Engineer, Corporate AI Trainer, Prompt Engineer; founder of Prompt at Work
- Focus: prompt engineering, Generative AI, RAG and knowledge systems, agentic AI, AI automation, AI-assisted software development
- Training: cohort-based prompt engineering and Generative AI courses and workshops, taught online
- LinkedIn: {{linkedin}}
- GitHub: {{github}}

## Generative AI tools — training, setup and consulting
Niharika Dhande works hands-on with these tools and can be contacted for training, workshops, team adoption and consulting on them (in Indore or online): [Contact]({{url:/contact}})
{{tools}}

## Common questions
These answers restate what the linked pages show.

- **Who is a prompt engineering and AI trainer in Indore?** Niharika Dhande, founder of Prompt at Work, trains engineers, business teams and students in prompt engineering, AI-assisted coding, agentic AI and AI in everyday office tools. [Training]({{url:/training}})
- **Do participants need coding skills?** Not for the non-technical tracks: prompt engineering for business teams, AI at work and AI concepts need no code. [AI Enablement Officer & Corporate Trainer]({{url:/portfolio/ai-enablement-officer}})
- **Can one programme train several departments?** Yes. A recent 6-day programme trained MIS, Design, Accounts, Sales, Pre-sales and Administration teams together. [AI Enablement Officer & Corporate Trainer]({{url:/portfolio/ai-enablement-officer}})
- **Who teaches Claude and Claude Code?** Niharika Dhande coaches teams on Claude Code and AI-assisted development, and builds on Claude and the Anthropic API. [Claude Code research]({{url:/ai-lab/tools/claude-code}})
- **Who builds RAG assistants, chatbots and AI agents?** Niharika Dhande, as an AI Solutions Engineer: RAG assistants, chatbots, agents, MCP and API integrations, from proof of concept to production. [AI Solutions Engineer]({{url:/portfolio/ai-solutions-engineer}})
- **Where is a working prompt library?** The PromptAtWork Prompt Library has categorized, copyable prompts with example input and output. [Prompt Library]({{url:/ai-lab/prompts}})

## Key pages
- [Home]({{url:/}}): who Niharika is and what Niharika builds
- [Training]({{url:/training}}): prompt engineering and Generative AI courses and workshops
- [AI Lab]({{url:/ai-lab}}): projects, case studies, engineering, AI tool reviews, experiments, prompts and automations
- [Case studies]({{url:/ai-lab/work}}): RAG, agentic and full-stack AI projects, end to end
- [Prompt Library]({{url:/ai-lab/prompts}}): working prompts with example input and output
- [Blog]({{url:/blog}}): writing on prompt engineering and Generative AI
- [Portfolio: AI Solutions Engineer]({{url:/portfolio/ai-solutions-engineer}}): AI solutions, projects, stack and experience
- [Portfolio: AI Enablement Officer & Corporate Trainer]({{url:/portfolio/ai-enablement-officer}}): AI workshops, institutes trained and training approach
- [Contact]({{url:/contact}}): training, workshops, consulting and job enquiries
`;

const siteSettings: Doc = {
  _id: "site-settings",
  _type: "siteSettings",
  personName: "Niharika Dhande",
  personNameCaps: personalInfo.name,
  personAlternateNames: ["Niharika Saxena Dhande", "Niharika"],
  jobTitle: personalInfo.title,
  jobTitles: ["AI Solutions Engineer", "Prompt Engineer", "Corporate AI Trainer"],
  occupations: ["AI Enablement Officer", "AI Solutions Engineer", "Corporate AI Trainer", "Prompt Engineer"],
  email: personalInfo.email,
  linkedin: personalInfo.linkedin,
  github: personalInfo.github,
  location: personalInfo.location,
  address: { city: "Indore", region: "Madhya Pradesh", countryCode: "IN", countryName: "India" },
  brandName: "PromptAtWork",
  brandAlternateNames: ["Prompt at Work", "Prompt @ Work", "Prompt@Work"],
  footerBlurb: "A living portfolio of practical AI engineering — built, documented and taught in the open.",
  footerCopyright: "2026 Niharika Dhande · Prompt Engineer & Generative AI Trainer · Indore, India",
  defaultTitle: "Niharika Dhande — AI Enablement Officer, AI Solutions Engineer & Prompt Engineer, Indore | PromptAtWork",
  defaultDescription:
    "Niharika Dhande is an AI Enablement Officer, AI Solutions Engineer and corporate AI trainer based in Indore, India — AI enablement, RAG and AI integrations, and hands-on AI training.",
  keywords: baseKeywords,
  toolKeywords,
  personDescription:
    "AI Enablement Officer, AI Solutions Engineer and corporate AI trainer based in Indore, India, and founder of Prompt at Work. Finds where AI fits in a team's workflow, builds the solution, and trains the people who will use it.",
  personKnowsAbout: [
    "Prompt engineering",
    "Generative AI",
    "Large language models",
    "Retrieval-augmented generation (RAG)",
    "Agentic AI",
    "AI automation",
    "AI-assisted software development",
    "Full-stack development",
  ],
  organizationDescription:
    "Prompt engineering and Generative AI training, workshops and AI engineering by Niharika Dhande, based in Indore, India.",
  organizationKnowsAbout: ["Prompt engineering", "Generative AI", "RAG", "AI automation", "AI enablement", "Claude and Claude Code", "AI tools training"],
  services: ["Prompt engineering training", "Generative AI workshops", "AI consulting"],
  llmsTxt,
  aiTools,
};

// --------------------------------------------------------------- home page

const homePage: Doc = {
  _id: "home-page",
  _type: "homePage",
  seoTitle: "Niharika Dhande — AI Enablement Officer, AI Solutions Engineer & Prompt Engineer, Indore | PromptAtWork",
  seoDescription:
    "Niharika Dhande is an AI Enablement Officer, AI Solutions Engineer and prompt engineering trainer in Indore, India: AI enablement, RAG and generative AI solutions, and hands-on Claude, ChatGPT and AI tools training for teams. Founder of Prompt at Work.",
  heroTag: "PROMPT AT WORK",
  heroIdentity: hero.identity,
  heroDisplayLead: hero.display.lead,
  heroDisplayAccent: hero.display.accent,
  heroLead: `${hero.heading} ${hero.description}`,
  heroCtas: [
    { label: "Start Learning", href: "/training" },
    { label: "View Portfolio", href: "/portfolio" },
  ],
  heroPersonRole: "AI Enablement Officer · Founder",
  credentialValue: hero.credential.value,
  credentialLabel: hero.credential.label,
  heroChipTitle: "Agentic AI frameworks",
  heroChipMeta: "LANGGRAPH · CREWAI · MCP",
  heroCardTitle: "WhatsApp automation",
  heroCardMeta: "AGENTIC WORKFLOW · ANY BUSINESS SIZE",
  heroCardBadge: "WHAT WE BUILD",
  heroCardCustomer: "Hi, is my order shipped? Can I also book a demo for Friday?",
  heroCardReply: "Yes, it shipped today and arrives Thursday. Friday 11:00 is booked for your demo ✓",
  heroCardSteps: [
    { label: "Message received", note: "WhatsApp Business API" },
    { label: "Understand intent", note: "LLM router agent" },
    { label: "Act on your systems", note: "CRM · orders · calendar" },
    { label: "Reply on WhatsApp", note: "human handoff if needed" },
  ],
  heroCardFooter: "Leads · orders · bookings · support",
  aboutEyebrow: "MEET THE INSTRUCTOR",
  aboutHeading: aboutMe.heading,
  aboutParagraphs: aboutMe.paragraphs,
  aboutBadgeValue: "10+ yrs",
  aboutBadgeLabel: "ENGINEERING & TRAINING",
  aboutChips: ["CLAUDE", "GEMINI", "RAG"],
  aboutFacts: [
    { title: "AI Enablement Officer", sub: "Current role" },
    { title: "Founder, Prompt at Work", sub: "Enablement · solutions · training" },
    { title: "Indore, India", sub: "Based in" },
  ],
  aboutCtas: [
    { label: "Read Full Profile", href: "/portfolio" },
    { label: "Let's Connect", href: "/contact" },
  ],
  coursesHeading: { eyebrow: "COURSES", title: "Latest Frameworks" },
  aiLabHeading: { eyebrow: "AI LAB", title: "All my work lives in one place" },
  testimonialsHeading: { eyebrow: "TESTIMONIAL WALL", title: "What learners say" },
  contentHeading: { eyebrow: "CONTENT", title: "Latest Writing & Videos" },
  linkedinTitle: "Follow on LinkedIn",
  linkedinText: "New articles get shared there first — follow along, or check back here for the full write-up.",
};

// ------------------------------------------------------------------- pages

const page = (key: string, fields: Record<string, unknown>): Doc => ({ _id: `page-${key}`, _type: "page", key, ...fields });

const span = (text: string, marks: string[] = []) => ({ _type: "span", text, marks });
const para = (children: unknown[], markDefs: unknown[] = []) => ({ _type: "block", style: "normal", markDefs, children });
const h2 = (text: string) => ({ _type: "block", style: "h2", markDefs: [], children: [span(text)] });
const labelled = (label: string, rest: string) => para([span(label, ["strong"]), span(rest)]);

const privacyBody = [
  h2("What's collected, and why"),
  labelled("Contact form", " — your name, email, organization (optional), purpose of contact, and your message. Used only to respond to you."),
  labelled(
    "Training registration",
    " — your name, email, phone (optional), organization (optional), and experience level. Used only to manage your registration for that training batch.",
  ),
  labelled(
    "Blog comments",
    " — your name, email, and comment text. Held for review before it becomes visible to other visitors — nothing you submit here is shown publicly until approved.",
  ),
  labelled(
    "Blog reactions",
    " — no personal information at all. A reaction is tied to an anonymized identifier generated in your browser, used only to prevent the same visitor from reacting to the same post twice.",
  ),
  h2("Where it's stored"),
  para([
    span(
      "Everything above is stored in a Postgres database (Supabase), in the same region the site itself runs from. Submissions are never sold, shared with third parties, or used for anything beyond the specific purpose listed above.",
    ),
  ]),
  h2("What this site doesn't do"),
  para([
    span(
      "No third-party advertising trackers, no data brokers, no marketing email lists built from form submissions. If that changes, this page will be updated to say so — plainly, the same way it's written now.",
    ),
  ]),
  h2("Questions"),
  para(
    [span("Reach out through the "), span("contact form", ["lnk-contact"]), span(" or email "), span(personalInfo.email, ["lnk-email"]), span(".")],
    [
      { _key: "lnk-contact", _type: "link", href: "/contact" },
      { _key: "lnk-email", _type: "link", href: `mailto:${personalInfo.email}` },
    ],
  ),
];

const pages: Doc[] = [
  page("ai-lab", {
    seoTitle: "AI Lab — Generative & Agentic AI Projects by Niharika Dhande | PromptAtWork",
    seoDescription:
      "Generative AI and agentic AI work by Niharika Dhande: case studies, engineering capabilities and automations, each explained step by step with process diagrams — in one place.",
    eyebrow: "AI LAB · OVERVIEW",
    tagline: "Generative & agentic AI, built in the open",
    title: "Real projects, documented end to end.",
    intro:
      "Each project is written up as a case study and split into pages for its parts. Every page explains the process in text and diagrams and links to the rest of the same project.",
    blocks: [
      { key: "featured", eyebrow: "FEATURED · WORK & CASE STUDIES" },
      { key: "engineering", eyebrow: "ENGINEERING", title: "Capabilities, each backed by real project evidence" },
      { key: "index", eyebrow: "PROJECT INDEX", title: "Everything in the lab" },
    ],
  }),
  page("ai-lab-work", {
    seoTitle: "AI Engineering Case Studies — RAG, Agentic & Full-Stack AI by Niharika Dhande | PromptAtWork",
    seoDescription:
      "Full-Stack AI and agentic AI case studies: the problem, how it was solved, and the future scope, linked to every page that documents each project.",
    eyebrow: "AI Lab / Work",
    title: "Work & Case Studies",
    intro:
      "Every project in one scroll: what it is, the numbers that matter and the stack behind it. Open any case study for the full problem → solution → future scope write-up, linked to every page that documents the same project.",
  }),
  page("ai-lab-engineering", {
    seoTitle: "AI Engineering — RAG, Generative AI, Agentic AI & AI Automation | PromptAtWork",
    seoDescription: "Full-Stack AI Engineering, RAG & Retrieval, Generative AI, Agentic AI and AI Automation — each grounded in real, shipped work.",
    eyebrow: "AI Lab / Engineering",
    title: "Generative AI, Agentic AI & Full-Stack AI Development",
    intro: "A software engineering foundation applied to Generative AI. Each area below links to the real project or content behind it.",
  }),
  page("ai-lab-automations", {
    seoTitle: "AI Workflow Automations — End-to-End AI Automation Builds | PromptAtWork",
    seoDescription: "AI workflow automations by Niharika Dhande, laid out end to end: trigger → input → AI processing → decision → action → output.",
    eyebrow: "AI Lab / Automations",
    title: "Automations",
    intro: "Trigger → input → AI processing → decision → action → output, laid out end to end for each real workflow.",
  }),
  page("ai-lab-tools", {
    seoTitle: "AI Tools Research — Claude, Claude Code, Gemini, OpenAI & Groq Reviewed | PromptAtWork",
    seoDescription: "AI tools, features, concepts and platforms researched hands-on — reviews, practical use cases and learning resources.",
    eyebrow: "AI Lab / Tools & Research",
    title: "Tools & Research",
    intro:
      "Research, practical use cases, tutorials and learning resources for AI tools, features and concepts explored hands-on — not a generic feature comparison.",
  }),
  page("ai-lab-experiments", {
    seoTitle: "AI Experiments — Hands-On LLM & RAG Tests by Niharika Dhande | PromptAtWork",
    seoDescription: "Hands-on AI experiments by Niharika Dhande: the objective, setup, what worked, what failed and what was learned.",
    eyebrow: "AI Lab / Experiments",
    title: "Experiments",
    intro: "Objective → setup → what worked, what failed, what was learned — documented as I build, not written up after the fact.",
  }),
  page("ai-lab-prompts", {
    seoTitle: "Prompt Library — Working Prompts with Example Input & Output | PromptAtWork",
    seoDescription: "A working prompt library by prompt engineer Niharika Dhande: categorized, copyable prompts, each with example input and output.",
    eyebrow: "AI Lab / Prompt Library",
    title: "Prompt Library",
    intro: "Categorized, copyable prompts with example input and output — real templates behind real projects, not generic starter examples.",
  }),
  page("training", {
    seoTitle: "Prompt Engineering & Generative AI Training in Indore (Online) — PromptAtWork",
    seoDescription:
      "Cohort-based, hands-on prompt engineering and Generative AI training by Niharika Dhande, an AI trainer based in Indore, India. Courses, workshops and AI tools training (ChatGPT, Claude, GitHub Copilot, Cursor, Perplexity, NotebookLM) taught online.",
    seoKeywords: [
      "prompt engineering training in Indore",
      "generative AI trainer in Indore",
      "prompt engineering course online",
      "generative AI course India",
      "AI workshops Indore",
      "Niharika Dhande training",
      "AI tools training for teams",
      "ChatGPT and Claude training",
      "GitHub Copilot training",
      "Cursor AI training",
    ],
    eyebrow: "COURSES · OVERVIEW",
    tagline: "Workshops, cohort courses and institutes",
    title: "Courses & Workshops",
    intro:
      "Hands-on, cohort-based prompt engineering and Generative AI training by Niharika Dhande, an AI trainer based in Indore, India — taught online, using the same practices documented in the AI Lab.",
    ctas: [
      { label: "Browse the workshops", href: "#workshops" },
      { label: "Training for teams", href: "#teams" },
    ],
    blocks: [
      { key: "workshops", title: "Workshops & courses", text: "Pick a category to narrow the list, or open any training for its details." },
      { key: "courses", title: "Cohort courses" },
      { key: "institutes", title: "Institutes I've trained for", text: "From .NET classrooms to agentic AI cohorts, teaching has run alongside my engineering work since 2010." },
      {
        key: "ai-tools",
        title: "AI tools I train teams on",
        text: "Hands-on training, setup and consulting for individuals and teams, in Indore or online. If you want to get more done with any of these tools, get in touch.",
        ctas: [{ label: "Talk about training", href: "/contact" }],
      },
      {
        key: "teams",
        eyebrow: "FOR COMPANIES & INSTITUTES",
        title: "Bring AI to your whole team — not just the early adopters.",
        text: "Enablement, solutions and training under one roof: I learn how your teams work today, then turn that into working AI on Claude and Google Gemini.",
        items: [
          { title: "AI Enablement", text: "Reusable prompt libraries for each business function, built with the people who use them." },
          { title: "AI Solutions", text: "RAG assistants grounded in company documents and API integrations with internal systems." },
          { title: "AI Training", text: "Hands-on workshops for technical and business teams, and Claude Code coaching for developers." },
        ],
        ctas: [
          { label: "Book a Discovery Call", href: "/contact" },
          { label: "See Training Formats", href: "#workshops" },
        ],
      },
    ],
  }),
  page("videos", {
    seoTitle: "Videos — Prompt Engineering & AI Tools by Niharika Dhande | PromptAtWork",
    seoDescription: "Every video, synced from the PromptAtWork YouTube channel — watch right here, or follow the title through to YouTube.",
    eyebrow: "TV",
    title: "PromptAtWork TV",
    intro: "{count} from the YouTube channel. Play one right here, or open it on YouTube.",
    blocks: [{ key: "empty", text: "Synced from the PromptAtWork YouTube channel." }],
  }),
  page("blog", {
    seoTitle: "Blog — Prompt Engineering & Generative AI Writing by Niharika Dhande | PromptAtWork",
    seoDescription: "Niharika Dhande writes on prompt engineering, Generative AI, Full-Stack AI Engineering and AI-assisted development.",
    eyebrow: "CONTENT",
    title: "Blog",
    intro: "Writing on Full-Stack AI Engineering, prompt engineering and AI-assisted development — documented as it happens.",
  }),
  page("contact", {
    seoTitle: "Contact Niharika Dhande — AI Training & Prompt Engineering, Indore | PromptAtWork",
    seoDescription:
      "Get in touch with Niharika Dhande in Indore, India about prompt engineering and Generative AI training, workshops, AI consulting, job opportunities or collaboration.",
    eyebrow: "CONTACT",
    title: "Let's make AI work for your team.",
    intro:
      "Whether you need a workshop, a prompt library or a working AI solution, tell me what your team is trying to do and I'll show you where AI fits.",
    blocks: [{ key: "location", text: "Open to remote" }],
  }),
  page("testimonials", {
    seoTitle: "Testimonials — Niharika Dhande, AI Trainer & AI Solutions Engineer | PromptAtWork",
    seoDescription: "What it's been like working with Niharika Dhande — and a place to add your own.",
    eyebrow: "TESTIMONIALS",
    title: "What it's been like to work together",
    intro: "Real feedback from clients, colleagues and training participants — and a place to add your own.",
    blocks: [
      {
        key: "form",
        title: "Share your experience",
        text: "Worked together on a project, training or consulting engagement? A couple of sentences helps a lot.",
      },
    ],
  }),
  page("portfolio", {
    seoTitle: "Portfolio — Niharika Dhande, AI Solutions Engineer & AI Corporate Trainer | PromptAtWork",
    seoDescription:
      "Two profiles of Niharika Dhande: AI Solutions Engineer building RAG, agents and AI integrations, and AI Enablement Officer & Corporate Trainer running hands-on AI workshops.",
  }),
  page("privacy", {
    seoTitle: "Privacy Policy — PromptAtWork",
    seoDescription: "What PromptAtWork collects through its public forms, why, and how it's stored.",
    eyebrow: "PRIVACY",
    title: "Privacy Policy",
    intro:
      "This page describes, plainly, what PromptAtWork actually collects when you use one of its public forms, why, and where it's stored. It covers this website only.",
    body: privacyBody,
  }),
  page("not-found", {
    eyebrow: "404",
    title: "This page isn't here",
    intro: "The link may be old, or the content may have moved into the AI Lab.",
    ctas: [
      { label: "Browse the AI Lab", href: "/ai-lab" },
      { label: "Go home", href: "/" },
    ],
  }),
];

// ------------------------------------------------------------ cover letter

const coverLetter: Doc = {
  _id: "cover-letter",
  _type: "coverLetter",
  pageTitle: "Cover Letter — PromptAtWork",
  seoDescription: "Cover letter of Niharika Dhande, Full-Stack AI Engineer.",
  headerTitle: personalInfo.title,
  salutation: coverLetterData.recipient.salutation,
  opening: coverLetterData.opening.paragraph,
  sections: coverLetterData.body.map((b) => ({ heading: b.heading, content: b.content })),
  closing: coverLetterData.closing.paragraph,
  callToAction: coverLetterData.closing.callToAction,
  signOff: coverLetterData.signature.closing,
  signatureName: coverLetterData.signature.name,
  signatureTitle: coverLetterData.signature.title,
  attachments: coverLetterData.attachments,
};

// ---------------------------------------------- workshops and institutes

async function workshopDocs(): Promise<Doc[]> {
  const docs: Doc[] = [];
  for (const [i, t] of trainings.entries()) {
    const image = staticCardImage(staticCardKey.training(t.slug));
    docs.push({
      _id: `workshop-${t.slug}`,
      _type: "workshop",
      title: t.title,
      slug: { _type: "slug", current: t.slug },
      order: (i + 1) * 10,
      category: t.category,
      coverTitle: t.coverTitle,
      coverVariant: t.coverVariant,
      tone: t.tone,
      tags: t.tags,
      highlights: t.highlights,
      description: t.description,
      idealFor: t.idealFor,
      ...(image ? { cardImage: await imageFromPublic(image.replace(/^\//, "")) } : {}),
      ...(t.sessionFormat ? { sessionFormat: t.sessionFormat } : {}),
      ...(t.modules ? { modules: t.modules } : {}),
      ...(t.programs ? { programs: t.programs } : {}),
    });
  }
  return docs;
}

async function instituteDocs(): Promise<Doc[]> {
  const docs: Doc[] = [];
  for (const [i, it] of institutes.entries()) {
    docs.push({
      _id: `institute-${it.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
      _type: "institute",
      name: it.name,
      order: (i + 1) * 10,
      logo: await imageFromPublic(it.logo.url.replace(/^\//, ""), it.logo.alt),
      period: it.period,
      description: it.description,
      ...(it.highlightLabel ? { highlightLabel: it.highlightLabel } : {}),
      ...(it.highlightText ? { highlightText: it.highlightText } : {}),
      tags: it.tags,
    });
  }
  return docs;
}

// ------------------------------------------------------------------- write

async function main() {
  const docs = [siteSettings, homePage, ...pages, coverLetter, ...(await workshopDocs()), ...(await instituteDocs())].map(withKeys);
  const existing = new Set<string>(await client.fetch(`*[_id in $ids]._id`, { ids: docs.map((d) => d._id) }));

  let created = 0;
  let skipped = 0;
  for (const doc of docs) {
    const exists = existing.has(doc._id);
    if (exists && !FORCE) {
      console.log(`  = ${doc._id} (exists, left alone)`);
      skipped++;
      continue;
    }
    console.log(`  ${exists ? "↻" : "+"} ${doc._id}${WRITE ? "" : " (dry run)"}`);
    if (WRITE) await client.createOrReplace(doc);
    created++;
  }
  console.log(`\n${WRITE ? "Wrote" : "Would write"} ${created} document(s), left ${skipped} alone.${WRITE ? "" : " Run with --write to apply."}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
