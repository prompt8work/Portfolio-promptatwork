#!/usr/bin/env node
// Topic-uniqueness guard for the handbook pipeline (.claude/skills/publish-handbook).
//
// Runs as a PreToolUse hook on Sanity create/patch calls. It keeps one course
// per topic on promptatwork.com and makes every update a proper new version:
//
//   Course (workshop)  one document per topicKey. A second one is refused; the
//                      existing course must be patched and its version bumped.
//   Course blog post   a new post per version. A post for a topic that already
//                      has posts must point previousVersion at the latest one
//                      and carry a higher version.
//   Look-alikes        a course or course post whose title is close to another
//                      topic's is refused until it is acknowledged as different
//                      in .claude/pipeline/topic-acks.json.
//   Slugs              never reused, so links shared on LinkedIn never break.
//
// Blog posts that are not course posts (tool and model reviews: no topicKey,
// category other than "Courses") pass through untouched.
//
// Where the topics come from: the live public API (published documents), plus
// .claude/pipeline/topic-index.json when it is under 30 minutes old (written by
// the handbook-topic-scout agent through the Sanity MCP, so it also has drafts).
// If neither can be read the write is refused: an unchecked write could create
// the duplicate this hook exists to stop.
//
// CLI, for the agents:
//   node .claude/hooks/check-topic-unique.mjs --check "<title>" [--topic <key>]   -> NEW / UPDATE / REVIEW verdict
//   node .claude/hooks/check-topic-unique.mjs --validate <tool-call.json>         -> exit 0 ok, 2 refused

import { readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ID = "ck8wyssm";
const DATASET = "production";
const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}`;
const SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
const SIMILAR = 0.5;
const COURSE_CATEGORY = "Courses";

const root = process.env.CLAUDE_PROJECT_DIR || join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pipelineDir = join(root, ".claude", "pipeline");
const snapshotPath = join(pipelineDir, "topic-index.json");
const acksPath = join(pipelineDir, "topic-acks.json");
const logPath = join(pipelineDir, "hook-log.jsonl");

const STOP = new Set(
  ("a an the and or of to for with in on from by your you my our own build building create creating make making learn learning " +
    "free course courses handbook handbooks guide guides intro introduction beginner beginners basics complete masterclass workshop " +
    "hands hands-on on explained explainer how what why is are using use scratch zero hero practical primer edition version student " +
    "students 101 updated update new")
    .split(/\s+/),
);

// ---------- helpers ----------
const bareId = (id) => String(id || "").replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "");
const kebab = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const tokens = (s) =>
  new Set(
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((w) => w && !STOP.has(w) && !/^v\d+$/.test(w))
      .map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w)), // servers -> server
  );
function jaccard(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let n = 0;
  for (const t of A) if (B.has(t)) n++;
  return n / (A.size + B.size - n);
}
function cmpVersion(a, b) {
  const pa = String(a ?? "0").split(".").map((x) => parseInt(x, 10) || 0);
  const pb = String(b ?? "0").split(".").map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}
const readJson = (p, fallback) => {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
};
function log(entry) {
  try {
    mkdirSync(pipelineDir, { recursive: true });
    appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n");
  } catch {}
}

// ---------- the topic index ----------
const INDEX_QUERY = `*[_type in ["workshop", "blog"]]{
  _id, _type, title, "slug": slug.current, topicKey, version, category,
  "previousVersionId": previousVersion._ref, publishedAt }`;

async function loadIndex() {
  const docs = new Map();
  const sources = [];
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(`${API}?query=${encodeURIComponent(INDEX_QUERY)}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) {
      for (const d of (await res.json()).result || []) docs.set(bareId(d._id), { ...d, _id: bareId(d._id) });
      sources.push("live");
    }
  } catch {}
  const snap = readJson(snapshotPath, null);
  if (snap && Array.isArray(snap.documents) && Date.now() - Date.parse(snap.generatedAt) < SNAPSHOT_MAX_AGE_MS) {
    // The snapshot includes drafts; a draft wins over the published copy it shadows.
    for (const d of snap.documents) {
      const id = bareId(d._id);
      if (!docs.has(id) || String(d._id).startsWith("drafts.")) docs.set(id, { ...docs.get(id), ...d, _id: id });
    }
    sources.push("snapshot");
  }
  return { docs: [...docs.values()], sources };
}

const isCourseDoc = (d) => d._type === "workshop" || (d._type === "blog" && (d.topicKey || d.category === COURSE_CATEGORY));
const keyOf = (d) => d.topicKey || kebab(d.title);
const acked = (acks, key, otherId) =>
  acks.some((a) => a.topicKey === key && (a.notDuplicateOf === otherId || a.notDuplicateOf === "*"));

