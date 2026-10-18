/**
 * PRD §35/§86 YouTube sync: Scheduled Sync -> YouTube API -> Fetch Videos
 * -> Keep public only -> Normalize -> Check External ID -> Create/Update in
 * Sanity -> Refresh privacyStatus on every synced video.
 *
 * Not wired to a live cron job yet — PRD §88 explicitly warns against
 * standing up a permanent background worker before it's actually needed,
 * and this repo has no deployed URL for Vercel Cron to call yet (same
 * "needs a deployed URL first" gap the Sanity webhook has — see the
 * Phase 2 doc). This runs on demand for now; wiring it to Vercel Cron is a
 * config change once the site is deployed, not a code change.
 *
 * Requires two real credentials this codebase cannot generate on its own:
 *   YOUTUBE_API_KEY     — a Google Cloud API key with YouTube Data API v3 enabled
 *   YOUTUBE_CHANNEL_ID  — the channel to sync from (starts with "UC")
 *
 * Run with: npx tsx scripts/sync-youtube.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "next-sanity";
import { YouTubeAdapter } from "../src/lib/content-sync/adapters/youtubeAdapter";
import { AdapterSyncStrategy } from "../src/lib/content-sync/strategies";
import { refreshVideoPrivacy, upsertVideo } from "../src/lib/content-sync/upsert";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID;

if (!projectId || !dataset || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_TOKEN in .env.local");
}

if (!youtubeApiKey || !youtubeChannelId) {
  throw new Error(
    "Missing YOUTUBE_API_KEY / YOUTUBE_CHANNEL_ID in .env.local. Get an API key from Google Cloud Console " +
      "(enable 'YouTube Data API v3'), and find the channel ID from the channel's 'About' page or channel URL."
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

async function main() {
  const adapter = new YouTubeAdapter(youtubeApiKey!, youtubeChannelId!);
  const items = await new AdapterSyncStrategy(adapter).run();

  console.log(`Fetched ${items.length} public video(s) from YouTube.`);
  for (const item of items) {
    await upsertVideo(client, item);
    console.log(`  ✓ ${item.title}`);
  }

  const hidden = await refreshVideoPrivacy(client, (ids) => adapter.fetchPrivacyStatuses(ids));
  for (const id of hidden) console.log(`  ✗ hidden ${id} (not public on YouTube)`);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
