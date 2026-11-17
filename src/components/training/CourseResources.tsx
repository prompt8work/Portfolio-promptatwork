import Link from "next/link";
import { BookOpen, Download, ExternalLink, FileCode2, FileText } from "lucide-react";
import { BlockLabel } from "../ui/ContentSection";
import Reveal from "../motion/Reveal";
import type { CourseResource, Workshop } from "../../lib/trainings";

// Free downloads and related links on a workshop page: the "Free downloads
// & links" list on a Workshop / course document. Files are served from the
// Sanity CDN with ?dl= so the browser saves them under their own name.

const icons = { PDF: FileText, Notebook: FileCode2, Article: BookOpen, Link: ExternalLink } as const;

function hrefFor(r: CourseResource) {
  if (r.fileUrl) return `${r.fileUrl}?dl=${encodeURIComponent(r.fileName ?? "")}`;
  return r.url ?? "#";
}

export default function CourseResources({ resources }: { resources: CourseResource[] }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-4" aria-labelledby="free-downloads">
        <BlockLabel id="free-downloads">Free downloads</BlockLabel>
        <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resources.map((r) => {
            const Icon = icons[r.kind ?? "Link"] ?? ExternalLink;
            const isFile = Boolean(r.fileUrl);
            const isInternal = !isFile && (r.url ?? "").startsWith("/");
            const action = isFile ? "Download" : isInternal ? "Read" : "Open";
            const body = (
              <>
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-lg border border-outline-variant bg-surface-container p-2 text-primary">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className="flex flex-col gap-1 min-w-0">
                    <span className="text-[15.5px] font-semibold text-ink">{r.title}</span>
                    {r.description && <span className="text-[14px] leading-relaxed text-on-surface-variant">{r.description}</span>}
                  </span>
                </span>
                <span className="mt-auto flex items-center justify-between gap-3 pt-1">
                  <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">{[r.kind, r.meta].filter(Boolean).join(" · ")}</span>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary">
                    {action}
                    {isFile ? <Download size={15} aria-hidden /> : <span aria-hidden>→</span>}
                  </span>
                </span>
              </>
            );
            const cls =
              "h-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-4 flex flex-col gap-3 no-underline transition-colors hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
            return (
              <li key={r._key}>
                {isInternal ? (
                  <Link href={r.url!} className={cls}>
                    {body}
                  </Link>
                ) : (
                  <a
                    href={hrefFor(r)}
                    className={cls}
                    {...(isFile ? { download: r.fileName ?? true } : { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {body}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </Reveal>
  );
}

/** The course's version history, newest first, each linked to its blog post when there is one. */
export function CourseVersions({ version, changelog }: { version?: string; changelog: NonNullable<Workshop["changelog"]> }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-3" aria-labelledby="version-history">
        <BlockLabel id="version-history">{version ? `Version history · now v${version}` : "Version history"}</BlockLabel>
        <ol className="m-0 p-0 list-none flex flex-col gap-2">
          {changelog.map((c) => (
            <li key={c._key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 text-[14.5px]">
              <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted shrink-0 sm:w-36">
                v{c.version} · {new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="text-on-surface-variant leading-relaxed">
                {c.summary}
                {c.postSlug && (
                  <>
                    {" "}
                    <Link href={`/blog/${c.postSlug}`} className="text-primary underline underline-offset-4">
                      Read the post
                    </Link>
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </Reveal>
  );
}
