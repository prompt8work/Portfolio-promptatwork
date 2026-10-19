import { getCanonicalUrl } from "../../lib/site";
import { getSiteSettings, profileUrl } from "../../lib/content";

// /llms.txt (llmstxt.org): a plain-markdown summary for AI assistants and
// answer engines (ChatGPT, Perplexity, Claude, Gemini) so they can describe
// and cite this site accurately. The text is "llms.txt" in Site settings;
// its placeholders are filled here: {{url:/path}}, {{linkedin}},
// {{github}} and {{tools}} (the AI tools list, one line per group).
export const revalidate = 3600;

export async function GET() {
  const s = await getSiteSettings();
  const tools = (s.aiTools ?? []).map((group) => `- ${group.category}: ${group.tools.join(", ")}`).join("\n");
  const body = (s.llmsTxt ?? "")
    .replace(/\{\{url:([^}]+)\}\}/g, (_, p: string) => getCanonicalUrl(p.trim()))
    .replace(/\{\{linkedin\}\}/g, profileUrl(s.linkedin))
    .replace(/\{\{github\}\}/g, profileUrl(s.github))
    .replace(/\{\{tools\}\}/g, tools);
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
