/**
 * Moves AI Lab → Engineering into Sanity (October 2026). It was a hand-written
 * list in data/engineering.ts; now each capability area is an
 * `engineeringArea` document, and its evidence is every published entry that
 * tags it in `engineeringAreas` (see src/sanity/schemaTypes/engineeringArea.ts).
 *
 * 1. Creates the five areas below, with the text the page showed before the
 *    move. Areas that already exist are left alone, so Studio edits survive
 *    a re-run.
 * 2. Tags the existing entries with the areas they were listed under. Tags
 *    are only added, never removed.
 *
 * Dry run by default. Run with: npx tsx scripts/seed-engineering.ts [--confirm]
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "next-sanity";

const confirm = process.argv.includes("--confirm");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

type Ref = { type: string; slug: string };
const areas: { slug: string; title: string; description: string; items: string[]; evidence: Ref[] }[] = [
  {
    slug: "full-stack-ai",
    title: "Full-Stack AI Engineering",
    description:
      "Complete products, not notebooks. A Next.js and TypeScript multi-agent app with live streaming output, a SQLite data layer, Google sign-in, Drive and Gmail integrations, Word and PDF exports, 138 test files and CI/CD through GitHub Actions. And a FastAPI RAG backend with a React chat app, Google Drive sync, client-side PDF export, 44 pytest test functions and push-to-deploy through GitHub Actions, PM2 and Nginx.",
    items: [
      "Next.js + TypeScript",
      "FastAPI + React",
      "Live streaming (Server-Sent Events)",
      "Google OAuth, Drive & Gmail",
      ".docx / .pdf exports",
      "Testing & CI/CD",
    ],
    evidence: [
      { type: "project", slug: "ai-executive-command-center" },
      { type: "project", slug: "meeting-intelligence-chatbot" },
    ],
  },
  {
    slug: "rag-retrieval",
    title: "RAG & Retrieval",
    description:
      "Answers grounded in a team's own meetings. Transcripts are cleaned, chunked by speaker and embedded with all-MiniLM-L6-v2 into FAISS, alongside a custom BM25 keyword index. Every question is searched both ways and the rankings are fused with Reciprocal Rank Fusion, narrowed by project and date filters. A four-prompt slot-state flow rebuilds each follow-up into a standalone query, so multi-turn questions keep their context.",
    items: ["Hybrid search (FAISS + BM25)", "Reciprocal Rank Fusion", "Embeddings", "Metadata filters", "Multi-turn slot state"],
    evidence: [
      { type: "project", slug: "meeting-intelligence-chatbot" },
      { type: "prompt", slug: "meeting-qa-direct-answer-prompt" },
    ],
  },
  {
    slug: "generative-ai",
    title: "Generative AI Engineering",
    description:
      "Prompts managed as content and editable without a deploy, structured outputs validated with Zod, models bound per agent across several providers, prompt-injection defences that fail closed, and on-brand image generation with brand rules enforced in code. On the document side, a JSON prompt library and two-stage and chained pipelines turn meeting transcripts into Executive Summaries, requirements documents, user stories and timelines in the same templated structure every time, with model tiers on Groq and JSON repair on the output.",
    items: [
      "Prompt engineering",
      "Structured outputs",
      "Multi-stage document pipelines",
      "Multi-provider models",
      "Prompt-injection defence",
      "Image generation",
    ],
    evidence: [
      { type: "automation", slug: "apparel-design-to-print-kit" },
      { type: "automation", slug: "meeting-transcripts-to-delivery-documents" },
      { type: "experiment", slug: "fast-vs-two-stage-vs-chained-document-generation" },
    ],
  },
  {
    slug: "agentic-ai",
    title: "Agentic AI",
    description:
      "A framework-free multi-agent system already delivered to a client — an orchestrator routing to six specialist agents, with orchestrator–workers, chaining, parallel rounds, a reflection loop, memory and human-in-the-loop built by hand. Autonomous tool-using agents on agent frameworks (Claude Agent SDK, LangGraph) are the active next phase, not a finished capability.",
    items: ["Multi-agent orchestration", "Intent routing", "Reflection & conflict resolution", "Human-in-the-loop", "Multi-LLM routing"],
    evidence: [{ type: "project", slug: "ai-executive-command-center" }],
  },
  {
    slug: "ai-automation",
    title: "AI Automation & Integrations",
    description:
      "Manual, repeatable work turned into pipelines and connectors — a design request becomes printable artwork, garment mockups and a print-kit ZIP; an OAuth 2.1-secured MCP server lets Claude generate images with OpenAI's models; and a Google Drive folder of meeting transcripts stays searchable through an incremental sync that processes only new or updated files.",
    items: ["Design-to-print pipeline", "MCP servers", "OAuth 2.1", "Incremental Drive sync", "Confirm-before-act"],
    evidence: [
      { type: "automation", slug: "claude-openai-image-mcp-connector" },
      { type: "automation", slug: "drive-to-meeting-search-index" },
    ],
  },
];

async function main() {
  const tx = client.transaction();
  const tags = new Map<string, Set<string>>(); // published doc _id → area ids to add

  for (const [i, a] of areas.entries()) {
    const _id = `engineeringArea-${a.slug}`;
    tx.createIfNotExists({
      _id,
      _type: "engineeringArea",
      title: a.title,
      slug: { _type: "slug", current: a.slug },
      order: i + 1,
      description: a.description,
      items: a.items,
    });
    console.log(`area      ${_id}`);

    for (const ref of a.evidence) {
      const id: string | null = await client.fetch(
        `*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
        ref,
      );
      if (!id) throw new Error(`No published ${ref.type} with slug "${ref.slug}".`);
      if (!tags.has(id)) tags.set(id, new Set());
      tags.get(id)!.add(_id);
    }
  }

  for (const [docId, areaIds] of tags) {
    // Tag the published document and any pending draft of it, so publishing
    // the draft later doesn't drop the tag.
    for (const id of [docId, `drafts.${docId}`]) {
      const doc: { engineeringAreas?: { _ref: string }[] | null } | null = await client.fetch(
        `*[_id == $id][0]{ engineeringAreas }`,
        { id },
      );
      if (!doc) continue; // no pending draft
      const have = new Set((doc.engineeringAreas ?? []).map((r) => r._ref));
      const add = [...areaIds].filter((a) => !have.has(a));
      if (!add.length) continue;
      tx.patch(id, (p) =>
        p
          .setIfMissing({ engineeringAreas: [] })
          .append("engineeringAreas", add.map((a) => ({ _type: "reference", _ref: a, _key: a }))),
      );
      console.log(`tag       ${id} → ${add.join(", ")}`);
    }
  }

  if (!confirm) {
    console.log("\nDry run — nothing written. Re-run with --confirm to write.");
    return;
  }
  await tx.commit();
  console.log("\nDone. /ai-lab/engineering now reads from Sanity.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
