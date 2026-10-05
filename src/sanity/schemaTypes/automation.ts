import { defineField, defineType } from "sanity";
import { diagramsField } from "./processDiagram";
import { diagramPlacements } from "./diagramPlacements";
import { engineeringAreasField } from "./engineeringArea";

// PRD §68. `steps` models the Trigger → Input → AI Processing → Decision →
// Action → Output visualization from §27 as an ordered list of labeled
// stages, rather than five separate fixed fields — a real automation may
// have more or fewer stages than that exact five-step shape.
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
  name: "automation",
  title: "Automation",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: { list: categories },
      description: "Master content doc §22 — matches Tool/Prompt's category list so Automations can be grouped/filtered the same way.",
    }),
    defineField({ name: "description", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "problem", type: "text" }),
    defineField({ name: "trigger", type: "string" }),
    defineField({
      name: "steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "tools", type: "array", of: [{ type: "reference", to: [{ type: "tool" }] }] }),
    defineField({
      name: "integrations",
      type: "array",
      of: [{ type: "string" }],
      description: "Master content doc §22 — third-party services/APIs this automation connects to, distinct from the AI tools listed above.",
    }),
    defineField({ name: "architecture", type: "text" }),
    defineField({ name: "input", type: "text" }),
    defineField({ name: "output", type: "text" }),
    defineField({ name: "limitations", type: "text" }),
    defineField({ name: "securityNotes", type: "text", description: "Sensitive info must never be exposed here — PRD §28" }),
    defineField({
      name: "learnings",
      type: "text",
      description: "Master content doc §22 — what building/running this automation actually taught, matching Experiment's own 'learning' field.",
    }),
    diagramsField(diagramPlacements.automation),
    engineeringAreasField,
    defineField({
      name: "relatedContent",
      type: "array",
      description: "Same unified Related Content model every other content type uses (see tool.ts).",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "tool" }, { type: "prompt" }, { type: "experiment" }, { type: "automation" }, { type: "blog" }, { type: "training" }] }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
