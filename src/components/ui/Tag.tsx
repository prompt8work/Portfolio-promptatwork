import { ReactNode } from "react";

type Variant = "neutral" | "plum" | "cyan" | "gold";

const variants: Record<Variant, string> = {
  neutral: "bg-surface-container text-muted",
  plum: "bg-accent-blue/14 text-primary",
  cyan: "bg-surface-container text-primary",
  gold: "bg-tertiary text-ink",
};

export default function Tag({ children, variant = "neutral" }: { children: ReactNode; variant?: Variant }) {
  return (
    <span
      className={`motion-chip font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full inline-block ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
