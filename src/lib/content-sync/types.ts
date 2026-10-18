// The common shape every external source gets normalized into (PRD §57
// Content Aggregation Pattern: External Source -> Adapter -> Normalizer ->
// CMS Content). (source, externalId) together are the PRD §87 duplicate-
// prevention key — a sync script turns that pair into a deterministic
// Sanity document _id and calls createOrReplace, which does the job of a
// unique constraint without a separate database.
//
// LinkedIn is intentionally not a source here (PRD 04.2 change): the
// website is the source of truth for written content and LinkedIn is only
// a distribution channel it shares a canonical blog URL to — see
// ShareActions and Docs/development-plan/04.2-ai-lab-content-modification.md.
export type ContentSource = "youtube";

export type PrivacyStatus = "public" | "unlisted" | "private";

export type NormalizedContentItem = {
  source: ContentSource;
  externalId: string;
  externalUrl: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  privacyStatus: PrivacyStatus;
};

// PRD §55 Adapter Pattern: isolates one external API's quirks behind this
// one shape. Each adapter only knows how to talk to its own source and
// normalize its response — nothing else in the app needs to know the
// specifics of e.g. YouTube's "snippet.thumbnails.high.url" shape.
export interface ContentAdapter {
  source: ContentSource;
  fetchItems(): Promise<NormalizedContentItem[]>;
}
