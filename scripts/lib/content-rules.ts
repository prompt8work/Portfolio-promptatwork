/**
 * Rules every content draft must pass before it can be pushed to Sanity
 * (Docs/design/content-guidelines.md). Used by scripts/check-content.ts and
 * scripts/push-draft.ts, and by the /case-study skill. Pure — no network.
 *
 * Errors block a push. Warnings are shown but don't block.
 */
import { diagramPlacements } from "../../src/sanity/schemaTypes/diagramPlacements";

export const contentTypes = ["project", "blog", "tool", "experiment", "prompt", "automation"] as const;
export type ContentType = (typeof contentTypes)[number];

export type DraftStep = {
  label: string;
  detail?: string;
  kind?: string;
  metric?: string;
  before?: string;
  after?: string;
  edgeLabel?: string;
};

export type DraftDiagram = {
  key: string;
  title: string;
  kind: "flow" | "loop" | "analogy" | "advanced";
  placement: string;
  caption: string;
  steps?: DraftStep[];
  loopBackTo?: number;
  loopLabel?: string;
  concept?: string;
  analogy?: string;
  pairs?: { concept: string; analogy: string }[];
  mermaid?: string;
};

/** The file format the /case-study skill writes to Docs/content-drafts/<slug>.json. */
export type Draft = {
  type: ContentType;
  slug: string;
  /** Path to the author's raw input, saved alongside the draft. Every number must trace back to it. */
  source: string;
  fields: Record<string, unknown>;
  diagrams: DraftDiagram[];
  relatedContent?: { type: string; slug: string }[];
  /** project only: other entries documenting parts of the same project, in reading order. */
  parts?: { type: string; slug: string }[];
  /**
   * Not blog: slugs of the Engineering areas this entry proves (Sanity
   * `engineeringArea`, e.g. "rag-retrieval"). Once published, the entry is
   * listed as evidence under each area on /ai-lab/engineering.
   */
  engineeringAreas?: string[];
  /** Numbers that legitimately don't appear in the source (e.g. a year the author confirmed in chat), with why. */
  numberAllowlist?: { value: string; reason: string }[];
  /** Gaps the skill had to ask about. Must be empty before a push. */
  openQuestions?: string[];
};

export type Report = { errors: string[]; warnings: string[] };

// Keep in sync with validation: (r) => r.required() in src/sanity/schemaTypes/*.ts.
const requiredFields: Record<ContentType, string[]> = {
  project: ["title", "summary"],
  blog: ["title", "excerpt", "body", "publishedAt"],
  tool: ["name", "description"],
  experiment: ["title", "objective"],
  prompt: ["title", "category", "prompt"],
  automation: ["title", "description"],
};

// Minimum diagram set per type. A case study explains a whole application,
// so it carries the full set; the others need at least a process flow.
const minimums: Record<
  ContentType,
  { total: number; needs: DraftDiagram["kind"][]; recommend: DraftDiagram["kind"][] }
> = {
  project: { total: 3, needs: ["flow", "advanced", "analogy"], recommend: [] },
  blog: { total: 2, needs: ["flow"], recommend: ["analogy"] },
  tool: { total: 1, needs: ["flow"], recommend: ["analogy"] },
  experiment: { total: 1, needs: ["flow"], recommend: ["loop"] },
  prompt: { total: 1, needs: ["flow"], recommend: [] },
  automation: { total: 1, needs: [], recommend: ["advanced"] },
};

const stepKinds = new Set(["trigger", "input", "ai", "decision", "action", "store", "human", "output"]);
const mermaidStarts =
  /^(flowchart|graph|sequenceDiagram|stateDiagram(-v2)?|classDiagram|erDiagram|journey|timeline|mindmap|quadrantChart|gitGraph)\b/;
