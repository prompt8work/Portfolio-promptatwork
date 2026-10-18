import type { ReactNode } from "react";

/** Tinted note box — the docs-style "Unsure where to start?" aside. */
export default function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-secondary/30 bg-accent-violet/8 px-5 py-4 flex gap-3.5">
      <svg
        className="shrink-0 mt-0.5 text-primary"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v4h1" />
      </svg>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <div className="text-[14.5px] leading-relaxed text-on-surface-variant">{children}</div>
      </div>
    </div>
  );
}

/** Inline mono chip for commands, tool names and field names inside prose. */
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[0.86em] text-primary bg-surface-container border border-line rounded px-1.5 py-0.5">
      {children}
    </code>
  );
}
