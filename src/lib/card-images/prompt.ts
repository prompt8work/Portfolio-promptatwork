import { createHash } from "node:crypto";

// Turns a card's own content into an image-model prompt. The topic is only
// ever the entry's title, summary and tags; the image illustrates that
// subject, it doesn't state anything. That is why the style forbids text,
// numbers, logos and faces: a generated image must not show a metric, a
// brand or a person the author never supplied (content-guidelines.md §3).

export type CardTopic = {
  /** What the card is, e.g. "blog post", "AI tool review", "workshop". */
  kind: string;
  title: string;
  summary?: string;
  keywords?: string[];
};

// Bump to regenerate every auto-generated image after a style change.
export const PROMPT_VERSION = 1;

// Matches the site's luminous dark look (paw-tokens.css): thumbnails stay
// dark in both themes, like Thumb.
const STYLE = [
  "Clean, modern editorial illustration for a technology website card, wide 16:9 composition.",
  "Deep navy-black background with soft luminous blue and violet glows, subtle depth and gentle gradients.",
  "One clear visual metaphor for the subject, centred with generous negative space; abstract or isometric 3D shapes, nodes, flows or objects.",
  "Absolutely no text, letters, words, numbers, logos, brand marks, user-interface screenshots or human faces.",
].join(" ");

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

export function cardImagePrompt(t: CardTopic): string {
  const keywords = [...new Set((t.keywords ?? []).map((k) => k.trim()).filter(Boolean))].slice(0, 8);
  return [
    `Subject: ${t.kind} titled "${clip(t.title.trim(), 140)}".`,
    t.summary?.trim() && `About: ${clip(t.summary.trim().replace(/\s+/g, " "), 600)}`,
    keywords.length > 0 && `Related concepts: ${keywords.join(", ")}.`,
    STYLE,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Changes whenever the card's content (or the prompt style) changes. */
export function topicHash(t: CardTopic): string {
  return createHash("sha256").update(`${PROMPT_VERSION}\n${cardImagePrompt(t)}`).digest("hex").slice(0, 16);
}
