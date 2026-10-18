import { defineField, defineType } from "sanity";

// YouTube Video content type (PRD §30 content types, §35 sync fields,
// §87 duplicate-prevention fields). `source`/`externalId`/`externalUrl`
// together are how a re-sync recognizes an already-imported video —
// scripts/sync-youtube.ts sets the document _id deterministically from
// `${source}-${externalId}` and calls createOrReplace, which does the job
// of a (source, external_id) unique constraint without a separate DB.
export default defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "thumbnailUrl", type: "url" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "playlist", type: "string" }),
    defineField({ name: "source", type: "string", initialValue: "youtube", readOnly: true }),
    defineField({ name: "externalId", type: "string", description: "YouTube video ID", validation: (r) => r.required() }),
    defineField({ name: "externalUrl", type: "url", validation: (r) => r.required() }),
    defineField({
      name: "privacyStatus",
      title: "Privacy status",
      type: "string",
      description: "Set by the YouTube sync. The site only shows videos that are public.",
      options: {
        list: [
          { title: "Public", value: "public" },
          { title: "Unlisted", value: "unlisted" },
          { title: "Private", value: "private" },
        ],
        layout: "radio",
      },
      readOnly: true,
    }),
    defineField({
      name: "relatedContent",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "tool" }, { type: "prompt" }, { type: "experiment" }, { type: "automation" }] }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "privacyStatus" },
  },
});
