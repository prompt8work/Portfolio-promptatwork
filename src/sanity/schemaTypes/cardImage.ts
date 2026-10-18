import { defineField } from "sanity";

// Card images (src/lib/card-images). `cardImage` is the image on the
// entry's cards; blog and project use their existing coverImage instead.
// `cardImageMeta` records how a generated image was made, so a later run
// knows whether the content changed and whether an editor replaced it.

const generatedNote =
  "Leave empty to have one generated from the title and summary when you publish. Upload your own to replace it; an uploaded image is never overwritten.";

export const cardImageField = defineField({
  name: "cardImage",
  title: "Card image",
  type: "image",
  options: { hotspot: true },
  description: generatedNote,
});

export const coverImageField = defineField({
  name: "coverImage",
  type: "image",
  options: { hotspot: true },
  description: generatedNote,
});

export const cardImageMetaField = defineField({
  name: "cardImageMeta",
  title: "Generated image details",
  type: "object",
  readOnly: true,
  hidden: ({ document }) => !document?.cardImageMeta,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "prompt", type: "text", rows: 4 }),
    defineField({ name: "model", type: "string" }),
    defineField({ name: "generatedAt", type: "datetime" }),
    defineField({ name: "hash", type: "string", description: "Hash of the content the image was made from." }),
    defineField({ name: "assetRef", type: "string" }),
    defineField({ name: "pendingHash", type: "string" }),
    defineField({ name: "pendingAt", type: "datetime" }),
  ],
});
