import { defineArrayMember, defineField, defineType } from "sanity";
import { cardImageField, cardImageMetaField } from "./cardImage";

// A workshop or multi-format course shown on /training, /training/<slug>,
// the home page and the AI Enablement portfolio. Cohort courses with
// online registration are the separate "Training" type. Write only what
// has happened or is offered (Docs/design/content-guidelines.md).

export const trainingCategoryOptions = [
  { title: "Non-technical", value: "Non-technical" },
  { title: "Technical", value: "Technical" },
  { title: "Tech + non-tech", value: "Tech + non-tech" },
];

const strings = () => ({ type: "array" as const, of: [{ type: "string" as const }] });

const capstone = defineField({
  name: "capstone",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "resumeLine", type: "string" }),
  ],
});

export default defineType({
  name: "workshop",
  title: "Workshop / course",
  type: "document",
  groups: [
    { name: "card", title: "Card & hero", default: true },
    { name: "outline", title: "Outline" },
    { name: "programs", title: "Programs" },
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required(), group: "card" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required(), group: "card" }),
    defineField({ name: "order", type: "number", description: "Lower comes first", group: "card" }),
    defineField({
      name: "category",
      type: "string",
      options: { list: trainingCategoryOptions, layout: "radio" },
      validation: (r) => r.required(),
      group: "card",
    }),
    defineField({ name: "coverTitle", type: "string", description: 'Cover headline; wrap words in *stars* to highlight them', group: "card" }),
    defineField({ name: "coverVariant", type: "number", description: "Cover artwork, 1–9", validation: (r) => r.min(1).max(9), group: "card" }),
    defineField({
      name: "tone",
      type: "string",
      options: { list: ["cyan", "green", "violet"], layout: "radio" },
      group: "card",
    }),
    defineField({ name: "tags", ...strings(), group: "card" }),
    defineField({ name: "highlights", ...strings(), group: "card" }),
    defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.required(), group: "card" }),
    defineField({ name: "idealFor", title: "Ideal for", ...strings(), group: "card" }),
    { ...cardImageField, group: "card" },
    { ...cardImageMetaField, group: "card" },

    defineField({
      name: "sessionFormat",
      type: "object",
      group: "outline",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "intro", type: "text", rows: 2 }),
        defineField({
          name: "parts",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "sessionPart",
              fields: [
                defineField({ name: "part", type: "string" }),
                defineField({ name: "time", type: "string" }),
                defineField({ name: "what", type: "text", rows: 2 }),
              ],
              preview: { select: { title: "part", subtitle: "time" } },
            }),
          ],
        }),
        defineField({ name: "outcome", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "modules",
      title: "Module groups",
      type: "array",
      group: "outline",
      of: [
        defineArrayMember({
          type: "object",
          name: "moduleGroup",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "note", type: "string" }),
            defineField({ name: "modules", ...strings() }),
          ],
          preview: { select: { title: "title", subtitle: "note" } },
        }),
      ],
    }),

    defineField({ name: "timelinesIntro", title: "Timelines intro", type: "text", rows: 2, group: "programs" }),
    defineField({
      name: "programs",
      title: "Ways to take it",
      type: "array",
      group: "programs",
      of: [
        defineArrayMember({
          type: "object",
          name: "program",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "mode", type: "string" }),
            defineField({ name: "schedule", type: "string" }),
            defineField({ name: "duration", type: "string" }),
            defineField({ name: "sessions", title: "Sessions · hours", type: "string", description: 'e.g. "MWF 48 sessions, 84 hrs · TT 36 sessions, 60 hrs"' }),
            defineField({ name: "projects", type: "string" }),
            defineField({ name: "summary", type: "string" }),
            defineField({
              name: "columns",
              title: "Timeline column headings",
              ...strings(),
              validation: (r) => r.length(3),
            }),
            defineField({
              name: "blocks",
              title: "Timeline",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "timelineBlock",
                  fields: [
                    defineField({ name: "title", type: "string" }),
                    defineField({
                      name: "rows",
                      type: "array",
                      of: [
                        defineArrayMember({
                          type: "object",
                          name: "timelineRow",
                          fields: [
                            defineField({ name: "label", type: "string" }),
                            defineField({ name: "concept", type: "string" }),
                            defineField({ name: "practical", type: "string" }),
                          ],
                          preview: { select: { title: "label", subtitle: "concept" } },
                        }),
                      ],
                    }),
                    capstone,
                  ],
                  preview: { select: { title: "title" } },
                }),
              ],
            }),
          ],
          preview: { select: { title: "name", subtitle: "duration" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});
