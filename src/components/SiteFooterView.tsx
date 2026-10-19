import Link from "next/link";
import LinkedinIcon from "./icons/LinkedinIcon";
import { footerColumns } from "../lib/navigation";
import { profileUrl, type SiteSettings } from "../lib/content-types";
import Brand from "./ui/Brand";
import BackToTop from "./ui/BackToTop";

// Luminous SaaS footer (design/promptatwork-redesign, New-Footer board):
// the deepest surface, brand + blurb + social circles, then the link
// columns from lib/navigation.ts. The board's YouTube icon, Terms and
// Cookie links are left out until the channel URL and those pages exist.
// No server imports, so the client-side error page can render it too.

/**
 * The footer markup. Used directly (without settings) by the client-side
 * error page, which can't fetch: links only, no Sanity-backed text.
 */
export default function SiteFooterView({ settings }: { settings?: Pick<SiteSettings, "footerBlurb" | "footerCopyright" | "linkedin" | "github"> }) {
  const social = "w-10 h-10 rounded-full border border-line grid place-items-center text-muted hover:text-ink hover:border-outline transition-colors";

  return (
    // Fixed view-transition-name: stays still while page content crossfades (globals.css).
    <footer
      className="w-full bg-surface-container-lowest border-t border-line font-sans text-ink"
      style={{ viewTransitionName: "site-footer" }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 md:gap-12 pb-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4 max-w-[360px]">
            <Brand />
            {settings?.footerBlurb && <p className="text-sm leading-[22px] text-muted">{settings.footerBlurb}</p>}
            {settings && (
            <div className="flex gap-2">
              <a href={profileUrl(settings.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={social}>
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href={profileUrl(settings.github)} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={social}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
                </svg>
              </a>
            </div>
            )}
          </div>

          {footerColumns(settings ? profileUrl(settings.linkedin) : undefined).map(({ title, links }) => (
            <nav key={title} aria-label={title} className="flex flex-col gap-3 text-sm">
              <span className="label-md text-ink mb-1">{title.toUpperCase()}</span>
              {links.map((l) =>
                l.external ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink transition-colors">
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.label} href={l.href} className="text-muted hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                ),
              )}
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-line text-[13px] text-muted">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {settings?.footerCopyright && <span>© {settings.footerCopyright}</span>}
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy Policy
            </Link>
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