// ---------- rules ----------
function checkNew(type, c, docs, acks, selfId) {
  const problems = [];
  const doc = { ...c, _type: type };
  if (!isCourseDoc(doc)) {
    // Non-course content: only the slug rule applies.
    const slug = c.slug?.current;
    const clash = slug && docs.find((d) => d._type === type && d.slug === slug && d._id !== selfId);
    if (clash) problems.push(`Slug "${slug}" is already used by ${clash._id}. Slugs are never reused.`);
    return problems;
  }
  if (!c.topicKey) {
    problems.push(
      `This ${type} is course content but has no topicKey. Set topicKey (lower-case, hyphenated, e.g. "${kebab(c.title)}") so every version of the topic shares it.`,
    );
    return problems;
  }
  const key = c.topicKey;
  const others = docs.filter((d) => d._id !== selfId);
  const slug = c.slug?.current;
  const slugClash = slug && others.find((d) => d._type === type && d.slug === slug);
  if (slugClash) problems.push(`Slug "${slug}" is already used by ${slugClash._id}. Slugs are never reused; give this ${type} a new slug.`);

  if (type === "workshop") {
    const same = others.find((d) => d._type === "workshop" && keyOf(d) === key);
    if (same)
      problems.push(
        `A course for topic "${key}" already exists: ${same._id} ("${same.title}", v${same.version ?? "1.0"}). ` +
          `Do not create a second course. Patch ${same._id} instead: set version to the next version, prepend a changelog entry, ` +
          `move the old files to "(archived vN)" download entries and add the new ones. Keep its slug.`,
      );
  }

  if (type === "blog") {
    const siblings = others
      .filter((d) => d._type === "blog" && d.topicKey === key)
      .sort((a, b) => cmpVersion(b.version, a.version) || String(b.publishedAt).localeCompare(String(a.publishedAt)));
    const latest = siblings[0];
    const prevRef = bareId(c.previousVersion?._ref);
    if (latest) {
      if (prevRef !== latest._id)
        problems.push(
          `Topic "${key}" already has a post: ${latest._id} ("${latest.title}", v${latest.version ?? "1.0"}). ` +
            `A new post for this topic must be a new version: set previousVersion to {"_type":"reference","_ref":"${latest._id}"}.`,
        );
      if (cmpVersion(c.version, latest.version) <= 0)
        problems.push(`version must be higher than the latest post's v${latest.version ?? "1.0"} (got ${c.version ?? "none"}).`);
    } else if (prevRef) {
      const prev = others.find((d) => d._id === prevRef);
      if (!prev) problems.push(`previousVersion points to ${prevRef}, which does not exist.`);
      else if (prev.topicKey && prev.topicKey !== key)
        problems.push(`previousVersion ${prevRef} belongs to topic "${prev.topicKey}", not "${key}".`);
    }
  }

  // Look-alikes under a different key: likely the same topic under a new name.
  const title = [c.title, key.replace(/-/g, " ")].join(" ");
  const lookalikes = others
    .filter((d) => d._type === type && isCourseDoc(d) && keyOf(d) !== key)
    .map((d) => ({ d, score: Math.max(jaccard(title, d.title + " " + keyOf(d).replace(/-/g, " ")), jaccard(key.replace(/-/g, " "), keyOf(d).replace(/-/g, " "))) }))
    .filter(({ d, score }) => score >= SIMILAR && !acked(acks, key, d._id))
    .sort((a, b) => b.score - a.score);
  for (const { d, score } of lookalikes.slice(0, 3))
    problems.push(
      `Looks like an existing topic: ${d._id} ("${d.title}", topic "${keyOf(d)}", similarity ${score.toFixed(2)}). ` +
        `If it is the same topic, publish as a new version of "${keyOf(d)}". If it is genuinely different, add ` +
        `{"topicKey":"${key}","notDuplicateOf":"${d._id}","reason":"<why>"} to .claude/pipeline/topic-acks.json and retry.`,
    );
  return problems;
}

