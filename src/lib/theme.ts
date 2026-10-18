// Light/dark theme. The visitor's choice is stored in localStorage under
// THEME_KEY; with no stored choice the site follows prefers-color-scheme.
// themeScript runs in <head> before first paint (layout.tsx) so there is no
// flash; ThemeToggle reads and writes the same key.

export type Theme = "light" | "dark";

export const THEME_KEY = "paw-theme";

export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
