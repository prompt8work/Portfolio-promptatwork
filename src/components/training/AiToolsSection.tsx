import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import Tag from "../ui/Tag";
import { StaggerGrid, StaggerItem } from "../motion/StaggerGrid";
import { aiTools } from "../../lib/seo";

// "AI tools I train on" — the visible half of the tools list in
// src/lib/seo.ts (the same list feeds the structured data and /llms.txt),
// so the tool names people search for appear as real page text. In-depth
// tool reviews stay in the AI Lab; this only points there.
export default function AiToolsSection() {
  return (
    <section id="ai-tools" className="w-full border-t border-neutral-200">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 pt-20 sm:pt-24 pb-24 sm:pb-28">
        <SectionHeading
          eyebrow="AI TOOLS"
          title="AI tools I train teams on"
          description="Hands-on training, setup and consulting for individuals and teams, in Indore or online. If you want to get more done with any of these tools, get in touch."
          action={
            <Button
              href="/contact"
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              }
              arrow
            >
              Talk about training
            </Button>
          }
        />

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((group) => (
            <StaggerItem key={group.category}>
              <div className="h-full bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col gap-3">
                <h3 className="font-display text-lg font-semibold text-neutral-900">{group.category}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{group.description}</p>
                <ul className="flex flex-wrap gap-2 mt-auto pt-2" aria-label={`${group.category} tools`}>
                  {group.tools.map((tool) => (
                    <li key={tool}>
                      <Tag variant="cyan">{tool}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
