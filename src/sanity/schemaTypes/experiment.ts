import { defineField, defineType } from "sanity";
import { diagramsField } from "./processDiagram";
import { diagramPlacements } from "./diagramPlacements";
import { engineeringAreasField } from "./engineeringArea";

// PRD §25 structure.
export default defineType({
  name: "experiment",
  title: "Experiment",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "objective", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "hypothesis",
      type: "text",
      rows: 2,
      description: "Master content doc §20 — what you predicted would happen, distinct from the objective (what you were trying to do).",
    }),
    defineField({ name: "tool", type: "reference", to: [{ type: "tool" }] }),
    defineField({ name: "problem", type: "text" }),
    defineField({ name: "setup", type: "text" }),
    defineField({ name: "promptOrWorkflow", title: "Prompt / Workflow", type: "text" }),
    defineField({ name: "input", type: "text" }),
    defineField({ name: "output", type: "text" }),
    defineField({ name: "whatWorked", type: "text" }),
    defineField({ name: "whatFailed", type: "text" }),
    defineField({ name: "learning", type: "text" }),
    defineField({
      name: "decision",
      type: "text",
      rows: 2,
      description: "Master content doc §20 — adopted, abandoned, or revisit later.",
    }),
    defineField({
      name: "nextStep",
      title: "Next Step",
      type: "text",
      rows: 2,
      description: "Master content doc §20 — what follows from this experiment, if anything.",
    }),
    defineField({ name: "useCases", type: "array", of: [{ type: "string" }] }),
    diagramsField(diagramPlacements.experiment),
    engineeringAreasField,
    defineField({
      name: "relatedContent",
      type: "array",
      description: "Same unified Related Content model every other content type uses (see tool.ts).",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "tool" }, { type: "prompt" }, { type: "experiment" }, { type: "automation" }, { type: "blog" }, { type: "training" }] }],
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
  preview: {
    select: { title: "title", subtitle: "objective" },
  },
});
