/**
 * Card images, on demand: the backfill for everything published before
 * the webhook existed, and the only path for cards defined in code.
 *
 *   --sanity   every published blog post, project, tool, prompt,
 *              experiment, automation and training missing its image (or
 *              with a generated one older than its content)
 *   --static   workshops (src/lib/trainings.ts) and the AI Lab section
 *              cards (src/lib/navigation.ts) → public/images/cards/ and
 *              src/lib/card-images/static-manifest.json
 *
 * Without --confirm it's a dry run that lists what would be generated and
 * the prompt for each; every generated image costs an API call.
 *
 * Run with: npx tsx scripts/generate-card-images.ts --sanity --static [--confirm]
 * Needs OPENAI_API_KEY, plus SANITY_API_TOKEN (write access) for --sanity.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { cardImagePrompt, topicHash, type CardTopic } from "../src/lib/card-images/prompt";
import { cardImagesConfigured, generateCardImage } from "../src/lib/card-images/provider";
import { ensureCardImage, listPendingCardImages } from "../src/lib/card-images/sanity";
import { staticCardKey, type StaticCardEntry } from "../src/lib/card-images/static";
import { aiLabHubSections } from "../src/lib/navigation";

const args = new Set(process.argv.slice(2));
const confirm = args.has("--confirm");
const doSanity = args.has("--sanity");
const doStatic = args.has("--static");

if (!doSanity && !doStatic) {
  throw new Error("Pass --sanity, --static or both. Add --confirm to generate (otherwise it's a dry run).");
}
if (confirm && !cardImagesConfigured()) throw new Error("Missing OPENAI_API_KEY in .env.local");

async function sanity() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !dataset || !token) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_TOKEN in .env.local");
  }
  const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });
  const pending = await listPendingCardImages(client);
  console.log(`Sanity: ${pending.length} card image(s) to generate`);
  for (const card of pending) {
    console.log(`\n• ${card.type} — ${card.title}`);
    if (!confirm) {
      console.log(card.prompt.replace(/^/gm, "    "));
      continue;
    }
    console.log(`  ${await ensureCardImage(client, card.id, card.type)}`);
  }
}

const MANIFEST = path.join("src/lib/card-images/static-manifest.json");
const OUT_DIR = path.join("public/images/cards");

function staticTopics(): { key: string; topic: CardTopic }[] {
  return [
    ...aiLabHubSections.map((s) => ({
      key: staticCardKey.section(s.href),
      topic: { kind: "section of an AI lab website", title: s.label, summary: s.body },
    })),
  ];
}

async function statics() {
  const manifest: Record<string, StaticCardEntry> = JSON.parse(await readFile(MANIFEST, "utf8"));
  const todo = staticTopics().filter(({ key, topic }) => !manifest[key]?.manual && manifest[key]?.hash !== topicHash(topic));
  console.log(`Static: ${todo.length} card image(s) to generate`);
  await mkdir(OUT_DIR, { recursive: true });

  for (const { key, topic } of todo) {
    console.log(`\n• ${key}`);
    if (!confirm) {
      console.log(cardImagePrompt(topic).replace(/^/gm, "    "));
      continue;
    }
    const hash = topicHash(topic);
    const image = await generateCardImage(cardImagePrompt(topic));
    // The hash in the filename busts the image cache when content changes.
    const file = `${key.replace(/\//g, "-")}-${hash.slice(0, 8)}.${image.ext}`;
    await writeFile(path.join(OUT_DIR, file), image.data);
    manifest[key] = { src: `/images/cards/${file}`, hash };
    // Saved after each image, so an interrupted run keeps what it made.
    await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`  saved ${file}`);
  }
}

async function main() {
  if (doSanity) await sanity();
  if (doStatic) await statics();
  if (!confirm) console.log("\nDry run. Re-run with --confirm to generate.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
