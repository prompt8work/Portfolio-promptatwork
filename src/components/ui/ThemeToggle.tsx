"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_KEY, resolveTheme, type Theme } from "../../lib/theme";

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// The source of truth is <html data-theme>, set by themeScript before paint.
// The toggle subscribes to that attribute rather than keeping its own copy.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.getAttribute("data-theme") as Theme | null;
// The server can't know the theme; the icon renders once the client mounts.
const getServerSnapshot = () => null;

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useLayoutEffect(() => {
    // Re-applies the attribute React clears on the dev Strict Mode remount.
    apply(resolveTheme());

    // Follow the system setting until the visitor picks a theme themselves.
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      try {
        if (localStorage.getItem(THEME_KEY)) return;
      } catch {}
      apply(media.matches ? "light" : "dark");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    apply(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  }

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className={`paw-btn paw-btn--icon ${className}`}>
      {theme === "light" ? <Moon className="paw-icon" aria-hidden="true" /> : <Sun className="paw-icon" aria-hidden="true" />}
    </button>
  );
}
