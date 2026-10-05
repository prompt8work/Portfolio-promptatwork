import { defineArrayMember, defineField, defineType } from "sanity";

// AI Lab → Engineering (src/app/ai-lab/engineering/page.tsx). One document
// per capability area (master content doc §13). The area only holds its own
// text; its evidence is every published project, automation, prompt,
// experiment or tool that tags it in `engineeringAreas`. So publishing a
// tagged entry adds it to the Engineering page with no code change, and an
// area with no evidence is left off the page (§32: no capability listed
// without something concrete behind it).
export default defineType({
  name: "engineeringArea",
  title: "Engineering Area",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Also the page anchor, e.g. /ai-lab/engineering#rag-retrieval.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Position on the page (1 = first). The \"01 — TITLE\" label is built from it.",
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      description: "What this capability covers, in facts from the linked work. Update it when new evidence adds something.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      title: "Skills",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Short tags shown under the description.",
    }),
  ],
  orderings: [{ title: "Page order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", order: "order" },
    prepare: ({ title, order }) => ({ title, subtitle: order ? `Area ${order}` : undefined }),
  },
});

/**
 * The tag on a content entry that makes it evidence for Engineering areas.
 * Shared by project, automation, prompt, experiment and tool.
 */
export const engineeringAreasField = defineField({
  name: "engineeringAreas",
  title: "Engineering areas",
  description:
    "Capability areas this entry proves. It is listed as evidence under each one on /ai-lab/engineering once published. Tag only what the work actually demonstrates.",
  type: "array",
  of: [defineArrayMember({ type: "reference", to: [{ type: "engineeringArea" }] })],
});
