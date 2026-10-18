import type { SanityClient } from "next-sanity";
import type { NormalizedContentItem, PrivacyStatus } from "./types";

// PRD §87 Duplicate Prevention: "(source, external_id)" as the unique key.
// Sanity has no composite-unique-constraint concept, so the deterministic
// document _id below does the same job — createOrReplace against the same
// _id on a re-sync updates the existing document instead of creating a
// second one for the same video/post.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

export async function upsertVideo(client: SanityClient, item: NormalizedContentItem): Promise<void> {
  await client.createOrReplace({
    _id: `video-${item.source}-${item.externalId}`,
    _type: "video",
    slug: { _type: "slug", current: slugify(item.title) },
    title: item.title,
    thumbnailUrl: item.thumbnailUrl,
    description: item.description,
    publishedAt: item.publishedAt,
    source: item.source,
    externalId: item.externalId,
    externalUrl: item.externalUrl,
    privacyStatus: item.privacyStatus,
  });
}

// A video synced while public can later be made private, unlisted or
// deleted on YouTube. Nothing is deleted from Sanity: each synced video's
// privacyStatus is refreshed from YouTube instead, and the site's queries
// only show videos whose status is "public".
export async function refreshVideoPrivacy(
  client: SanityClient,
  fetchStatuses: (externalIds: string[]) => Promise<Map<string, PrivacyStatus>>
): Promise<string[]> {
  const synced = await client.fetch<{ _id: string; externalId: string; privacyStatus?: PrivacyStatus }[]>(
    `*[_type == "video" && source == "youtube"]{ _id, externalId, privacyStatus }`
  );
  if (synced.length === 0) return [];

  const statuses = await fetchStatuses(synced.map((v) => v.externalId));
  const changed = synced.filter((v) => statuses.get(v.externalId) !== v.privacyStatus);
  for (const video of changed) {
    await client.patch(video._id).set({ privacyStatus: statuses.get(video.externalId) }).commit();
  }
  return changed.filter((v) => statuses.get(v.externalId) !== "public").map((v) => v.externalId);
}
