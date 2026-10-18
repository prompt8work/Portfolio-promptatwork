import type { ReactNode } from "react";

type Tone = "light" | "muted";

const tones: Record<Tone, string> = {
  light: "bg-card border-line text-on-surface-variant",
  muted: "bg-surface-container border-line text-on-surface-variant",
};

/**
 * Larger pill chip (skills, focus areas, filters). Same hover as Tag: a
 * plum-soft fill slides up. As a filter (`onClick` via `button`), the
 * active chip is filled ink.
 */
export default function Chip({
  children,
  tone = "light",
  active,
  button,
  size = "md",
}: {
  children: ReactNode;
  tone?: Tone;
  active?: boolean;
  /** Render as a toggle button (filters). */
  button?: { onClick: () => void; label?: string };
  size?: "sm" | "md";
}) {
  const sizing = size === "sm" ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2";
  const cls = `motion-chip inline-flex items-center rounded-full border ${sizing} ${
    // Active filter: ink fill.
    active ? "bg-ink border-ink" : tones[tone]
  }`;

  if (button) {
    return (
      <button
        type="button"
        onClick={button.onClick}
        aria-pressed={!!active}
        aria-label={button.label}
        data-active={!!active}
        className={cls}
      >
        {children}
      </button>
    );
  }
  return (
    <span data-active={!!active} className={cls}>
      {children}
    </span>
  );
}
