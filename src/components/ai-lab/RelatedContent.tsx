import ArrowLink from "../ui/ArrowLink";
import Reveal from "../motion/Reveal";
import { StaggerGrid, StaggerItem } from "../motion/StaggerGrid";
import { BlockLabel } from "../ui/ContentSection";

export type RelatedItem = {
  _type: "project" | "tool" | "prompt" | "experiment" | "automation" | "blog" | "training";
  slug: string;
  title?: string;
  name?: string;
};

const hrefFor: Record<RelatedItem["_type"], (slug: string) => string> = {
  project: (slug) => `/ai-lab/work/${slug}`,
  tool: (slug) => `/ai-lab/tools/${slug}`,
  prompt: (slug) => `/ai-lab/prompts/${slug}`,
  experiment: (slug) => `/ai-lab/experiments/${slug}`,
  automation: (slug) => `/ai-lab/automations/${slug}`,
  blog: (slug) => `/blog/${slug}`,
  training: (slug) => `/training/${slug}`,
};

export default function RelatedContent({ items, heading = "Related content" }: { items?: RelatedItem[]; heading?: string }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 pt-6 border-t border-line">
      <Reveal>
        <BlockLabel>{heading}</BlockLabel>
      </Reveal>
      <StaggerGrid className="flex flex-col gap-2">
        {items.map((item) => (
          <StaggerItem key={`${item._type}-${item.slug}`}>
            <ArrowLink href={hrefFor[item._type](item.slug)} size="sm">
              {item.title ?? item.name}
            </ArrowLink>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
