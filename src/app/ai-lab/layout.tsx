import Nav from "../../components/Nav";
import SiteFooter from "../../components/SiteFooter";
import DocsSidebar from "../../components/docs/DocsSidebar";
import { AiLabNavProvider, type DocsGroup, type ProjectSeries } from "../../components/docs/AiLabNavContext";
import { client } from "../../sanity/lib/client";
import { aiLabNavQuery } from "../../sanity/lib/queries";

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

type PartRow = { _type: string; slug: string; title: string };
type NavRow = { slug: string; title: string; summary?: string; parts?: PartRow[] | null };
type AiLabNavData = Record<"projects" | "tools" | "experiments" | "prompts" | "automations", NavRow[]> & {
  engineering: { id: string; title: string; summary: string }[];
};

const partBase: Record<string, string> = {
  automation: "/ai-lab/automations",
  tool: "/ai-lab/tools",
  prompt: "/ai-lab/prompts",
  experiment: "/ai-lab/experiments",
};

const rows = (base: string, list: NavRow[]) =>
  list.map((r) => ({ title: r.title, href: `${base}/${r.slug}`, summary: r.summary }));

/**
 * The AI Lab hub: every project, case study, engineering capability, tool,
 * experiment, prompt and automation, behind one persistent sidebar. Sections
 * with nothing published yet are left out of the sidebar until they fill. The
 * layout doesn't re-render on navigation, so only the centre column
 * changes as you move around — Nav, sidebar and footer stay put. Each page
 * renders <PageTransition><DocsArticle>…</DocsArticle></PageTransition>.
 */
export default async function AiLabLayout({ children }: LayoutProps<"/ai-lab">) {
  const data: AiLabNavData = await client.fetch(aiLabNavQuery);

  const groups: DocsGroup[] = [
    {
      title: "Start",
      href: "/ai-lab",
      items: [{ title: "Overview", href: "/ai-lab", summary: "Where to start and how the lab is organised." }],
    },
    { title: "Work & Case Studies", href: "/ai-lab/work", items: rows("/ai-lab/work", data.projects) },
    {
      title: "Engineering",
      href: "/ai-lab/engineering",
      items: data.engineering.map((s) => ({
        title: s.title,
        href: `/ai-lab/engineering#${s.id}`,
        summary: s.summary,
      })),
    },
    { title: "Tools & Research", href: "/ai-lab/tools", items: rows("/ai-lab/tools", data.tools) },
    { title: "Experiments", href: "/ai-lab/experiments", items: rows("/ai-lab/experiments", data.experiments) },
    { title: "Prompt Library", href: "/ai-lab/prompts", items: rows("/ai-lab/prompts", data.prompts) },
    { title: "Automations", href: "/ai-lab/automations", items: rows("/ai-lab/automations", data.automations) },
  ].filter((g) => g.title === "Start" || g.items.length > 0);

  // A case study and the entries documenting parts of the same project read
  // as one series (DocsPrevNext, DocsProjectParts). Unpublished parts resolve
  // to null and are skipped.
  const series: ProjectSeries[] = data.projects
    .filter((p) => p.parts?.some(Boolean))
    .map((p) => ({
      project: p.title,
      pages: [
        { kind: "project", title: p.title, href: `/ai-lab/work/${p.slug}` },
        ...(p.parts ?? [])
          .filter((r): r is PartRow => Boolean(r?.slug && partBase[r._type]))
          .map((r) => ({ kind: r._type, title: r.title, href: `${partBase[r._type]}/${r.slug}` })),
      ],
    }));

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Nav />
      <AiLabNavProvider groups={groups} series={series}>
        <div className="flex-1 w-full max-w-[1440px] mx-auto lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
          <DocsSidebar />
          <main className="min-w-0">{children}</main>
        </div>
      </AiLabNavProvider>
      <SiteFooter />
    </div>
  );
}
