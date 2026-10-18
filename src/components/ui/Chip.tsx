import type { ReactNode } from "react";

type Tone = "light" | "muted";

const tones: Record<Tone, string> = {
  light: "bg-neutral-0 border-neutral-200 text-neutral-700",
  muted: "bg-neutral-100 border-neutral-200 text-neutral-700",
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
    active ? "bg-neutral-900 border-neutral-900" : tones[tone]
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