const placeholder = /\b(lorem|ipsum|TBD|TODO|FIXME|XXX)\b|\[insert/i;

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

/** Numbers that carry meaning: 2+ digits, decimals, or anything with %, x, ms, s, k, +. Single bare digits are structural. */
function significantNumbers(text: string): string[] {
  const found = text.match(/\d[\d,]*(?:\.\d+)?\s?(?:%|ms\b|s\b|x\b|k\b|\+)?/g) ?? [];
  return found
    .map((n) => n.trim())
    .filter((n) => /\d{2,}|\.\d|%|ms|x|k|\+/.test(n) || /\ds$/.test(n))
    .map((n) => n.replace(/[,\s]/g, "").replace(/(%|ms|s|x|k|\+)$/, ""));
}

const isFlow = (d: DraftDiagram) => d.kind === "flow" || d.kind === "loop";

export function checkDraft(draft: Draft, sourceText: string | null): Report {
  const errors: string[] = [];
  const warnings: string[] = [];
  const type = draft.type;

  if (!contentTypes.includes(type)) {
    errors.push(`Unknown type "${type}". Use one of: ${contentTypes.join(", ")}.`);
    return { errors, warnings };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug ?? ""))
    errors.push(`Slug "${draft.slug}" must be lowercase-kebab-case.`);

  // --- fields ------------------------------------------------------------
  for (const f of requiredFields[type]) {
    const v = draft.fields?.[f];
    if (v === undefined || v === null || (typeof v === "string" && !v.trim()))
      errors.push(`Missing required field "${f}".`);
  }
  if (type === "project") {
    const vis = draft.fields.visibility;
    if (!["public", "generalized", "private"].includes(String(vis)))
      errors.push('Case studies need "visibility": "public" | "generalized" | "private" — ask the author if unsure.');
    if (vis !== "public" && !draft.fields.confidentialityNote)
      errors.push('A "generalized" or "private" case study needs a "confidentialityNote".');
  }
  if (type === "blog" && draft.engineeringAreas?.length)
    errors.push('Blog posts can\'t carry "engineeringAreas"; tag the AI Lab entries the post is about instead.');
  if (type !== "blog" && !draft.engineeringAreas?.length)
    warnings.push(
      'No "engineeringAreas": this entry won\'t appear as evidence on /ai-lab/engineering. Tag the areas the work proves (e.g. ["rag-retrieval"]), or leave it empty on purpose.',
    );
  for (const slug of draft.engineeringAreas ?? [])
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`Engineering area "${slug}" must be a lowercase-kebab-case slug.`);
  for (const s of allStrings(draft.fields))
    if (placeholder.test(s)) errors.push(`Placeholder text left in: "${s.slice(0, 60)}…"`);

  // --- diagrams ----------------------------------------------------------
  const diagrams = draft.diagrams ?? [];
  const min = minimums[type];
  if (diagrams.length < min.total)
    errors.push(`A ${type} needs at least ${min.total} diagram${min.total > 1 ? "s" : ""}; found ${diagrams.length}.`);
  for (const k of min.needs) {
    const ok = k === "flow" ? diagrams.some(isFlow) : diagrams.some((d) => d.kind === k);
    if (!ok) errors.push(`A ${type} needs at least one "${k === "flow" ? "flow or loop" : k}" diagram.`);
  }
  for (const k of min.recommend)
    if (!diagrams.some((d) => d.kind === k)) warnings.push(`Consider adding a "${k}" diagram to this ${type}.`);
  if (
    type === "project" &&
    sourceText &&
    significantNumbers(sourceText).length > 0 &&
    !diagrams.some((d) => d.steps?.some((s) => s.metric || s.after))
  )
    errors.push(
      "The source has measured results, so the case study needs a data-driven flow (steps with metric or before/after).",
    );

  const allowed = new Set(["top", ...(diagramPlacements[type] ?? []).map((p) => p.value)]);
  const keys = new Set<string>();
  diagrams.forEach((d, i) => {
    const at = `Diagram ${i + 1} ("${d.title ?? d.key}")`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.key ?? "")) errors.push(`${at}: key must be lowercase-kebab-case.`);
    if (keys.has(d.key)) errors.push(`${at}: duplicate key "${d.key}".`);
    keys.add(d.key);
    if (!d.title?.trim()) errors.push(`${at}: needs a title.`);
    if (!d.caption?.trim()) errors.push(`${at}: needs a caption explaining it in words.`);
    else if (d.caption.length > 320)
      warnings.push(`${at}: caption is long — keep it to one or two sentences and put detail in the text.`);
    if (!allowed.has(d.placement))
      errors.push(`${at}: placement "${d.placement}" isn't valid for ${type}. Use: ${[...allowed].join(", ")}.`);

    if (isFlow(d)) {
      const n = d.steps?.length ?? 0;
      if (n < 2) errors.push(`${at}: a flow needs at least 2 steps.`);
      if (n > 9) warnings.push(`${at}: ${n} steps is a lot — split it into an overview flow and a detail flow.`);
      d.steps?.forEach((s, j) => {
        if (!s.label?.trim()) errors.push(`${at}, step ${j + 1}: needs a label.`);
        if (s.label && s.label.length > 48)
          warnings.push(`${at}, step ${j + 1}: label is long — move detail into "detail".`);
        if (s.kind && !stepKinds.has(s.kind)) errors.push(`${at}, step ${j + 1}: unknown kind "${s.kind}".`);
        if (s.after && !s.before)
          warnings.push(`${at}, step ${j + 1}: "after" without "before" — use "metric" instead.`);
      });
      if (d.kind === "loop" && (!d.loopBackTo || d.loopBackTo < 1 || d.loopBackTo >= n))
        errors.push(`${at}: loopBackTo must be a step number between 1 and ${n - 1}.`);
      if (d.kind === "loop" && !d.loopLabel)
        warnings.push(`${at}: add a loopLabel saying what sends the process round again.`);
    }
    if (d.kind === "analogy") {
      if ((d.pairs?.length ?? 0) < 2) errors.push(`${at}: an analogy needs at least 2 concept ↔ analogy pairs.`);
      if (!d.concept || !d.analogy) errors.push(`${at}: an analogy needs both "concept" and "analogy".`);
    }
    if (d.kind === "advanced") {
      const src = d.mermaid?.trim() ?? "";
      if (!src) errors.push(`${at}: needs Mermaid source.`);
      else if (!mermaidStarts.test(src))
        errors.push(`${at}: Mermaid source must start with a diagram type (flowchart TD, sequenceDiagram, …).`);
      if (/^\s*(style|classDef|linkStyle)\b/m.test(src))
        warnings.push(`${at}: remove style/classDef lines — the site theme colours Mermaid diagrams.`);
      if (/^(flowchart|graph)\s+LR/.test(src) && src.split("\n").length > 8)
        warnings.push(`${at}: a long left-to-right chart shrinks badly on phones — prefer "flowchart TD".`);
    }
  });

  // Blog: inline markers and "inline" placements must match up.
  if (type === "blog") {
    const body = String(draft.fields.body ?? "");
    const markers = [...body.matchAll(/^\s*\[\[diagram:([a-z0-9-]+)\]\]\s*$/gim)].map((m) => m[1]);
    for (const m of markers) if (!keys.has(m)) errors.push(`Body has [[diagram:${m}]] but no diagram has that key.`);
    for (const d of diagrams)
      if (d.placement === "inline" && !markers.includes(d.key))
        errors.push(`Diagram "${d.key}" is placed inline but the body has no [[diagram:${d.key}]] line.`);
  }

  // --- nothing invented ----------------------------------------------------
  if (sourceText === null) {
    errors.push(`Source file "${draft.source}" not found — save the author's raw input there so claims can be traced.`);
  } else {
    const src = sourceText.replace(/[,\s]/g, "");
    const allow = new Set((draft.numberAllowlist ?? []).map((a) => a.value.replace(/[,\s%+]/g, "")));
    // Dates and URLs aren't claims.
    const notClaims = new Set(["publishedAt", "lastUpdated", "officialUrl"]);
    const claimFields = Object.fromEntries(Object.entries(draft.fields).filter(([k]) => !notClaims.has(k)));
    const text = [...allStrings(claimFields), ...allStrings(diagrams)].join("\n");
    const missing = [...new Set(significantNumbers(text))].filter((n) => !src.includes(n) && !allow.has(n));
    for (const n of missing)
      errors.push(
        `The number "${n}" doesn't appear in the source. Use only the author's figures, or add it to numberAllowlist with the reason.`,
      );
  }

  if (draft.openQuestions?.length)
    errors.push(
      `${draft.openQuestions.length} open question(s) still need the author's answer:\n    - ${draft.openQuestions.join("\n    - ")}`,
    );

  return { errors, warnings };
}

export function formatReport(label: string, r: Report): string {
  const lines = [`${label}: ${r.errors.length} error(s), ${r.warnings.length} warning(s)`];
  r.errors.forEach((e) => lines.push(`  ✖ ${e}`));
  r.warnings.forEach((w) => lines.push(`  ⚠ ${w}`));
  if (!r.errors.length && !r.warnings.length) lines.push("  ✔ All content rules pass.");
  return lines.join("\n");
}
