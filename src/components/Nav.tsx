"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { menuItem, menuPanel, transition } from "../lib/motion";
import { brand, contactCta, isActivePath, mainNav } from "../lib/navigation";

// One menu for every page. `tone` only changes colours — /portfolio is the
// site's one dark area and passes tone="dark"; options, order, dropdown and
// mobile menu are identical everywhere (links live in lib/navigation.ts).
const tones = {
  light: {
    header: "bg-neutral-50/90 border-neutral-200",
    mark: "bg-neutral-900 text-cyan-500",
    name: "text-neutral-900",
    link: "text-neutral-700 hover:text-plum-600",
    linkActive: "text-plum-600",
    underline: "bg-plum-600",
    panel: "bg-white border-neutral-200 shadow-lg",
    panelItem: "hover:bg-neutral-100",
    panelTitle: "text-neutral-900",
    panelText: "text-neutral-500",
    cta: "bg-plum-600 hover:bg-plum-700 text-white",
    burger: "border-neutral-300 text-neutral-800",
    mobile: "border-neutral-200 bg-neutral-50",
    mobileLink: "text-neutral-800",
    mobileSub: "text-neutral-600 border-neutral-200",
  },
  dark: {
    header: "bg-[#030a18]/80 border-cyan-400/10",
    mark: "border border-cyan-400/30 bg-cyan-400/10 text-cyan-400",
    name: "text-white",
    link: "text-slate-300 hover:text-cyan-400",
    linkActive: "text-cyan-400",
    underline: "bg-cyan-400",
    panel: "bg-[#07142a] border-cyan-400/15 shadow-[0_20px_50px_rgba(0,0,0,0.45)]",
    panelItem: "hover:bg-cyan-400/[0.06]",
    panelTitle: "text-slate-100",
    panelText: "text-slate-400",
    cta: "bg-cyan-500 hover:bg-cyan-400 text-neutral-900",
    burger: "border-cyan-400/25 text-slate-200",
    mobile: "border-cyan-400/10 bg-[#030a18]",
    mobileLink: "text-slate-100",
    mobileSub: "text-slate-400 border-cyan-400/15",
  },
};

function ArrowIcon() {
  return (
    <svg
      className="motion-arrow-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Nav({ tone = "light" }: { tone?: keyof typeof tones }) {
  const t = tones[tone];
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const active = mainNav.find((l) => isActivePath(pathname, l.href))?.href ?? null;
  // The underline sits under the hovered link, falling back to the current page.
  const underlined = hovered ?? active;

  return (
    // Fixed view-transition-name: the header stays still while page content crossfades (globals.css).
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b ${t.header}`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className={`w-9 h-9 rounded-[10px] font-mono font-semibold text-sm flex items-center justify-center ${t.mark}`}
          >
            {brand.mark}
          </span>
          <span className={`font-display text-lg font-semibold ${t.name}`}>{brand.name}</span>
        </Link>

        <LayoutGroup id="nav">
          <nav
            className="hidden md:flex items-center gap-7"
            onMouseLeave={() => {
              setHovered(null);
              setDropdown(null);
            }}
          >
            {mainNav.map((l) => (
              <div
                key={l.href}
                className="relative"
                onMouseEnter={() => {
                  setHovered(l.href);
                  setDropdown(l.children ? l.href : null);
                }}
                onFocus={() => {
                  setHovered(l.href);
                  setDropdown(l.children ? l.href : null);
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setHovered(null);
                    setDropdown(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setDropdown(null);
                }}
              >
                <Link
                  href={l.href}
                  aria-current={active === l.href ? "page" : undefined}
                  aria-haspopup={l.children ? "true" : undefined}
                  aria-expanded={l.children ? dropdown === l.href : undefined}
                  className={`relative py-1 text-sm font-medium inline-flex items-center gap-1 ${
                    active === l.href ? t.linkActive : t.link
                  }`}
                >
                  {l.label}
                  {l.children && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                  {underlined === l.href && (
                    <motion.span
                      layoutId="nav-underline"
                      transition={transition.layout}
                      className={`absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full ${t.underline}`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {l.children && dropdown === l.href && (
                    <motion.div
                      key="dropdown"
                      variants={menuPanel}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3"
                    >
                      <ul className={`w-[340px] rounded-xl border p-2 ${t.panel}`}>
                        {l.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setDropdown(null)}
                              aria-current={pathname === c.href ? "page" : undefined}
                              className={`block rounded-lg px-3 py-2.5 ${t.panelItem}`}
                            >
                              <span className={`block text-sm font-medium ${t.panelTitle}`}>{c.label}</span>
                              <span className={`block text-xs mt-0.5 ${t.panelText}`}>{c.description}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </LayoutGroup>

        <Link
          href={contactCta.href}
          className={`motion-btn motion-arrow hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap ${t.cta}`}
        >
          {contactCta.label}
          <ArrowIcon />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`motion-btn md:hidden w-10 h-10 flex items-center justify-center rounded-lg border ${t.burger}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`md:hidden border-t px-5 py-4 flex flex-col gap-4 max-h-[calc(100dvh-72px)] overflow-y-auto ${t.mobile}`}
          >
            {mainNav.map((l) => (
              <motion.div key={l.href} variants={menuItem}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.href ? "page" : undefined}
                  className={`text-base font-medium ${active === l.href ? t.linkActive : t.mobileLink}`}
                >
                  {l.label}
                </Link>
                {l.children && (
                  <ul className={`mt-2 ml-1 pl-3 border-l flex flex-col gap-2 ${t.mobileSub}`}>
                    {l.children.slice(1).map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className={`text-sm ${pathname === c.href ? t.linkActive : ""}`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
            <motion.div variants={menuItem}>
              <Link
                href={contactCta.href}
                onClick={() => setOpen(false)}
                className={`motion-btn flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-full mt-1 ${t.cta}`}
              >
                {contactCta.label}
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
