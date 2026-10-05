import type { ReactNode } from "react";
import DocsToc from "./DocsToc";
import DocsPrevNext from "./DocsPrevNext";
import DocsProjectParts from "./DocsProjectParts";

/**
 * Centre + right columns of the AI Lab hub: the page's content at reading
 * width, with "On this page" beside it on wide screens and previous/next
 * links at the foot. Pages that document part of a project also list the
 * project's other pages — beside the content on wide screens, at the foot
 * on narrower ones.
 */
export default function DocsArticle({ children }: { children: ReactNode }) {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-12 px-5 sm:px-10 lg:px-14 pt-10 sm:pt-14 pb-20">
      <article data-docs-content className="min-w-0 max-w-[720px]">
        {children}
        <DocsProjectParts className="mt-16 xl:hidden" />
        <DocsPrevNext />
      </article>
      <aside className="hidden xl:block">
        <div className="sticky top-[105px] flex flex-col gap-8">
          <DocsProjectParts />
          <DocsToc />
        </div>
      </aside>
    </div>
  );
}
