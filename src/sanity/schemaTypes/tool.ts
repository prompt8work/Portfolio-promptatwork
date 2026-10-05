import { defineField, defineType } from "sanity";
import { diagramsField } from "./processDiagram";
import { diagramPlacements } from "./diagramPlacements";
import { engineeringAreasField } from "./engineeringArea";

// PRD §66 (base schema) + §24 (Tool Explorer detail fields), evolved per
// Docs/development-plan/04.1-ai-lab-content-tools.md into a Tool Research &
// Learning Repository. All original fields are preserved — nothing here
// was renamed or removed except `relatedProjects` (see below) — new
// fields are additive and optional, so the 4 already-seeded tool
// documents keep rendering exactly as before until research content is
// added to them.
const contentTypes = ["Tool", "Feature", "Concept", "Technology", "Platform", "Workflow", "Integration"];
const researchStatuses = ["Draft", "Researching", "Reviewed", "Published", "Needs Update", "Archived"];
const resourceTypes = ["Handbook", "Notebook", "Cheat Sheet", "Worksheet", "Reference Guide", "Tutorial", "Assignment", "Other"];

export default defineType({
  name: "tool",
  title: "AI Tool",
  type: "document",
  fields: [
    // --- Basic Information (unchanged) ---
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "logo", type: "image" }),
    defineField({
      name: "type",
      title: "Content Type",
      type: "string",
      description: "04.1 §5 — not every entry is a commercial software product.",
      options: { list: contentTypes },
      initialValue: "Tool",
    }),
    defineField({ name: "category", type: "string", description: "e.g. \"LLM Provider\", \"Image Generation\"" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], description: "04.1 §23 — used for listing search/filter." }),
    defineField({ name: "description", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "officialUrl", type: "url" }),
    defineField({ name: "pricing", type: "string" }),

    // --- Research (04.1 §6) ---
    defineField({ name: "overview", type: "text", description: "Quick Overview: what is it, who's it for, what problem does it solve, why relevant." }),
    defineField({ name: "whatItDoes", type: "text" }),
    defineField({ name: "whyExplored", type: "text" }),
    defineField({
      name: "researchContent",
      type: "text",
      description: "04.1 §6.3 Complete Research — long-form: capabilities, features, architecture, integrations, security, learning curve, etc.",
    }),
    defineField({ name: "useCases", title: "Best Use Cases", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "practicalScenarios",
      type: "text",
      description: "04.1 §11 — a general 'someone could do X' scenario. Distinct from Experiments, which are things actually tested.",
    }),
    defineField({ name: "strengths", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "limitations",
      title: "Limitations & Less-Suitable Scenarios",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "myExperience",
      type: "text",
      description: "Firsthand account — kept for existing content. New tools should prefer a linked Experiment document instead (04.1 §29/§34).",
    }),

    // --- Review Information (04.1 §19–21) ---
    defineField({ name: "researchStatus", type: "string", options: { list: researchStatuses }, initialValue: "Published" }),
    defineField({ name: "lastUpdated", type: "datetime", description: "04.1 §20 — AI tools change fast; distinct from publishedAt." }),
    defineField({ name: "reviewedVersion", type: "string" }),
    defineField({ name: "lastReviewed", type: "string", description: "Free text (e.g. \"September 2026\") — not every tool exposes a meaningful version." }),

    // --- Media & Relationships ---
    defineField({
      name: "relatedVideos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "video" }] }],
      description: "04.1 §33 — reference existing Video docs rather than duplicating YouTube metadata.",
    }),
    defineField({
      name: "resources",
      title: "Learning Resources",
      type: "array",
      description: "04.1 §13–16 — student handbooks, notebooks, cheat sheets, etc.",
      of: [
        {
          type: "object",
          name: "resource",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "resourceType", type: "string", options: { list: resourceTypes }, validation: (r) => r.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({ name: "file", type: "file", validation: (r) => r.required() }),
            defineField({ name: "version", type: "string" }),
            defineField({ name: "publishedAt", type: "datetime" }),
            defineField({ name: "updatedAt", type: "datetime" }),
          ],
          preview: { select: { title: "title", subtitle: "resourceType" } },
        },
      ],
    }),
    defineField({
      name: "sources",
      title: "Source References",
      type: "array",
      description: "04.1 §27 — official docs, release notes, papers, etc. Optional.",
      of: [
        {
          type: "object",
          name: "source",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label" } },
        },
      ],
    }),
    diagramsField(diagramPlacements.tool),
    engineeringAreasField,
    defineField({
      name: "relatedContent",
      type: "array",
      description: "04.1 §18 — the same unified Related Content model every other content type uses (replaces the old project-only relatedProjects field, which was never populated on any existing document). Videos are intentionally not a valid reference here — use relatedVideos above (§33: reference, don't duplicate, and RelatedContent's renderer has no internal route for a video to link to).",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "tool" }, { type: "prompt" }, { type: "experiment" }, { type: "automation" }, { type: "blog" }, { type: "training" }] }],
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "logo" },
  },
});
