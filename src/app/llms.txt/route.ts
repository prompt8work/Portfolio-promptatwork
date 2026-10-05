import { getCanonicalUrl } from "../../lib/site";
import { personalInfo } from "../../../data";
import { aiTools } from "../../lib/seo";

// /llms.txt (llmstxt.org): a plain-markdown summary for AI assistants and
// answer engines (ChatGPT, Perplexity, Claude, Gemini) so they can describe
// and cite this site accurately. Same facts as src/lib/seo.ts — nothing
// here should claim more than the site itself shows.
export const dynamic = "force-static";

export function GET() {
  const url = (path: string) => getCanonicalUrl(path);
  const toolLines = aiTools.map((group) => `- ${group.category}: ${group.tools.join(", ")}`).join("\n");
  const body = `# PromptAtWork — Niharika Dhande

> Niharika Dhande (also Niharika Saxena Dhande) is an AI Enablement Officer, AI Solutions Engineer and corporate AI trainer based in Indore, Madhya Pradesh, India. PromptAtWork is the portfolio and teaching site of Niharika Dhande: practical Generative AI, RAG and AI-powered applications, built, documented and taught in the open.

## About
- Location: Indore, Madhya Pradesh, India
- Roles: AI Enablement Officer, AI Solutions Engineer, Corporate AI Trainer, Prompt Engineer; founder of Prompt at Work
- Focus: prompt engineering, Generative AI, RAG and knowledge systems, agentic AI, AI automation, AI-assisted software development
- Training: cohort-based prompt engineering and Generative AI courses and workshops, taught online
- LinkedIn: https://${personalInfo.linkedin}

## Generative AI tools — training, setup and consulting
Niharika Dhande works hands-on with these tools and can be contacted for training, workshops, team adoption and consulting on them (in Indore or online): [Contact](${url("/contact")})
${toolLines}

## Key pages
- [Home](${url("/")}): who Niharika is and what Niharika builds
- [Training](${url("/training")}): prompt engineering and Generative AI courses and workshops
- [AI Lab](${url("/ai-lab")}): projects, case studies, engineering, AI tool reviews, experiments, prompts and automations
- [Blog](${url("/blog")}): writing on prompt engineering and Generative AI
- [Portfolio: AI Solutions Engineer](${url("/portfolio/ai-solutions-engineer")}): AI solutions, projects, stack and experience
- [Portfolio: AI Enablement Officer & Corporate Trainer](${url("/portfolio/ai-enablement-officer")}): AI workshops, institutes trained and training approach
- [Contact](${url("/contact")}): training, workshops, consulting and job enquiries
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
