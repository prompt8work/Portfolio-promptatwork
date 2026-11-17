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
    { name: "resources", title: "Downloads" },
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required(), group: "card" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required(), group: "card" }),
    defineField({ name: "order", type: "number", description: "Lower comes first", group: "card" }),
    defineField({
      name: "topicKey",
      title: "Topic key",
      type: "string",
      description: "Unique lower-case, hyphenated topic id (e.g. mcp-server). One course per topic; updates bump the version instead.",
      validation: (r) => r.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "kebab-case" }),
      group: "card",
    }),
    defineField({ name: "version", type: "string", description: 'Current version, e.g. "2.0"', group: "card" }),
    defineField({
      name: "changelog",
      title: "Version history",
      type: "array",
      group: "resources",
      of: [
        defineArrayMember({
          type: "object",
          name: "versionNote",
          fields: [
            defineField({ name: "version", type: "string", validation: (r) => r.required() }),
            defineField({ name: "date", type: "date", validation: (r) => r.required() }),
            defineField({ name: "summary", type: "text", rows: 2 }),
            defineField({ name: "post", title: "Blog post for this version", type: "reference", to: [{ type: "blog" }] }),
          ],
          preview: { select: { title: "version", subtitle: "date" } },
        }),
      ],
    }),
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

    defineField({
      name: "resources",
      title: "Free downloads & links",
      description: "Handbooks, notebooks and related posts learners can open from the course page. Upload a file, or give a link.",
      type: "array",
      group: "resources",
      of: [
        defineArrayMember({
          type: "object",
          name: "courseResource",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({
              name: "kind",
              type: "string",
              options: { list: ["PDF", "Notebook", "Article", "Link"], layout: "radio" },
              initialValue: "PDF",
            }),
            defineField({ name: "meta", type: "string", description: 'Short detail, e.g. "67 pages · 1.4 MB"' }),
            defineField({ name: "file", type: "file", description: "Upload for a download" }),
            defineField({ name: "url", type: "url", description: "Or a link (site paths like /blog/my-post are allowed)", validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https"] }) }),
          ],
          validation: (r) =>
            r.custom((v: { file?: unknown; url?: string } | undefined) => (v?.file || v?.url ? true : "Add a file or a link")),
          preview: { select: { title: "title", subtitle: "kind" } },
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
