"use client";

import { useEffect, useId, useRef, useState } from "react";

// Mermaid bakes colours into its SVG, so it can't follow CSS variables:
// the colours are read from the current Luminous SaaS tokens and the
// diagram redraws when the light/dark theme changes. Authors never style
// nodes themselves.
function tokenThemeVariables(el: Element) {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    fontSize: "14px",
    darkMode: document.documentElement.getAttribute("data-theme") !== "light",
    background: v("--surface-card"),
    primaryColor: v("--surface-container-high"),
    primaryBorderColor: v("--accent-blue"),
    primaryTextColor: v("--text-primary"),
    secondaryColor: v("--surface-container"),
    secondaryBorderColor: v("--accent-violet"),
    tertiaryColor: v("--surface-card"),
    tertiaryBorderColor: v("--border-subtle"),
    lineColor: v("--text-secondary"),
    textColor: v("--text-primary"),
    edgeLabelBackground: v("--surface-card"),
    clusterBkg: v("--canvas"),
    clusterBorder: v("--border-subtle"),
    noteBkgColor: v("--surface-container"),
    noteBorderColor: v("--border-subtle"),
    actorBkg: v("--surface-container-high"),
    actorBorder: v("--accent-blue"),
    signalColor: v("--text-primary"),
    labelBoxBkgColor: v("--surface-container-high"),
  };
}

/** Bumps whenever <html data-theme> changes, so the diagram redraws. */
function useThemeVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((n) => n + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return version;
}

/**
 * Advanced diagrams (branching decisions, architecture, sequences) from
 * Mermaid source. Mermaid is imported only when one of these is on the
 * page. Until it renders — or if it can't — the source stays readable.
 */
export default function MermaidDiagram({ code }: { code: string }) {
  const id = `mmd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useThemeVersion();

  useEffect(() => {
    let cancelled = false;
    const host = ref.current ?? document.documentElement;
    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: getComputedStyle(document.body).fontFamily,
          themeVariables: tokenThemeVariables(host),
          flowchart: { htmlLabels: true, curve: "basis", padding: 12 },
        });
        const { svg } = await mermaid.render(`${id}-${themeVersion}`, code);
        if (!cancelled) setSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code, id, themeVersion]);

  if (svg) {
    return (
      <div
        ref={ref}
        className="overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full [&_svg]:h-auto"
        // Mermaid's strict security level sanitises its SVG output.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return (
    <div ref={ref} className="flex flex-col gap-2">
      {failed && <p className="text-[13px] text-error-token">This diagram couldn&apos;t be drawn. Its source is below.</p>}
      <pre
        className={`whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-muted ${failed ? "" : "opacity-60"}`}
        aria-busy={!failed}
      >
        {code}
      </pre>
    </div>
  );
}
