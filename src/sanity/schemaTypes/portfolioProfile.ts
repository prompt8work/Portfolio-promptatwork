import { defineArrayMember, defineField, defineType } from "sanity";

// One document per portfolio page (/portfolio/[slug]): "AI Solutions
// Engineer" for engineering audiences and "AI Enablement Officer &
// Corporate Trainer" for training buyers. Replaces the old Resume singleton
// (Docs/design/poc/*.html are the approved designs).
//
// Every section is optional — the page renders only the ones that have
// content, in a fixed order, so the two profiles can share one template
// while showing different sections. Content shared by both pages
// (services, earlier roles, credentials) lives in portfolioSettings.
//
// Headlines and thumbnail titles accept *asterisks* around the words that
// should be highlighted.

const highlightHint = "Wrap words in *asterisks* to highlight them.";

const ctaFields = [
  defineField({ name: "label", type: "string" }),
  defineField({ name: "href", type: "string", description: "e.g. /contact, /ai-lab or #workshops" }),
  defineField({
    name: "style",
    type: "string",
    options: { list: ["primary", "secondary", "link"], layout: "radio" },
    initialValue: "secondary",
  }),
];

const cta = defineArrayMember({
  type: "object",
  name: "cta",
  fields: ctaFields,
  preview: { select: { title: "label", subtitle: "href" } },
});

const ctaField = (name: string, title?: string) =>
  defineField({ name, title, type: "object", fields: ctaFields, options: { collapsible: true } });

const ctas = (name: string, title?: string) => defineField({ name, title, type: "array", of: [cta] });

const strings = (name: string, title?: string, description?: string) =>
  defineField({ name, title, description, type: "array", of: [{ type: "string" }], options: { layout: "tags" } });

const logoImage = defineArrayMember({
  type: "image",
  name: "logo",
  fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
});

/** eyebrow + title + intro, shared by every section. */
const sectionHead = [
  defineField({ name: "eyebrow", type: "string", description: "Small mono label above the heading" }),
  defineField({ name: "title", type: "string" }),
  defineField({ name: "intro", type: "text", rows: 2 }),
  defineField({ name: "anchorId", type: "string", description: "Optional link target, e.g. workshops → /portfolio/…#workshops" }),
];

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[], group = "sections") =>
  defineField({
    name,
    title,
    type: "object",
    group,
    options: { collapsible: true, collapsed: true },
    fields: [...sectionHead, ...fields],
  });

