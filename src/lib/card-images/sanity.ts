import type { SanityClient } from "next-sanity";
import { cardImagePrompt, topicHash, type CardTopic } from "./prompt";
import { generateCardImage } from "./provider";

// Sanity side of card images: which content types get one, what each
// type's topic is made of, and the generate → upload → patch step.
//
// An image is generated only when the entry has none, or when the one it
// has was generated here from older content (the stored hash differs). An
// image an editor uploaded themselves is never replaced: it's recognised
// because its asset isn't the one recorded in cardImageMeta.assetRef.

type Source = { kind: string; imageField: "coverImage" | "cardImage"; topic: string };

export const cardImageSources: Record<string, Source> = {
  blog: {
    kind: "blog post",
    imageField: "coverImage",
    topic: `"title": title, "summary": excerpt, "keywords": [category] + coalesce(tags, [])`,
  },
  project: {
    kind: "AI engineering case study",
    imageField: "coverImage",
    topic: `"title": title, "summary": summary, "keywords": [category] + coalesce(tech, [])`,
  },
  tool: {
    kind: "AI tool review",
    imageField: "cardImage",
    topic: `"title": name, "summary": description, "keywords": [type, category] + coalesce(tags, [])`,
  },
  prompt: {
    kind: "prompt template",
    imageField: "cardImage",
    topic: `"title": title, "summary": purpose, "keywords": [category, tool->name]`,
  },
  experiment: {
    kind: "AI experiment",
    imageField: "cardImage",
    topic: `"title": title, "summary": objective, "keywords": [tool->name]`,
  },
  automation: {
    kind: "AI workflow automation",
    imageField: "cardImage",
    topic: `"title": title, "summary": description, "keywords": [category, trigger]`,
  },
  training: {
    kind: "training course",
    imageField: "cardImage",
    topic: `"title": title, "summary": description, "keywords": coalesce(topics, [])`,
  },
};

export const cardImageTypes = Object.keys(cardImageSources);

type Meta = { hash?: string; assetRef?: string; pendingHash?: string; pendingAt?: string };
type Doc = {
  _id: string;
  _type: string;
  _rev: string;
  title?: string;
  summary?: string;
  keywords?: (string | null)[];
  image?: string;
  meta?: Meta;
};

export type CardImageResult = "generated" | "fresh" | "manual" | "pending" | "skipped";

const docProjection = (s: Source) =>
  `_id, _type, _rev, ${s.topic}, "image": ${s.imageField}.asset._ref, "meta": cardImageMeta`;

// A generation in flight (another webhook delivery or the cron) holds the
// entry for this long before a second run may retry it.
const PENDING_MS = 5 * 60 * 1000;

function topicOf(doc: Doc, source: Source): CardTopic | null {
  if (!doc.title?.trim()) return null;
  return { kind: source.kind, title: doc.title, summary: doc.summary, keywords: (doc.keywords ?? []).filter((k): k is string => !!k) };
}

function needsImage(doc: Doc, hash: string): CardImageResult | null {
  if (doc.image && doc.image !== doc.meta?.assetRef) return "manual";
  if (doc.image && doc.meta?.hash === hash) return "fresh";
  const pendingAt = doc.meta?.pendingAt ? Date.parse(doc.meta.pendingAt) : 0;
  if (doc.meta?.pendingHash === hash && Date.now() - pendingAt < PENDING_MS) return "pending";
  return null;
}

async function generateFor(client: SanityClient, doc: Doc, source: Source, topic: CardTopic, hash: string) {
  // Claim the entry first; ifRevisionId makes a concurrent run lose the race
  // instead of generating a second image.
  try {
    await client
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .setIfMissing({ cardImageMeta: {} })
      .set({ "cardImageMeta.pendingHash": hash, "cardImageMeta.pendingAt": new Date().toISOString() })
      .commit();
  } catch {
    return "pending" as const;
  }

  const prompt = cardImagePrompt(topic);
  const image = await generateCardImage(prompt);
  const asset = await client.assets.upload("image", image.data, {
    filename: `card-${doc._type}-${doc._id}.${image.ext}`,
    contentType: image.contentType,
  });

  const value = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  const meta = { hash, prompt, model: image.model, assetRef: asset._id, generatedAt: new Date().toISOString() };
  const tx = client.transaction().patch(doc._id, (p) => p.set({ [source.imageField]: value, cardImageMeta: meta }));

  // An open draft would otherwise drop the image on its next publish. Only
  // touch it while its image is still empty or the old generated one.
  const draft = await client.fetch<{ image?: string } | null>(
    `*[_id == $id][0]{ "image": ${source.imageField}.asset._ref }`,
    { id: `drafts.${doc._id}` },
  );
  if (draft && (!draft.image || draft.image === doc.meta?.assetRef)) {
    tx.patch(`drafts.${doc._id}`, (p) => p.set({ [source.imageField]: value, cardImageMeta: meta }));
  }
  await tx.commit();
  return "generated" as const;
}

/** Generates the card image for one published document if it needs one. */
export async function ensureCardImage(client: SanityClient, id: string, type: string): Promise<CardImageResult> {
  const source = cardImageSources[type];
  // Drafts get their image when they're published.
  if (!source || id.startsWith("drafts.")) return "skipped";

  const doc = await client.fetch<Doc | null>(`*[_id == $id][0]{ ${docProjection(source)} }`, { id });
  if (!doc) return "skipped";
  const topic = topicOf(doc, source);
  if (!topic) return "skipped";
  const hash = topicHash(topic);
  return needsImage(doc, hash) ?? generateFor(client, doc, source, topic, hash);
}

export type PendingCard = { id: string; type: string; title: string; prompt: string };

/** Every published document that is missing its image or has a stale generated one. */
export async function listPendingCardImages(client: SanityClient): Promise<PendingCard[]> {
  const pending: PendingCard[] = [];
  for (const [type, source] of Object.entries(cardImageSources)) {
    const docs = await client.fetch<Doc[]>(
      `*[_type == $type && !(_id in path("drafts.**"))]{ ${docProjection(source)} }`,
      { type },
    );
    for (const doc of docs) {
      const topic = topicOf(doc, source);
      if (topic && !needsImage(doc, topicHash(topic))) {
        pending.push({ id: doc._id, type, title: topic.title, prompt: cardImagePrompt(topic) });
      }
    }
  }
  return pending;
}
