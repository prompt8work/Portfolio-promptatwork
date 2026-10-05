/**
 * Removes the template-seeded AI Lab entries listed in a backup file from
 * Sanity. First it removes any links to them from documents that stay (for
 * example a blog post's related content), then it deletes them all in one
 * transaction. Restore from the same backup file if needed.
 *
 * Dry run by default — prints what it would do. Add --confirm to write.
 *
 * Run with: npx tsx scripts/remove-template-content.ts Docs/backups/ai-lab-template-content-2026-10-05.json [--confirm]
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "node:fs";
import { createClient } from "next-sanity";

const file = process.argv.find((a) => a.endsWith(".json"));
const confirm = process.argv.includes("--confirm");
if (!file) {
  console.error("Usage: npx tsx scripts/remove-template-content.ts <backup.json> [--confirm]");
  process.exit(2);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});

const backup: { _id: string; _type: string; title?: string; name?: string }[] = JSON.parse(readFileSync(file, "utf8"));
const ids = backup.map((d) => d._id);
const gone = new Set(ids.flatMap((id) => [id, id.replace(/^drafts\./, "")]));

/** Drops every reference to a removed document, at any depth. */
function unlink(value: unknown): unknown {
  if (Array.isArray(value)) return value.filter((v) => !(v && typeof v === "object" && gone.has((v as { _ref?: string })._ref ?? ""))).map(unlink);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v && typeof v === "object" && gone.has((v as { _ref?: string })._ref ?? "")) continue;
      out[k] = unlink(v);
    }
    return out;
  }
  return value;
}

async function main() {
  const referencers: Record<string, unknown>[] = await client.fetch(`*[references($ids) && !(_id in $ids)]`, {
    ids: [...gone],
  });

  console.log(`Delete ${ids.length} documents:`);
  backup.forEach((d) => console.log(`  - ${d._type.padEnd(10)} ${d.title ?? d.name}`));
  console.log(`Remove links to them from ${referencers.length} documents that stay:`);
  referencers.forEach((d) => console.log(`  - ${d._id}`));

  if (!confirm) {
    console.log("\nDry run — nothing written. Re-run with --confirm to delete.");
    return;
  }

  const tx = client.transaction();
  for (const d of referencers) {
    const { _rev, _createdAt, _updatedAt, ...rest } = d;
    void _rev; void _createdAt; void _updatedAt;
    tx.createOrReplace(unlink(rest) as { _id: string; _type: string });
  }
  ids.forEach((id) => tx.delete(id));
  await tx.commit();

  const left: number = await client.fetch(`count(*[_id in $ids])`, { ids });
  console.log(`\nDone. ${ids.length - left} deleted, ${left} remaining.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
