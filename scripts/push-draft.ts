/**
 * Uploads a checked content draft to Sanity as an UNPUBLISHED draft
 * (drafts.<id>). Nothing goes live: the author reviews it in Studio and
 * presses Publish. If a published document with the same slug exists, the
 * draft becomes a pending edit of that document instead of a duplicate,
 * keeping any fields the draft doesn't set.
 *
 * Dry run by default — prints what it would write. Add --confirm to write.
 *
 * Run with: npx tsx scripts/push-draft.ts Docs/content-drafts/<slug>.json [--confirm]
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { existsSync, readFileSync } from "node:fs";
import { createClient } from "next-sanity";
import { checkDraft, formatReport, type Draft } from "./lib/content-rules";

const file = process.argv.find((a) => a.endsWith(".json"));
const confirm = process.argv.includes("--confirm");
if (!file) {
  console.error("Usage: npx tsx scripts/push-draft.ts Docs/content-drafts/<slug>.json [--confirm]");
  process.exit(2);
}

const draft = JSON.parse(readFileSync(file, "utf8")) as Draft;
const source = draft.source && existsSync(draft.source) ? readFileSync(draft.source, "utf8") : null;
const report = checkDraft(draft, source);
console.log(formatReport(file, report));
if (report.errors.length) {
  console.error("\nNot pushed: fix the errors above first (scripts/check-content.ts).");
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_TOKEN in .env.local",
  );
}
const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

const key = (s: string, i: number) => `${s.replace(/[^a-z0-9]/gi, "").slice(0, 20) || "k"}${i}`;

async function main() {
  // Reuse the published document's id when one exists, so this becomes an edit, not a duplicate.
  const existing: string | null = await client.fetch(
    `*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { type: draft.type, slug: draft.slug },
  );
  const baseId = existing ?? `${draft.type}-${draft.slug}`;

  // Resolve { type, slug } links to Sanity references.
  const resolveRefs = (field: string, links: { type: string; slug: string }[] = []) =>
    Promise.all(
      links.map(async (r) => {
        const id: string | null = await client.fetch(`*[_type == $type && slug.current == $slug][0]._id`, r);
        if (!id) throw new Error(`${field}: no ${r.type} with slug "${r.slug}".`);
        const clean = id.replace(/^drafts\./, "");
        const published: string | null = await client.fetch(`*[_id == $clean][0]._id`, { clean });
        // A strong reference to a never-published doc is rejected by Sanity, so
        // link drafts weakly; Studio strengthens the link when the target publishes.
        return published
          ? { _type: "reference", _ref: clean, _key: clean }
          : { _type: "reference", _ref: clean, _key: clean, _weak: true, _strengthenOnPublish: { type: r.type } };
      }),
    );
  const related = await resolveRefs("relatedContent", draft.relatedContent);
  const parts = await resolveRefs("parts", draft.parts);
  const areas = await resolveRefs(
    "engineeringAreas",
    draft.engineeringAreas?.map((slug) => ({ type: "engineeringArea", slug })),
  );

  // Start from the published document so fields the draft doesn't mention
  // (cover image, resources, …) survive when the edit is published.
  const base: Record<string, unknown> = existing
    ? ((await client.fetch(`*[_id == $id][0]`, { id: existing })) ?? {})
    : {};
  delete base._rev;
  delete base._createdAt;
  delete base._updatedAt;

  const doc = {
    ...base,
    _id: `drafts.${baseId}`,
    _type: draft.type,
    ...draft.fields,
    slug: { _type: "slug", current: draft.slug },
    diagrams: draft.diagrams.map((d, i) => ({
      _type: "processDiagram",
      _key: key(d.key, i),
      ...d,
      key: { _type: "slug", current: d.key },
      steps: d.steps?.map((s, j) => ({ _type: "diagramStep", _key: `s${j}`, ...s })),
      pairs: d.pairs?.map((p, j) => ({ _type: "analogyPair", _key: `p${j}`, ...p })),
    })),
    ...(draft.relatedContent ? { relatedContent: related } : {}),
    ...(draft.parts ? { parts } : {}),
    ...(draft.engineeringAreas ? { engineeringAreas: areas } : {}),
  };

  console.log(
    `\n${existing ? "Edit of existing" : "New"} ${draft.type} → ${doc._id} (${draft.diagrams.length} diagrams, ${related.length} related links)`,
  );
  if (!confirm) {
    console.log("Dry run — nothing written. Re-run with --confirm to upload the draft.");
    return;
  }
  await client.createOrReplace(doc);
  console.log("Draft uploaded. Review it in Studio (/studio) and press Publish when happy.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
