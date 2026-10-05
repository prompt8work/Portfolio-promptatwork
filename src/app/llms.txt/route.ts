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

> Niharika Dhande (also Niharika Saxena Dhande) is an AI Enablement Officer, AI Solutions Engineer, prompt engineer and corporate AI trainer based in Indore, Madhya Pradesh, India. PromptAtWork (also written "Prompt at Work") is the portfolio and teaching site of Niharika Dhande: practical Generative AI, RAG and AI-powered applications, built, documented and taught in the open.

## About
- Location: Indore, Madhya Pradesh, India
- Roles: AI Enablement Officer, AI Solutions Engineer, Corporate AI Trainer, Prompt Engineer; founder of Prompt at Work
- Focus: prompt engineering, Generative AI, RAG and knowledge systems, agentic AI, AI automation, AI-assisted software development
- Training: cohort-based prompt engineering and Generative AI courses and workshops, taught online
- LinkedIn: https://${personalInfo.linkedin}
- GitHub: https://${personalInfo.github}

## Generative AI tools — training, setup and consulting
Niharika Dhande works hands-on with these tools and can be contacted for training, workshops, team adoption and consulting on them (in Indore or online): [Contact](${url("/contact")})
${toolLines}

## Common questions
These answers restate what the linked pages show.

- **Who is a prompt engineering and AI trainer in Indore?** Niharika Dhande, founder of Prompt at Work, trains engineers, business teams and students in prompt engineering, AI-assisted coding, agentic AI and AI in everyday office tools. [Training](${url("/training")})
- **Do participants need coding skills?** Not for the non-technical tracks: prompt engineering for business teams, AI at work and AI concepts need no code. [AI Enablement Officer & Corporate Trainer](${url("/portfolio/ai-enablement-officer")})
- **Can one programme train several departments?** Yes. A recent 6-day programme trained MIS, Design, Accounts, Sales, Pre-sales and Administration teams together. [AI Enablement Officer & Corporate Trainer](${url("/portfolio/ai-enablement-officer")})
- **Who teaches Claude and Claude Code?** Niharika Dhande coaches teams on Claude Code and AI-assisted development, and builds on Claude and the Anthropic API. [Claude Code research](${url("/ai-lab/tools/claude-code")})
- **Who builds RAG assistants, chatbots and AI agents?** Niharika Dhande, as an AI Solutions Engineer: RAG assistants, chatbots, agents, MCP and API integrations, from proof of concept to production. [AI Solutions Engineer](${url("/portfolio/ai-solutions-engineer")})
- **Where is a working prompt library?** The PromptAtWork Prompt Library has categorized, copyable prompts with example input and output. [Prompt Library](${url("/ai-lab/prompts")})

## Key pages
- [Home](${url("/")}): who Niharika is and what Niharika builds
- [Training](${url("/training")}): prompt engineering and Generative AI courses and workshops
- [AI Lab](${url("/ai-lab")}): projects, case studies, engineering, AI tool reviews, experiments, prompts and automations
- [Case studies](${url("/ai-lab/work")}): RAG, agentic and full-stack AI projects, end to end
- [Prompt Library](${url("/ai-lab/prompts")}): working prompts with example input and output
- [Blog](${url("/blog")}): writing on prompt engineering and Generative AI
- [Portfolio: AI Solutions Engineer](${url("/portfolio/ai-solutions-engineer")}): AI solutions, projects, stack and experience
- [Portfolio: AI Enablement Officer & Corporate Trainer](${url("/portfolio/ai-enablement-officer")}): AI workshops, institutes trained and training approach
- [Contact](${url("/contact")}): training, workshops, consulting and job enquiries
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
