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
import siteSettings from "./siteSettings";
import homePage from "./homePage";
import page from "./page";
import workshop from "./workshop";
import institute from "./institute";
import coverLetter from "./coverLetter";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    homePage,
    page,
    coverLetter,
    project,
    portfolioProfile,
    portfolioSettings,
    tool,
    prompt,
    experiment,
    automation,
    blog,
    video,
    training,
    workshop,
    institute,
    engineeringArea,
  ],
};
