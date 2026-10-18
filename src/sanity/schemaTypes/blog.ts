import { defineField, defineType } from "sanity";
import { cardImageMetaField, coverImageField } from "./cardImage";
import { diagramsField } from "./processDiagram";
import { diagramPlacements } from "./diagramPlacements";

// PRD §65 fields exactly. `body` is plain text, not portable text — every
// other long-form field in this codebase (project overview/solution/etc.)
// is plain text too, and adding rich-text rendering would mean a new
// dependency (@portabletext/react) not otherwise needed in this phase.
export default defineType({
  name: "blog",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 2, validation: (r) => r.required() }),
    coverImageField,
    cardImageMetaField,
    defineField({ name: "body", type: "text", validation: (r) => r.required() }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "author", type: "string", initialValue: "Niharika Dhande" }),
    defineField({ name: "readingTime", type: "string", description: "e.g. \"6 min read\"" }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "seoTitle", type: "string" }),
    defineField({ name: "seoDescription", type: "text", rows: 2 }),
    diagramsField(diagramPlacements.blog, { inlineNote: true }),
    defineField({
      name: "relatedContent",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "tool" }, { type: "prompt" }, { type: "experiment" }, { type: "automation" }, { type: "training" }] }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
