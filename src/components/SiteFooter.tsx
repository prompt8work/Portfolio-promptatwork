"use client";

import Link from "next/link";
import LinkedinIcon from "./icons/LinkedinIcon";
import { personalInfo } from "../../data";
import { brand, footerColumns } from "../lib/navigation";

export default function SiteFooter() {
  // Fixed view-transition-name: stays still while page content crossfades (globals.css).
  return (
    <footer className="w-full bg-white border-t border-neutral-200" style={{ viewTransitionName: "site-footer" }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 pt-16 pb-9">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-11 border-b border-neutral-200">
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-[9px] bg-neutral-900 text-cyan-500 font-mono font-bold text-[13px] flex items-center justify-center">
                {brand.mark}
              </span>
              <span className="font-display text-[17px] font-semibold text-neutral-900">{brand.name}</span>
            </div>
            <p className="text-[13.5px] text-neutral-600 leading-relaxed max-w-[240px]">
              A living portfolio of practical AI engineering — built, documented and taught in the open.
            </p>
            <div className="flex gap-2.5 mt-1">
              <a
                href={`https://${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-[34px] h-[34px] rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-plum-600 hover:text-plum-600 motion-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
                </svg>
              </a>
              <a
                href={`https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-[34px] h-[34px] rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-plum-600 hover:text-plum-600 motion-btn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {footerColumns.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="font-mono text-[11px] font-semibold text-neutral-500 tracking-[0.14em]">{title.toUpperCase()}</span>
              {links.map((l) =>
                l.external ? (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-neutral-700 hover:text-plum-600 transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-[14px] text-neutral-700 hover:text-plum-600 transition-colors"
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-[11.5px] text-neutral-500">
              © 2026 Niharika Dhande · Prompt Engineer &amp; Generative AI Trainer · Indore, India
            </span>
            <Link href="/privacy" className="font-mono text-[11.5px] text-neutral-500 hover:text-plum-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
              })
            }
            aria-label="Back to top"
            className="motion-btn w-[38px] h-[38px] rounded-full bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-plum-600 hover:text-plum-600"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
