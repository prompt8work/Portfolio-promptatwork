import Nav from "../../components/Nav";
import SiteFooter from "../../components/SiteFooter";
import DocsSidebar from "../../components/docs/DocsSidebar";
import { AiLabNavProvider, type DocsGroup } from "../../components/docs/AiLabNavContext";
import { client } from "../../sanity/lib/client";
import { trainingsQuery } from "../../sanity/lib/queries";
import { trainingCategories, trainingPath, trainings } from "../../lib/trainings";

// Interim revalidation strategy until the Sanity webhook is wired up.
export const revalidate = 60;

type CourseRow = { slug: string; title: string; description: string };

/**
 * The Training hub, built on the AI Lab's docs shell: one persistent
 * sidebar with a group per audience category (from src/lib/trainings.ts)
 * plus the cohort courses open for registration (Sanity). Each page renders
 * <PageTransition><DocsArticle>…</DocsArticle></PageTransition>.
 */
export default async function TrainingLayout({ children }: LayoutProps<"/training">) {
  const courses: CourseRow[] = await client.fetch(trainingsQuery);

  const groups: DocsGroup[] = [
    {
      title: "Start",
      href: "/training",
      items: [{ title: "Overview", href: "/training", summary: "Every workshop, course and institute in one place." }],
    },
    ...trainingCategories.map((c) => ({
      title: c.label,
      href: `/training?category=${c.slug}`,
      items: trainings
        .filter((t) => t.category === c.label)
        .map((t) => ({ title: t.title, href: trainingPath(t.slug), summary: t.description })),
    })),
    {
      title: "Cohort courses",
      href: "/training#courses",
      items: courses.map((c) => ({ title: c.title, href: trainingPath(c.slug), summary: c.description })),
    },
  ].filter((g) => g.title === "Start" || g.items.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Nav />
      <AiLabNavProvider groups={groups} label="Training">
        <div className="flex-1 w-full max-w-[1440px] mx-auto lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
          <DocsSidebar />
          <main className="min-w-0">{children}</main>
        </div>
      </AiLabNavProvider>
      <SiteFooter />
    </div>
  );
}