export default defineType({
  name: "portfolioProfile",
  title: "Portfolio profile",
  type: "document",
  groups: [
    { name: "page", title: "Page", default: true },
    { name: "hero", title: "Hero" },
    { name: "sections", title: "Sections" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "page", description: "e.g. AI Solutions Engineer", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", group: "page", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", group: "page", description: "Position on the /portfolio landing page", initialValue: 0 }),
    defineField({ name: "summary", type: "text", rows: 2, group: "page", description: "Landing-page card text and search description", validation: (r) => r.required() }),
    defineField({ name: "seoTitle", type: "string", group: "page" }),

    // Hero
    defineField({
      name: "heroImage",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),
    defineField({ name: "heroEyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeadline", type: "string", group: "hero", description: highlightHint, validation: (r) => r.required() }),
    defineField({ name: "heroLead", type: "text", rows: 3, group: "hero" }),
    { ...ctas("heroCtas", "Hero buttons"), group: "hero" },
    { ...strings("heroChecks", "Hero checkmarks"), group: "hero" },
    defineField({ name: "heroStripLabel", type: "string", group: "hero", description: "e.g. Trained learners and teams at" }),
    defineField({ name: "heroLogos", type: "array", group: "hero", of: [logoImage], description: "Shown under the strip label (use logos or chips)" }),
    { ...strings("heroChips", "Hero chips", "Shown under the strip label when there are no logos"), group: "hero" },
    defineField({ name: "profileRole", title: "Profile card text", type: "text", rows: 2, group: "hero" }),
    { ...strings("profileTags", "Profile card tags"), group: "hero" },
    { ...ctas("profileCtas", "Profile card buttons"), group: "hero" },

    section("offerings", "Offerings (workshops / solutions)", [
      defineField({
        name: "items",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "offering",
            fields: [
              defineField({ name: "title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "category", type: "string", description: "Filter + badge, e.g. Technical, Build", validation: (r) => r.required() }),
              defineField({ name: "tone", type: "string", options: { list: ["cyan", "green", "violet"] }, initialValue: "cyan" }),
              defineField({ name: "thumbStyle", type: "string", options: { list: ["banner", "terminal"], layout: "radio" }, initialValue: "banner" }),
              defineField({ name: "thumbTitle", type: "string", description: `Banner text. ${highlightHint}`, hidden: ({ parent }) => parent?.thumbStyle === "terminal" }),
              defineField({ name: "thumbVariant", type: "number", description: "Banner colour 1–9", hidden: ({ parent }) => parent?.thumbStyle === "terminal" }),
              strings("thumbTools", "Banner chips"),
              defineField({ name: "snippet", type: "text", rows: 4, description: "Terminal text; lines starting with # are comments", hidden: ({ parent }) => parent?.thumbStyle !== "terminal" }),
              strings("meta"),
              defineField({ name: "description", type: "text", rows: 3 }),
              defineField({ name: "footLabel", type: "string", description: "e.g. Ideal for, Stack" }),
              defineField({ name: "footText", type: "string" }),
              ctaField("link"),
            ],
            preview: { select: { title: "title", subtitle: "category" } },
          }),
        ],
      }),
    ]),

    defineField({
      name: "featuredProject",
      type: "object",
      group: "sections",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 3 }),
        strings("tags"),
        ctaField("link"),
        defineField({
          name: "diagramRows",
          title: "Architecture diagram rows",
          description: "Top to bottom; each row holds 1–3 boxes joined by a down arrow.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "diagramRow",
              fields: [
                defineField({
                  name: "nodes",
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "diagramNode",
                      fields: [
                        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                        defineField({ name: "detail", type: "string" }),
                        defineField({ name: "tone", type: "string", options: { list: ["plain", "source", "core", "output"] }, initialValue: "plain" }),
                      ],
                      preview: { select: { title: "title", subtitle: "detail" } },
                    }),
                  ],
                }),
              ],
              preview: { select: { title: "nodes.0.title" }, prepare: ({ title }) => ({ title: title ?? "Row" }) },
            }),
          ],
        }),
        defineField({ name: "diagramCaption", type: "text", rows: 2 }),
      ],
    }),

    section("projects", "Projects", [
      defineField({
        name: "items",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "projectCard",
            fields: [
              defineField({ name: "kind", type: "string", description: "Small label, e.g. Automation" }),
              defineField({ name: "title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "description", type: "text", rows: 3 }),
              strings("tags"),
              ctaField("link"),
            ],
            preview: { select: { title: "title", subtitle: "kind" } },
          }),
        ],
      }),
      defineField({
        name: "closingCard",
        type: "object",
        description: "Dashed card at the end of the grid, e.g. 'More in AI Lab'",
        fields: [
          defineField({ name: "kind", type: "string" }),
          defineField({ name: "title", type: "string" }),
          defineField({ name: "description", type: "text", rows: 2 }),
          ctaField("link"),
        ],
      }),
    ]),

    section("audience", "Who it's for", [
      defineField({
        name: "panels",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "audiencePanel",
            fields: [
              defineField({ name: "eyebrow", type: "string" }),
              defineField({ name: "title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "intro", type: "string" }),
              strings("points"),
            ],
            preview: { select: { title: "title", subtitle: "eyebrow" } },
          }),
        ],
      }),
    ]),

    section("process", "Process flow", [
      defineField({
        name: "steps",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "processStep",
            fields: [
              defineField({ name: "title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "description", type: "text", rows: 2 }),
            ],
            preview: { select: { title: "title", subtitle: "description" } },
          }),
        ],
      }),
      defineField({ name: "loopNote", type: "string", description: "Feedback-loop line under the steps" }),
    ]),

    section("stack", "Tools & platforms", [
      defineField({
        name: "featured",
        type: "object",
        description: "Full-width highlighted group at the top",
        fields: [
          ...sectionHead,
          defineField({
            name: "items",
            type: "array",
            of: [
              defineArrayMember({
                type: "object",
                name: "stackItem",
                fields: [defineField({ name: "name", type: "string" }), defineField({ name: "detail", type: "string" })],
                preview: { select: { title: "name", subtitle: "detail" } },
              }),
            ],
          }),
          strings("tags"),
        ],
      }),
      defineField({
        name: "groups",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "stackGroup",
            fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), strings("items")],
            preview: { select: { title: "title" } },
          }),
        ],
      }),
    ]),

    section("institutes", "Institutes / training engagements", [
      defineField({
        name: "items",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "institute",
            fields: [
              defineField({ name: "name", type: "string", validation: (r) => r.required() }),
              defineField({ name: "logo", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
              defineField({ name: "period", type: "string", description: "e.g. Technical Trainer · Jul 2010 – May 2013" }),
              defineField({ name: "description", type: "text", rows: 3 }),
              defineField({ name: "highlightLabel", type: "string", description: "e.g. Teams trained" }),
              defineField({ name: "highlightText", type: "string" }),
              strings("tags"),
            ],
            preview: { select: { title: "name", subtitle: "period", media: "logo" } },
          }),
        ],
      }),
    ]),

    section("experience", "Experience", [
      defineField({
        name: "roles",
        type: "array",
        description: "Featured roles, most recent first. Earlier roles and credentials come from Portfolio settings.",
        of: [
          defineArrayMember({
            type: "object",
            name: "portfolioRole",
            fields: [
              defineField({ name: "role", type: "string", validation: (r) => r.required() }),
              defineField({ name: "company", type: "string", validation: (r) => r.required() }),
              defineField({ name: "period", type: "string", description: "e.g. Feb 2024 – Sep 2026", validation: (r) => r.required() }),
              defineField({ name: "major", type: "boolean", description: "Filled timeline dot", initialValue: false }),
              defineField({ name: "highlights", type: "array", of: [{ type: "text", rows: 2 }] }),
            ],
            preview: { select: { title: "role", subtitle: "company" } },
          }),
        ],
      }),
    ]),

    section("whyMe", "Why me", [
      defineField({
        name: "items",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "whyItem",
            fields: [
              defineField({ name: "icon", type: "string", options: { list: ["code", "graduation", "document", "shield", "target"] }, initialValue: "code" }),
              defineField({ name: "title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "description", type: "text", rows: 2 }),
            ],
            preview: { select: { title: "title" } },
          }),
        ],
      }),
    ]),

    defineField({
      name: "ctaBand",
      title: "Contact band",
      type: "object",
      group: "sections",
      options: { collapsible: true, collapsed: true },
      fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text", rows: 2 }), ctas("ctas", "Buttons")],
    }),

    section("faq", "FAQ", [
      defineField({
        name: "items",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "faqItem",
            fields: [
              defineField({ name: "question", type: "string", validation: (r) => r.required() }),
              defineField({ name: "answer", type: "text", rows: 3, validation: (r) => r.required() }),
              ctaField("link"),
            ],
            preview: { select: { title: "question" } },
          }),
        ],
      }),
    ]),
  ],
  orderings: [{ title: "Landing order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "slug.current", media: "heroImage" } },
});
