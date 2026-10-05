/**
 * Prints an existing published document in the content-draft format
 * (scripts/lib/content-rules.ts → Draft), so the /case-study skill can
 * rebuild an entry to the current content rules starting from what's live.
 * Read-only. Images, files and reference fields are listed, not copied —
 * push-draft keeps them when the edit is published.
 *
 * Run with: npx tsx scripts/fetch-content.ts <type> <slug>
 *      or:  npx tsx scripts/fetch-content.ts --list   (every slug, by type)
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "next-sanity";
import { contentTypes } from "./lib/content-rules";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type Doc = Record<string, unknown> & { _type: string; slug?: { current?: string } };

function isRefOrAsset(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  if (Array.isArray(v)) return v.some(isRefOrAsset);
  const o = v as Record<string, unknown>;
  return "_ref" in o || "asset" in o;
}

async function main() {
  if (process.argv.includes("--list")) {
    const rows: { _type: string; slug: string; title: string }[] = await client.fetch(
      `*[_type in $types && !(_id in path("drafts.**"))]{ _type, "slug": slug.current, "title": coalesce(title, name) } | order(_type asc)`,
      { types: [...contentTypes, "engineeringArea"] },
    );
    rows.forEach((r) => console.log(`${r._type.padEnd(11)} ${r.slug.padEnd(48)} ${r.title}`));
    return;
  }

  const [type, slug] = process.argv.slice(2);
  if (!type || !slug) {
    console.error("Usage: npx tsx scripts/fetch-content.ts <type> <slug>   |   --list");
    process.exit(2);
  }
  const doc: Doc | null = await client.fetch(
    `*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]`,
    {
      type,
      slug,
    },
  );
  if (!doc) {
    console.error(`No published ${type} with slug "${slug}".`);
    process.exit(1);
  }

  const fields: Record<string, unknown> = {};
  const keptInStudio: string[] = [];
  for (const [k, v] of Object.entries(doc)) {
    if (k.startsWith("_") || ["slug", "diagrams", "relatedContent", "parts", "engineeringAreas"].includes(k)) continue;
    if (isRefOrAsset(v)) keptInStudio.push(k);
    else fields[k] = v;
  }

  const strip = (o: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith("_")));
  const diagrams = ((doc.diagrams as Record<string, unknown>[] | undefined) ?? []).map((d) => ({
    ...strip(d),
    key: (d.key as { current?: string })?.current,
    steps: (d.steps as Record<string, unknown>[] | undefined)?.map(strip),
    pairs: (d.pairs as Record<string, unknown>[] | undefined)?.map(strip),
  }));

  const related: { type: string; slug: string }[] = await client.fetch(
    `*[_id == $id][0].relatedContent[]->{ "type": _type, "slug": slug.current }`,
    { id: doc._id },
  );

  const links: {
    parts: { type: string; slug: string }[] | null;
    engineeringAreas: string[] | null;
  } = await client.fetch(
    `*[_id == $id][0]{
      "parts": parts[]->{ "type": _type, "slug": slug.current },
      "engineeringAreas": engineeringAreas[]->slug.current
    }`,
    { id: doc._id },
  );

  console.log(
    JSON.stringify(
      {
        type,
        slug,
        source: `Docs/content-drafts/${slug}.source.md`,
        fields,
        diagrams,
        ...(links.parts?.length ? { parts: links.parts } : {}),
        ...(links.engineeringAreas?.length ? { engineeringAreas: links.engineeringAreas } : {}),
        relatedContent: related ?? [],
        keptInStudio,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
