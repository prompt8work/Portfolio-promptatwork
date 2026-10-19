import type { Cta, Offering } from "./portfolio";
import type { TrainingCategory, Workshop } from "./content";

// Helpers for the workshops & courses. The content itself (titles, outlines,
// programs, timelines, institutes) is in Sanity — "Workshop / course" and
// "Institute" documents — read through src/lib/content.ts.

export type { Workshop, Institute, TrainingCategory, TrainingProgram, ModuleGroup, Capstone, SessionPart, TimelineRow, TimelineBlock } from "./content";
/** Kept for components typed against the old name. */
export type Training = Workshop;

// The three audience categories. Fixed in code because /training?category=
// URLs depend on their slugs; the same list is the Workshop schema's options.
export const trainingCategories = [
  { slug: "non-technical", label: "Non-technical" },
  { slug: "technical", label: "Technical" },
  { slug: "tech-non-tech", label: "Tech + non-tech" },
] as const satisfies readonly { slug: string; label: TrainingCategory }[];

export const trainingPath = (slug: string) => `/training/${slug}`;

export const categorySlug = (label: TrainingCategory) => trainingCategories.find((c) => c.label === label)!.slug;

/** The filtered hub, e.g. /training?category=technical. */
export const trainingCategoryPath = (label: TrainingCategory) => `/training?category=${categorySlug(label)}`;

/**
 * A workshop as a card (OfferingCard). `link` is the card's button; the
 * portfolio passes its "Enquire" CTA, /training passes none.
 */
export function trainingToOffering(t: Workshop, link?: Cta): Offering {
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
    image: t.image,
    link,
  };
}
