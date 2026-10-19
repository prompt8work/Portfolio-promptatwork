import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton (_id "cover-letter"): the printable /cover-letter page.
export default defineType({
  name: "coverLetter",
  title: "Cover letter",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", type: "string" }),
    defineField({ name: "seoDescription", type: "text", rows: 2 }),
    defineField({ name: "headerTitle", title: "Title under your name", type: "string" }),
    defineField({ name: "salutation", type: "string" }),
    defineField({ name: "opening", type: "text", rows: 4 }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "letterSection",
          fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "content", type: "text", rows: 5 })],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
    defineField({ name: "closing", type: "text", rows: 3 }),
    defineField({ name: "callToAction", type: "text", rows: 3 }),
    defineField({ name: "signOff", type: "string", description: 'e.g. "Sincerely"' }),
    defineField({ name: "signatureName", type: "string" }),
    defineField({ name: "signatureTitle", type: "string" }),
    defineField({
      name: "attachments",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "attachment",
          fields: [defineField({ name: "name", type: "string" }), defineField({ name: "description", type: "string" })],
          preview: { select: { title: "name", subtitle: "description" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Cover letter" }) },
});
