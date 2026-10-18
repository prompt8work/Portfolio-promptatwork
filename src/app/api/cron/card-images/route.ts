import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../../../sanity/env";
import { cardImagesConfigured } from "../../../../lib/card-images/provider";
import { ensureCardImage, listPendingCardImages } from "../../../../lib/card-images/sanity";

// Daily safety net for /api/card-image (vercel.json): fills in any card
// image a missed webhook or a failed generation left out, a few per run so
// one call stays inside the function's time limit. Same auth as the
// YouTube cron: Vercel sends `Authorization: Bearer $CRON_SECRET`.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const PER_RUN = 4;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const token = process.env.SANITY_API_TOKEN;
  if (!token || !cardImagesConfigured()) {
    return new Response("Card images not configured", { status: 500 });
  }

  try {
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const pending = await listPendingCardImages(client);
    const done: string[] = [];
    for (const card of pending.slice(0, PER_RUN)) {
      if ((await ensureCardImage(client, card.id, card.type)) === "generated") done.push(card.id);
    }
    return Response.json({ generated: done.length, remaining: pending.length - done.length });
  } catch (err) {
    console.error("card-images cron failed", err);
    return new Response("Card image sweep failed", { status: 502 });
  }
}
