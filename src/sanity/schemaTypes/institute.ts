import { defineField, defineType } from "sanity";

// An institute or client Niharika has trained for, shown in the
// "Institutes I've trained for" carousel on /training and the AI
// Enablement portfolio.
export default defineType({
  name: "institute",
  title: "Institute",
  type: "document",
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", description: "Lower comes first" }),
    defineField({
      name: "logo",
      type: "image",
      description: "Shown on a white plate in both themes.",
      fields: [defineField({ name: "alt", type: "string" })],
    }),
    defineField({ name: "period", type: "string", description: 'e.g. "6-day programme · Sep 2026"' }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "highlightLabel", type: "string" }),
    defineField({ name: "highlightText", type: "string" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
  ],
  preview: { select: { title: "name", subtitle: "period", media: "logo" } },
});
