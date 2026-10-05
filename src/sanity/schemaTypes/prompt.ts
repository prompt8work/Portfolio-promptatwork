import { defineField, defineType } from "sanity";
import { diagramsField } from "./processDiagram";
import { diagramPlacements } from "./diagramPlacements";
import { engineeringAreasField } from "./engineeringArea";

// PRD §67, categories from §26.
const difficulties = ["Beginner", "Intermediate", "Advanced"];

const categories = [
  "Coding",
  "Research",
  "RAG",
  "Testing",
  "Documentation",
  "Marketing",
  "Image Generation",
  "Video Generation",
  "Automation",
  "Agents",
  "Productivity",
];

export default defineType({
  name: "prompt",
  title: "Prompt",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", type: "string", options: { list: categories }, validation: (r) => r.required() }),
    defineField({ name: "purpose", type: "text", rows: 2 }),
    defineField({ name: "prompt", type: "text", rows: 8, validation: (r) => r.required() }),
    defineField({ name: "variables", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "exampleInput", type: "text" }),
    defineField({ name: "exampleOutput", type: "text" }),
    defineField({
      name: "expectedBehavior",
      title: "Expected Behavior",
      type: "text",
      description: "Master content doc §21 — what a correct response from this prompt should look like, distinct from one literal example output.",
    }),
    defineField({
      name: "failureModes",
      title: "Failure Modes",
      type: "array",
      of: [{ type: "string" }],
      description: "Master content doc §21 — documented ways this prompt has been observed to go wrong.",
    }),
    defineField({ name: "difficulty", type: "string", options: { list: difficulties } }),
    defineField({ name: "tool", type: "reference", to: [{ type: "tool" }] }),
    defineField({ name: "tips", title: "Tips / Evaluation Notes", type: "text" }),
    diagramsField(diagramPlacements.prompt),
    engineeringAreasField,
    defineField({
      name: "relatedContent",
      type: "array",
      description: "Same unified Related Content model every other content type uses (see tool.ts) — widened from project|tool only, so a prompt can link to the experiment or automation it actually came from.",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "tool" }, { type: "prompt" }, { type: "experiment" }, { type: "automation" }, { type: "blog" }, { type: "training" }] }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
  },
});
