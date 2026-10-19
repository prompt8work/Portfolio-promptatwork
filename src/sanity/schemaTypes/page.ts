import { defineArrayMember, defineField, defineType } from "sanity";

// One document per site page (_id "page-<key>"): its SEO, its intro
// (eyebrow, title, lead) and any extra named blocks the page shows, e.g.
// the "Training for teams" band on /training. Pages are built in code; this
// holds their words. The Privacy policy's text is the rich-text body.

export const pageKeys = [
  { title: "AI Lab — overview", value: "ai-lab" },
  { title: "AI Lab — Work & case studies", value: "ai-lab-work" },
  { title: "AI Lab — Engineering", value: "ai-lab-engineering" },
  { title: "AI Lab — Automations", value: "ai-lab-automations" },
  { title: "AI Lab — Tools & research", value: "ai-lab-tools" },
  { title: "AI Lab — Experiments", value: "ai-lab-experiments" },
  { title: "AI Lab — Prompt library", value: "ai-lab-prompts" },
  { title: "Courses (/training)", value: "training" },
  { title: "TV (/videos)", value: "videos" },
  { title: "Blog", value: "blog" },
  { title: "Contact", value: "contact" },
  { title: "Testimonials", value: "testimonials" },
  { title: "Portfolio", value: "portfolio" },
  { title: "Privacy policy", value: "privacy" },
  { title: "Page not found (404)", value: "not-found" },
];

const cta = defineArrayMember({
  type: "object",
  name: "cta",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "blocks", title: "Blocks" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "key",
      title: "Page",
      type: "string",
      options: { list: pageKeys },
      readOnly: true,
      validation: (r) => r.required(),
      group: "intro",
    }),
    defineField({ name: "eyebrow", type: "string", group: "intro" }),
    defineField({ name: "tagline", title: "Tag line beside the eyebrow", type: "string", group: "intro" }),
    defineField({ name: "title", type: "string", group: "intro" }),
    defineField({ name: "intro", type: "text", rows: 4, group: "intro" }),
    defineField({ name: "ctas", title: "Buttons", type: "array", of: [cta], group: "intro" }),
    defineField({
      name: "body",
      type: "array",
      group: "intro",
      description: "Rich text for text-only pages (Privacy policy).",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
          ],
          lists: [],
          marks: {
            decorators: [{ title: "Bold", value: "strong" }],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [defineField({ name: "href", type: "string" })],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "blocks",
      title: "Extra blocks",
      type: "array",
      group: "blocks",
      of: [
        defineArrayMember({
          type: "object",
          name: "pageBlock",
          fields: [
            defineField({ name: "key", type: "string", description: "Which block on the page this is, e.g. teams", validation: (r) => r.required() }),
            defineField({ name: "eyebrow", type: "string" }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "text", type: "text", rows: 3 }),
            defineField({
              name: "items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "blockItem",
                  fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text", rows: 2 })],
                  preview: { select: { title: "title", subtitle: "text" } },
                }),
              ],
            }),
            defineField({ name: "ctas", title: "Buttons", type: "array", of: [cta] }),
          ],
          preview: { select: { title: "key", subtitle: "title" } },
        }),
      ],
    }),
    defineField({ name: "seoTitle", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "seoKeywords", type: "array", of: [{ type: "string" }], group: "seo" }),
  ],
  preview: {
    select: { key: "key", title: "title" },
    prepare: ({ key, title }) => ({ title: pageKeys.find((k) => k.value === key)?.title ?? key, subtitle: title }),
  },
});
