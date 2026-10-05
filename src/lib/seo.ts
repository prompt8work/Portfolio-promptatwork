import { getCanonicalUrl, siteUrl } from "./site";
import { personalInfo } from "../../data";

// Search positioning. Every phrase here is backed by a fact already on the
// site: Indore (data/personalInfo.ts, data/aboutMe.ts), the trainer role
// (hero roles, aboutMe workshops/mentoring, /training), and the engineering
// areas (Sanity "engineeringArea" documents, /ai-lab/engineering). Don't add a city, service or credential that
// isn't true — search engines and AI assistants repeat what this says.

// Generative AI tools Niharika builds with, trains on and consults on — so
// someone searching "<tool> trainer / expert in Indore" can find this site
// and get in touch. Sources: the portfolio profiles (scripts/seed-portfolio.ts), data/skills.ts,
// the Engineering areas in Sanity.
// GitHub Copilot, Cursor, Perplexity, Notion AI and NotebookLM were added
// on Niharika's own word (October 2026). Only list tools Niharika has
// actually used. Also rendered as the "AI tools" section on /training.
export const aiTools: { category: string; description: string; tools: string[] }[] = [
  {
    category: "AI chat assistants",
    description: "Everyday writing, analysis and problem-solving with the major AI assistants.",
    tools: ["ChatGPT", "Claude", "Google Gemini"],
  },
  {
    category: "AI coding tools",
    description:
      "Copilots and AI editors that work inside the tools developers already use — GitHub, the code editor and the terminal — to speed up coding, reviews and routine work.",
    tools: ["GitHub Copilot", "Cursor", "Claude Code"],
  },
  {
    category: "AI research & productivity",
    description: "Faster research, note-taking and knowledge work with AI built into search, notebooks and docs.",
    tools: ["Perplexity", "NotebookLM", "Notion AI"],
  },
  {
    category: "LLM platforms & frameworks",
    description: "Building AI features into products with model APIs and orchestration frameworks.",
    tools: ["OpenAI API", "Anthropic Claude API", "Gemini API", "Groq", "LangChain"],
  },
  {
    category: "AI automation & voice",
    description: "Connecting AI to everyday workflows and voice agents, so repetitive work runs on its own.",
    tools: ["n8n", "Zapier", "Workato", "Vapi"],
  },
  {
    category: "Generative image & video",
    description: "Creating and comparing images and video with generative media tools.",
    tools: ["Midjourney", "DALL·E", "Stable Diffusion", "Adobe Firefly", "Runway", "Sora", "Pika"],
  },
];

export const aiToolNames = aiTools.flatMap((group) => group.tools);

// Search phrases for the tools people most often hire help with.
const toolKeywords = [
  "ChatGPT",
  "Claude",
  "Claude Code",
  "GitHub Copilot",
  "Cursor",
  "Gemini",
  "Perplexity",
  "NotebookLM",
  "Notion AI",
  "n8n",
  "Zapier",
  "Midjourney",
].flatMap(
  (tool) => [`${tool} training`, `${tool} expert in Indore`],
);

export const siteKeywords = [
  "Niharika Dhande",
  "Niharika Saxena Dhande",
  "PromptAtWork",
  "prompt engineer in",
  "prompt engineering trainer",
  "generative AI trainer in",
  "generative AI training",
  "prompt engineering course",
  "prompt engineering training India",
  "AI trainer",
  "AI engineer",
  "full-stack AI engineer",
  "generative AI engineer",
  "LLM application developer",
  "RAG developer",
  "agentic AI",
  "AI automation",
  "AI-assisted software development",
  "AI workshops",
  "generative AI tools training",
  "AI productivity tools training",
  "AI tools consultant",
  "Generative AI consulting",
  "AI consulting",
  "AI Fluency training",
  "AI literacy training",
  "AI literacy workshops",
  "AI Corporate Training",
  ...toolKeywords,
];

export const personName = "Niharika Dhande";
export const personId = `${siteUrl}/#person`;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

const indoreAddress = {
  "@type": "PostalAddress",
  addressLocality: "Indore",
  addressRegion: "Madhya Pradesh",
  addressCountry: "IN",
};

const indore = {
  "@type": "City",
  name: "Indore",
  containedInPlace: { "@type": "State", name: "Madhya Pradesh", containedInPlace: { "@type": "Country", name: "India" } },
};

// Short reference used inside other schemas (Article author, Course
// instructor) so search engines tie every page back to the same person.
export const personRef = { "@type": "Person", "@id": personId, name: personName, url: getCanonicalUrl("/") };

// One linked @graph for the homepage: who Niharika is, what PromptAtWork
// offers and where, and the website itself.
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: personName,
      alternateName: ["Niharika Saxena Dhande", "Niharika"],
      jobTitle: personalInfo.title,
      description:
        "AI Enablement Officer, AI Solutions Engineer and corporate AI trainer based in Indore, India, and founder of Prompt at Work. Finds where AI fits in a team's workflow, builds the solution, and trains the people who will use it.",
      url: getCanonicalUrl("/"),
      image: getCanonicalUrl("/images/Hero_image.png"),
      email: `mailto:${personalInfo.email}`,
      address: indoreAddress,
      homeLocation: indore,
      knowsAbout: [
        "Prompt engineering",
        "Generative AI",
        "Large language models",
        "Retrieval-augmented generation (RAG)",
        "Agentic AI",
        "AI automation",
        "AI-assisted software development",
        "Full-stack development",
        ...aiToolNames,
      ],
      hasOccupation: [
        { "@type": "Occupation", name: "AI Enablement Officer", occupationLocation: indore },
        { "@type": "Occupation", name: "AI Solutions Engineer", occupationLocation: indore },
        { "@type": "Occupation", name: "Corporate AI Trainer", occupationLocation: indore },
        { "@type": "Occupation", name: "Prompt Engineer", occupationLocation: indore },
      ],
      worksFor: { "@id": organizationId },
      sameAs: [`https://${personalInfo.linkedin}`],
    },
    {
      "@type": "ProfessionalService",
      "@id": organizationId,
      name: "PromptAtWork",
      url: getCanonicalUrl("/"),
      description:
        "Prompt engineering and Generative AI training, workshops and AI engineering by Niharika Dhande, based in Indore, India.",
      image: getCanonicalUrl("/images/Hero_image.png"),
      founder: { "@id": personId },
      address: indoreAddress,
      areaServed: [indore, { "@type": "Country", name: "India" }],
      knowsAbout: ["Prompt engineering", "Generative AI", "RAG", "AI automation"],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Prompt engineering training" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Generative AI workshops" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI consulting" } },
        ...aiTools.map((group) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${group.category} — training & consulting`,
            description: `Hands-on training, setup and consulting for ${group.tools.join(", ")}.`,
          },
        })),
      ],
      sameAs: [`https://${personalInfo.linkedin}`],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "PromptAtWork",
      alternateName: "PromptAtWork — Niharika Dhande",
      url: getCanonicalUrl("/"),
      inLanguage: "en-IN",
      publisher: { "@id": personId },
    },
  ],
};
