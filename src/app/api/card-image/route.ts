import { after, type NextRequest } from "next/server";
import { createClient } from "next-sanity";
import { parseBody } from "next-sanity/webhook";
import { apiVersion, dataset, projectId } from "../../../sanity/env";
import { cardImagesConfigured } from "../../../lib/card-images/provider";
import { cardImageTypes, ensureCardImage } from "../../../lib/card-images/sanity";

// Sanity → card image on publish. Configure a second webhook in
// sanity.io/manage → API → Webhooks: URL https://<site>/api/card-image,
// trigger on create + update, filter
//   _type in ["blog","project","tool","prompt","experiment","automation","training"]
// projection `{_id, _type}`, drafts off, and the same secret as
// SANITY_REVALIDATE_SECRET.
//
// Generation takes longer than Sanity waits for a webhook, so the request
// is answered at once and the work runs in after(). Writing the image back
// is itself a publish, which fires /api/revalidate, so the cards refresh
// on their own. That write also re-fires this hook; ensureCardImage sees
// the content hash unchanged and does nothing.
//
// Needs SANITY_API_TOKEN (write access) and OPENAI_API_KEY.
export const maxDuration = 300;

type WebhookPayload = { _id?: string; _type?: string };

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const token = process.env.SANITY_API_TOKEN;
  if (!secret || !token || !cardImagesConfigured()) {
    return new Response("Card images not configured", { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret);
  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });
  if (!body?._id || !body._type) return new Response("Bad request", { status: 400 });
  if (!cardImageTypes.includes(body._type)) return Response.json({ skipped: body._type });

  const { _id: id, _type: type } = body;
  after(async () => {
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    try {
      const result = await ensureCardImage(client, id, type);
      console.log(`card-image ${type} ${id}: ${result}`);
    } catch (err) {
      console.error(`card-image ${type} ${id} failed`, err);
    }
  });
  return Response.json({ accepted: id }, { status: 202 });
}
