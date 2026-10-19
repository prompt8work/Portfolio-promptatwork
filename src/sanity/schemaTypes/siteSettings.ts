import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton (_id "site-settings"): who the site is about and how it
// describes itself everywhere — contact details, brand, footer, default
// SEO and the structured-data (JSON-LD) facts. Page-specific copy lives in
// "Home page" and "Page" documents.
export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "person", title: "Person", default: true },
    { name: "brand", title: "Brand & footer" },
    { name: "seo", title: "SEO & structured data" },
    { name: "tools", title: "AI tools" },
  ],
  fields: [
    defineField({ name: "personName", title: "Name", type: "string", group: "person", validation: (r) => r.required() }),
    defineField({ name: "personNameCaps", title: "Name (capitals, for documents)", type: "string", group: "person" }),
    defineField({ name: "personAlternateNames", title: "Alternate names", type: "array", of: [{ type: "string" }], group: "person" }),
    defineField({ name: "jobTitle", title: "Current job title", type: "string", group: "person" }),
    defineField({ name: "jobTitles", title: "Other job titles (structured data)", type: "array", of: [{ type: "string" }], group: "person" }),
    defineField({ name: "occupations", title: "Occupations (structured data)", type: "array", of: [{ type: "string" }], group: "person" }),
    defineField({ name: "email", type: "string", group: "person", validation: (r) => r.required() }),
    defineField({ name: "linkedin", type: "string", description: 'Without https://, e.g. "linkedin.com/in/…"', group: "person" }),
    defineField({ name: "github", type: "string", description: 'Without https://, e.g. "github.com/…"', group: "person" }),
    defineField({ name: "location", title: "Location (display)", type: "string", description: 'e.g. "Indore, M.P."', group: "person" }),
    defineField({
      name: "address",
      type: "object",
      group: "person",
      fields: [
        defineField({ name: "city", type: "string" }),
        defineField({ name: "region", type: "string" }),
        defineField({ name: "countryCode", type: "string", description: 'ISO code, e.g. "IN"' }),
        defineField({ name: "countryName", type: "string" }),
      ],
    }),

    defineField({ name: "brandName", type: "string", group: "brand", validation: (r) => r.required() }),
    defineField({ name: "brandAlternateNames", type: "array", of: [{ type: "string" }], group: "brand" }),
    defineField({ name: "footerBlurb", type: "text", rows: 2, group: "brand" }),
    defineField({ name: "footerCopyright", type: "string", description: "The line after ©", group: "brand" }),

    defineField({ name: "defaultTitle", title: "Default page title", type: "string", group: "seo" }),
    defineField({ name: "defaultDescription", title: "Default meta description", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "keywords", title: "Site keywords", type: "array", of: [{ type: "string" }], group: "seo" }),
    defineField({
      name: "toolKeywords",
      title: "Tools for keyword pairs",
      type: "array",
      of: [{ type: "string" }],
      description: 'Each becomes "<tool> training" and "<tool> expert in <city>".',
      group: "seo",
    }),
    defineField({ name: "personDescription", title: "Person description (structured data)", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "personKnowsAbout", title: "Person knows about", type: "array", of: [{ type: "string" }], group: "seo" }),
    defineField({ name: "organizationDescription", title: "Business description (structured data)", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "organizationKnowsAbout", title: "Business knows about", type: "array", of: [{ type: "string" }], group: "seo" }),
    defineField({ name: "services", title: "Services offered (structured data)", type: "array", of: [{ type: "string" }], group: "seo" }),
    defineField({
      name: "llmsTxt",
      title: "llms.txt",
      type: "text",
      rows: 20,
      description:
        "The /llms.txt summary for AI assistants, in Markdown. Placeholders: {{url:/path}} (full link), {{linkedin}}, {{github}}, {{tools}} (the AI tools list).",
      group: "seo",
    }),

    defineField({
      name: "aiTools",
      title: "AI tools I train teams on",
      type: "array",
      group: "tools",
      of: [
        defineArrayMember({
          type: "object",
          name: "aiToolGroup",
          fields: [
            defineField({ name: "category", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({ name: "tools", type: "array", of: [{ type: "string" }] }),
          ],
          preview: { select: { title: "category" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
