import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton (_id "home-page"): every piece of copy on the homepage. The
// sections' data (courses, AI Lab sections, posts, videos, testimonials)
// comes from their own documents; this holds the words around them.

const cta = defineArrayMember({
  type: "object",
  name: "cta",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

const sectionHeading = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    group: "sections",
    fields: [defineField({ name: "eyebrow", type: "string" }), defineField({ name: "title", type: "string" })],
  });

export default defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "heroCard", title: "Hero card" },
    { name: "about", title: "Meet the instructor" },
    { name: "sections", title: "Section headings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "seoTitle", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", type: "text", rows: 3, group: "seo" }),

    defineField({ name: "heroTag", title: "Tag", type: "string", group: "hero" }),
    defineField({
      name: "heroIdentity",
      title: "Identity line (the page's H1)",
      type: "string",
      description: "Name, every role and the city in plain text, for search.",
      group: "hero",
    }),
    defineField({ name: "heroDisplayLead", title: "Display headline", type: "string", group: "hero" }),
    defineField({ name: "heroDisplayAccent", title: "Display headline, gradient part", type: "string", group: "hero" }),
    defineField({ name: "heroLead", title: "Lead paragraph", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "heroCtas", title: "Buttons", type: "array", of: [cta], group: "hero" }),
    defineField({ name: "heroPersonRole", title: "Role under your name", type: "string", group: "hero" }),
    defineField({ name: "credentialValue", type: "string", description: 'e.g. "10+ years"', group: "hero" }),
    defineField({ name: "credentialLabel", type: "string", group: "hero" }),
    defineField({ name: "heroChipTitle", title: "Floating chip title", type: "string", group: "hero" }),
    defineField({ name: "heroChipMeta", title: "Floating chip label", type: "string", group: "hero" }),

    defineField({ name: "heroCardTitle", title: "Title", type: "string", group: "heroCard" }),
    defineField({ name: "heroCardMeta", title: "Label", type: "string", group: "heroCard" }),
    defineField({ name: "heroCardBadge", title: "Badge", type: "string", group: "heroCard" }),
    defineField({ name: "heroCardCustomer", title: "Sample customer message", type: "string", group: "heroCard" }),
    defineField({ name: "heroCardReply", title: "Sample reply", type: "string", group: "heroCard" }),
    defineField({
      name: "heroCardSteps",
      title: "Workflow steps",
      type: "array",
      group: "heroCard",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [defineField({ name: "label", type: "string" }), defineField({ name: "note", type: "string" })],
          preview: { select: { title: "label", subtitle: "note" } },
        }),
      ],
    }),
    defineField({ name: "heroCardFooter", title: "Footer label", type: "string", group: "heroCard" }),

    defineField({ name: "aboutEyebrow", title: "Eyebrow", type: "string", group: "about" }),
    defineField({ name: "aboutHeading", title: "Heading", type: "string", group: "about" }),
    defineField({ name: "aboutParagraphs", title: "Paragraphs", type: "array", of: [{ type: "text" }], group: "about" }),
    defineField({ name: "aboutBadgeValue", title: "Photo badge value", type: "string", group: "about" }),
    defineField({ name: "aboutBadgeLabel", title: "Photo badge label", type: "string", group: "about" }),
    defineField({ name: "aboutChips", title: "Photo chips", type: "array", of: [{ type: "string" }], group: "about" }),
    defineField({
      name: "aboutFacts",
      title: "Facts row",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "fact",
          fields: [defineField({ name: "title", type: "string" }), defineField({ name: "sub", type: "string" })],
          preview: { select: { title: "title", subtitle: "sub" } },
        }),
      ],
    }),
    defineField({ name: "aboutCtas", title: "Buttons", type: "array", of: [cta], group: "about" }),

    sectionHeading("coursesHeading", "Courses"),
    sectionHeading("aiLabHeading", "AI Lab"),
    sectionHeading("testimonialsHeading", "Testimonials"),
    sectionHeading("contentHeading", "Writing & videos"),
    defineField({ name: "linkedinTitle", title: "LinkedIn row title", type: "string", group: "sections" }),
    defineField({ name: "linkedinText", title: "LinkedIn row text", type: "string", group: "sections" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
