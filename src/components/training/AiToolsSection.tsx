import Button from "../ui/Button";
import Tag from "../ui/Tag";
import { StaggerGrid, StaggerItem } from "../motion/StaggerGrid";
import { aiTools } from "../../lib/seo";

// "AI tools I train on" — the visible half of the tools list in
// src/lib/seo.ts (the same list feeds the structured data and /llms.txt),
// so the tool names people search for appear as real page text. In-depth
// tool reviews stay in the AI Lab; this only points there. Sized for the
// Training hub's reading column.
export default function AiToolsSection() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 id="ai-tools" className="font-sans text-[26px] font-semibold tracking-tight text-neutral-900 scroll-mt-28">
          AI tools I train teams on
        </h2>
        <p className="text-[15.5px] leading-[1.75] text-neutral-700">
          Hands-on training, setup and consulting for individuals and teams, in Indore or online. If you want to get more
          done with any of these tools, get in touch.
        </p>
      </div>

      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {aiTools.map((group) => (
          <StaggerItem key={group.category}>
            <div className="h-full bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col gap-3">
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

      <div>
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
      </div>
    </section>
  );
}
