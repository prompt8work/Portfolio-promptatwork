"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { menuItem, menuPanel, transition } from "../lib/motion";
import { contactCta, isActivePath, mainNav } from "../lib/navigation";
import Brand from "./ui/Brand";
import ThemeToggle from "./ui/ThemeToggle";

// One menu for every page (links live in lib/navigation.ts). Built on the
// Luminous SaaS TopNav (design/promptatwork-redesign, Hub-Nav board): a
// sticky glass bar, text-secondary links, and a gradient underline on the
// bar's bottom edge under the hovered or current link. Colours come from
// tokens, so it follows the light/dark toggle. The full menu needs ~1000px,
// so below lg (1024px) it collapses into the menu button.
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const active = mainNav.find((l) => isActivePath(pathname, l.href))?.href ?? null;
  const underlined = hovered ?? active;

  return (
    // Fixed view-transition-name: the header stays still while page content crossfades (globals.css).
    <header
      className="paw-glass sticky top-0 z-40 w-full border-x-0 border-t-0 font-sans text-ink"
      style={{ viewTransitionName: "site-header", boxShadow: "var(--elevation-glass)" }}
    >
      <div className="max-w-[1280px] mx-auto h-[68px] px-4 sm:px-8 flex items-center gap-6 lg:gap-10">
        <Brand />

        <LayoutGroup id="nav">
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-1 h-full flex-1"
            onMouseLeave={() => {
              setHovered(null);
              setDropdown(null);
            }}
          >
            {mainNav.map((l) => (
              <div
                key={l.href}
                className="relative h-full flex items-center"
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
                  className={`relative inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active === l.href ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                  {l.children && <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />}
                </Link>
                {underlined === l.href && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={transition.layout}
                    className="absolute left-3.5 right-3.5 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-accent-blue to-accent-violet"
                  />
                )}

                <AnimatePresence>
                  {l.children && dropdown === l.href && (
                    <motion.div
                      key="dropdown"
                      variants={menuPanel}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
                    >
                      <ul
                        className="w-[340px] rounded-2xl border border-line bg-card p-2"
                        style={{ boxShadow: "var(--elevation-glass)" }}
                      >
                        {l.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setDropdown(null)}
                              aria-current={pathname === c.href ? "page" : undefined}
                              className="block rounded-xl px-3 py-2.5 hover:bg-surface-container-high transition-colors"
                            >
                              <span className={`block text-sm font-medium ${pathname === c.href ? "text-primary" : "text-ink"}`}>
                                {c.label}
                              </span>
                              <span className="block text-xs mt-0.5 text-muted">{c.description}</span>
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

        <div className="ml-auto lg:ml-0 flex items-center gap-2">
          <ThemeToggle />
          <Link href={contactCta.href} className="paw-btn paw-btn--secondary paw-btn--sm hidden lg:inline-flex whitespace-nowrap">
            {contactCta.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="paw-btn paw-btn--icon lg:hidden"
          >
            {open ? <X className="paw-icon" aria-hidden="true" /> : <Menu className="paw-icon" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            aria-label="Primary"
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="lg:hidden border-t border-line bg-canvas px-4 py-4 flex flex-col gap-4 max-h-[calc(100dvh-68px)] overflow-y-auto"
          >
            {mainNav.map((l) => (
              <motion.div key={l.href} variants={menuItem}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.href ? "page" : undefined}
                  className={`text-base font-medium ${active === l.href ? "text-primary" : "text-ink"}`}
                >
                  {l.label}
                </Link>
                {l.children && (
                  <ul className="mt-2 ml-1 pl-3 border-l border-line flex flex-col gap-2 text-muted">
                    {l.children.slice(1).map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className={`text-sm ${pathname === c.href ? "text-primary" : "hover:text-ink"}`}
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
                className="paw-btn paw-btn--primary w-full justify-center text-white mt-1"
              >
                {contactCta.label}
                <ArrowRight className="paw-icon" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
