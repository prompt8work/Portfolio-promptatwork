import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton by convention (_id "portfolio-settings"): the /portfolio landing
// copy plus the content both portfolio profiles show identically — the
// "Services I offer" cards, earlier roles and credentials — so it is
// edited once rather than kept in sync across two documents.
export default defineType({
  name: "portfolioSettings",
  title: "Portfolio settings",
  type: "document",
  fields: [
    defineField({ name: "landingEyebrow", type: "string" }),
    defineField({ name: "landingTitle", type: "string", validation: (r) => r.required() }),
    defineField({ name: "landingIntro", type: "text", rows: 2 }),

    defineField({ name: "servicesEyebrow", type: "string" }),
    defineField({ name: "servicesTitle", type: "string" }),
    defineField({ name: "servicesIntro", type: "string" }),
    defineField({
      name: "services",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "service",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({
              name: "profile",
              type: "reference",
              to: [{ type: "portfolioProfile" }],
              description: "The portfolio page this service belongs to — marked 'You are here' on that page.",
            }),
            defineField({ name: "anchor", type: "string", description: "Optional section on that page, e.g. workshops" }),
            defineField({ name: "linkLabel", type: "string" }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),

    defineField({
      name: "earlierRoles",
      type: "array",
      description: "Compact list under each profile's experience timeline.",
      of: [
        defineArrayMember({
          type: "object",
          name: "earlierRole",
          fields: [
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
            defineField({ name: "company", type: "string", validation: (r) => r.required() }),
            defineField({ name: "period", type: "string" }),
          ],
          preview: { select: { title: "role", subtitle: "company" } },
        }),
      ],
    }),
    defineField({ name: "credentials", type: "array", of: [{ type: "string" }] }),
  ],
  preview: { prepare: () => ({ title: "Portfolio settings" }) },
});
