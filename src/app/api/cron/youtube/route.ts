import { revalidatePath } from "next/cache";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../../../sanity/env";
import { YouTubeAdapter } from "../../../../lib/content-sync/adapters/youtubeAdapter";
import { AdapterSyncStrategy } from "../../../../lib/content-sync/strategies";
import { refreshVideoPrivacy, upsertVideo } from "../../../../lib/content-sync/upsert";

// Scheduled YouTube sync (PRD §35/§86): the same adapter and upsert as
// scripts/sync-youtube.ts, run daily by Vercel Cron (vercel.json). Vercel
// sends `Authorization: Bearer $CRON_SECRET` with each cron call, so any
// other caller gets a 401. Re-syncing is idempotent: each video's
// document _id is derived from its YouTube id (upsert.ts).
//
// Needs in the Vercel project: CRON_SECRET, YOUTUBE_API_KEY,
// YOUTUBE_CHANNEL_ID and SANITY_API_TOKEN (a token with write access).
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { YOUTUBE_API_KEY: apiKey, YOUTUBE_CHANNEL_ID: channelId, SANITY_API_TOKEN: token } = process.env;
  if (!apiKey || !channelId || !token) {
    return new Response("YouTube sync not configured", { status: 500 });
  }

  try {
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const adapter = new YouTubeAdapter(apiKey, channelId);
    const items = await new AdapterSyncStrategy(adapter).run();
    for (const item of items) await upsertVideo(client, item);
    const hidden = await refreshVideoPrivacy(client, (ids) => adapter.fetchPrivacyStatuses(ids));

    // The TV page and the home page's "Latest Writing & Videos" read videos.
    revalidatePath("/videos");
    revalidatePath("/");
    return Response.json({ synced: items.length, hidden: hidden.length });
  } catch {
    // Details stay in the function logs, not in the response (PRD §97).
    return new Response("YouTube sync failed", { status: 502 });
  }
}
