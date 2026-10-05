import { type SchemaTypeDefinition } from "sanity";

import project from "./project";
import portfolioProfile from "./portfolioProfile";
import portfolioSettings from "./portfolioSettings";
import tool from "./tool";
import prompt from "./prompt";
import experiment from "./experiment";
import automation from "./automation";
import blog from "./blog";
import video from "./video";
import training from "./training";
import engineeringArea from "./engineeringArea";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, portfolioProfile, portfolioSettings, tool, prompt, experiment, automation, blog, video, training, engineeringArea],
};
