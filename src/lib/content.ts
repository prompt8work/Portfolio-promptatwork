import { cache } from "react";
import { groq } from "next-sanity";
import { client } from "../sanity/lib/client";

// Every piece of site copy and settings comes from Sanity (moved out of the
// codebase 2026-10-19; scripts/migrate-content-to-sanity.ts). These are the
// typed readers. `cache` de-duplicates a fetch within one render, so a
// layout and a page asking for the same document hit Sanity once.

export * from "./content-types";
import type { Workshop, Institute, Page, SiteSettings, HomePage, CoverLetter } from "./content-types";

const workshopProjection = groq`{
  "slug": slug.current, category, title, coverTitle, coverVariant, tone,
  "tags": coalesce(tags, []), "highlights": coalesce(highlights, []), description,
  "idealFor": coalesce(idealFor, []), "image": cardImage.asset->url,
  sessionFormat, programs, timelinesIntro, modules
}`;

export const getSiteSettings = cache(
  (): Promise<SiteSettings> => client.fetch(groq`*[_id == "site-settings"][0]`),
);

export const getHomePage = cache((): Promise<HomePage> => client.fetch(groq`*[_id == "home-page"][0]`));

export const getPage = cache(
  (key: string): Promise<Page> => client.fetch(groq`*[_type == "page" && key == $key][0]`, { key }).then((p) => p ?? { key }),
);

export const getCoverLetter = cache((): Promise<CoverLetter> => client.fetch(groq`*[_id == "cover-letter"][0]`));

export const getWorkshops = cache(
  (): Promise<Workshop[]> => client.fetch(groq`*[_type == "workshop"] | order(order asc, title asc) ${workshopProjection}`),
);

export const getWorkshop = cache(
  (slug: string): Promise<Workshop | null> =>
    client.fetch(groq`*[_type == "workshop" && slug.current == $slug][0] ${workshopProjection}`, { slug }),
);

export const getInstitutes = cache(
  (): Promise<Institute[]> =>
    client.fetch(groq`*[_type == "institute"] | order(order asc, name asc) {
      name, period, description, highlightLabel, highlightText, "tags": coalesce(tags, []),
      "logo": logo{ "url": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }
    }`),
);
