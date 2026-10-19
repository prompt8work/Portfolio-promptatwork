import type { StructureResolver } from "sanity/structure";

// Studio sidebar: the single-document settings first (each opens its one
// document, by its fixed _id), then every other document type as a list.
// Pages are one per route, so they're listed rather than created freely.
const singletons = [
  { type: "siteSettings", id: "site-settings", title: "Site settings" },
  { type: "homePage", id: "home-page", title: "Home page" },
  { type: "portfolioSettings", id: "portfolio-settings", title: "Portfolio settings" },
  { type: "coverLetter", id: "cover-letter", title: "Cover letter" },
];

export const singletonTypes = new Set(singletons.map((s) => s.type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...singletons.map((s) => S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.type).documentId(s.id))),
      S.listItem().title("Pages").child(S.documentTypeList("page").title("Pages")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return !!id && !singletonTypes.has(id) && id !== "page";
      }),
    ]);