function checkPatch(id, patches, docs, acks) {
  const base = docs.find((d) => d._id === bareId(id));
  if (!base) return [];
  const set = Object.assign({}, ...patches.map((p) => p.set || {}));
  const touched = ["topicKey", "slug", "slug.current", "title", "version", "previousVersion", "category"].some((k) => k in set);
  if (!touched) return [];
  const next = { ...base };
  if ("topicKey" in set) next.topicKey = set.topicKey;
  if ("title" in set) next.title = set.title;
  if ("category" in set) next.category = set.category;
  if ("version" in set) next.version = set.version;
  const slug = set["slug.current"] ?? set.slug?.current ?? base.slug;
  const problems = [];
  if (base.slug && slug !== base.slug)
    problems.push(`Changing the slug of ${base._id} ("${base.slug}" -> "${slug}") breaks links already shared. Keep the slug.`);
  if ("version" in set && base.version && cmpVersion(set.version, base.version) <= 0)
    problems.push(`New version ${set.version} must be higher than the current v${base.version}.`);
  if ("topicKey" in set || "title" in set || "category" in set) {
    const content = { ...next, slug: { current: slug }, previousVersion: set.previousVersion ?? (base.previousVersionId ? { _ref: base.previousVersionId } : undefined) };
    // Re-run the new-document rules, ignoring this document and (for blogs) its own lineage check.
    for (const p of checkNew(base._type, content, docs, acks, base._id))
      if (!(base._type === "blog" && /previousVersion|version must be higher/.test(p))) problems.push(p);
  }
  return problems;
}

// ---------- entry points ----------
function deny(reason) {
  if (validateMode) {
    console.error(reason);
    process.exit(2);
  }
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }),
  );
  process.exit(0);
}

async function hook(fromFile) {
  let input;
  try {
    input = JSON.parse(readFileSync(fromFile ?? 0, "utf8"));
  } catch {
    if (fromFile) {
      console.error(`Could not read ${fromFile} as JSON.`);
      process.exit(2);
    }
    process.exit(0);
  }
  const tool = String(input.tool_name || "");
  const args = input.tool_input || {};
  if (args.projectId && args.projectId !== PROJECT_ID) process.exit(0); // another site
  if (args.dataset && args.dataset !== DATASET) process.exit(0);

  const creating = /create_documents$/.test(tool);
  const items = creating
    ? (args.documents || []).filter((d) => d.type === "workshop" || d.type === "blog")
    : Object.entries(args.documents || {});
  if (!items.length) process.exit(0);

  const { docs, sources } = await loadIndex();
  if (!sources.length)
    deny(
      "Topic check could not read the site's existing courses and posts (the Sanity API is unreachable from here and " +
        ".claude/pipeline/topic-index.json is missing or older than 30 minutes). Run the handbook-topic-scout agent to " +
        "refresh the topic index, then retry.",
    );
  const acks = readJson(acksPath, []);
  const problems = [];
  for (const item of items) {
    if (creating) problems.push(...checkNew(item.type, item.content || {}, docs, acks, bareId(item.content?._id)));
    else problems.push(...checkPatch(item[0], item[1]?.patches || [], docs, acks));
  }
  log({ tool, sources, ok: !problems.length, problems, agent: input.agent_type });
  if (problems.length) deny(`Blocked by the topic-uniqueness hook:\n- ${problems.join("\n- ")}`);
  if (validateMode) console.log(`OK: no topic conflicts (checked against: ${sources.join(" + ")}).`);
  process.exit(0);
}

async function cli() {
  const arg = (f) => {
    const i = process.argv.indexOf(f);
    return i > -1 ? process.argv[i + 1] : undefined;
  };
  const title = arg("--check") || "";
  const key = arg("--topic") || kebab(title);
  const { docs, sources } = await loadIndex();
  const rows = docs
    .filter(isCourseDoc)
    .map((d) => ({
      id: d._id,
      type: d._type,
      title: d.title,
      topicKey: keyOf(d),
      version: d.version ?? null,
      slug: d.slug,
      exact: keyOf(d) === key,
      similarity: Number(Math.max(jaccard(`${title} ${key.replace(/-/g, " ")}`, `${d.title} ${keyOf(d).replace(/-/g, " ")}`), jaccard(key.replace(/-/g, " "), keyOf(d).replace(/-/g, " "))).toFixed(2)),
    }))
    .filter((r) => r.exact || r.similarity >= SIMILAR)
    .sort((a, b) => Number(b.exact) - Number(a.exact) || b.similarity - a.similarity);
  const verdict = rows.some((r) => r.exact) ? "UPDATE" : rows.length ? "REVIEW" : sources.length ? "NEW" : "UNKNOWN";
  console.log(JSON.stringify({ topicKey: key, verdict, sources, matches: rows }, null, 2));
}

// --validate <file>: run the hook's rules on a saved tool call
// ({"tool_name": "...create_documents", "tool_input": {...}}) before making
// it. Exit 0 = allowed, exit 2 = refused (reason on stderr). The pipeline's
// agents run this themselves, so the rules hold even where the hook is not loaded.
const validateAt = process.argv.indexOf("--validate");
const validateMode = validateAt > -1;
if (process.argv.includes("--check")) cli();
else if (validateMode) hook(process.argv[validateAt + 1]);
else hook();
