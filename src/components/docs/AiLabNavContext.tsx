"use client";

import { createContext, useContext, type ReactNode } from "react";

export type DocsEntry = { title: string; href: string; summary?: string };
export type DocsGroup = { title: string; href: string; items: DocsEntry[] };
/** One project's documentation in reading order: the case study first, then its parts. */
export type ProjectSeries = { project: string; pages: (DocsEntry & { kind: string })[] };

const Ctx = createContext<{ groups: DocsGroup[]; series: ProjectSeries[] }>({ groups: [], series: [] });

/**
 * The AI Lab sidebar tree, fetched once by the ai-lab layout and shared
 * with everything that needs it on the client: the sidebar, ⌘K search and
 * the previous/next links at the foot of each page. `series` groups a case
 * study with the entries that document parts of the same project.
 */
export function AiLabNavProvider({
  groups,
  series = [],
  children,
}: {
  groups: DocsGroup[];
  series?: ProjectSeries[];
  children: ReactNode;
}) {
  return <Ctx.Provider value={{ groups, series }}>{children}</Ctx.Provider>;
}

export function useAiLabNav() {
  return useContext(Ctx).groups;
}

/** The project series the given page belongs to, if any. */
export function useProjectSeries(pathname: string) {
  return useContext(Ctx).series.find((s) => s.pages.some((p) => p.href === pathname));
}

/** Every page in reading order: each group's landing page, then its entries. Anchors are skipped. */
export function flattenPages(groups: DocsGroup[]): DocsEntry[] {
  return groups.flatMap((g) => [
    { title: g.items.find((i) => i.href === g.href)?.title ?? g.title, href: g.href },
    ...g.items.filter((i) => !i.href.includes("#") && i.href !== g.href),
  ]);
}
