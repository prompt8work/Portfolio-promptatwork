import { defineField, defineType } from "sanity";
import { cardImageField, cardImageMetaField } from "./cardImage";

// PRD §69 fields exactly, plus relatedContent[] per the unified content
// relationship model every other Phase 4 type already joined (Phase 4/4.1
// docs both note Training should follow this convention when built).
export default defineType({
  name: "training",
  title: "Training / Course",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", validation: (r) => r.required() }),
    cardImageField,
    cardImageMetaField,
    defineField({ name: "learningOutcomes", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "topics", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "audience", type: "text", rows: 2 }),
    defineField({ name: "duration", type: "string", description: "e.g. \"8 Weeks\"" }),
    defineField({ name: "mode", type: "string", description: "e.g. \"Online\", \"In-person\", \"Hybrid\"" }),
    defineField({ name: "instructor", type: "string" }),
    defineField({ name: "registrationEnabled", type: "boolean", initialValue: true }),
    defineField({
      name: "testimonials",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "quote" } },
        },
      ],
    }),
    defineField({
      name: "relatedContent",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "tool" }, { type: "prompt" }, { type: "experiment" }, { type: "automation" }, { type: "blog" }] }],
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
  preview: {
    select: { title: "title", subtitle: "duration" },
  },
});
