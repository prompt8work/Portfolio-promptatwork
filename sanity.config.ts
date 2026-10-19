"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { singletonTypes, structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    ...schema,
    // Singletons can't be created from "New document" or duplicated/deleted.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType) && schemaType !== "page"),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType) || schemaType === "page"
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    // Vision lets you run raw GROQ queries from inside the Studio UI —
    // genuinely useful while wiring up new queries, safe to leave in for
    // a single-editor site.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
