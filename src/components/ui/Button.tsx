import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  iconPosition?: "before" | "after";
  /** The icon is an arrow: nudges right on hover, same as ArrowLink. */
  arrow?: boolean;
}

const variants: Record<Variant, string> = {
  // Luminous SaaS primary: the blue → violet gradient, white label.
  primary: "bg-linear-to-br from-accent-blue to-accent-violet text-white hover:text-white shadow-[var(--glow-sm)]",
  secondary: "bg-transparent text-neutral-900 border-[1.5px] border-neutral-300 hover:border-neutral-400",
};

export default function Button({
  href,
  children,
  variant = "primary",
  icon,
  iconPosition = "after",
  arrow = false,
}: ButtonProps) {
  const iconEl = icon && (arrow ? <span className="motion-arrow-icon inline-flex">{icon}</span> : icon);
  return (
    <Link
      href={href}
      className={`motion-btn ${arrow ? "motion-arrow" : ""} inline-flex items-center gap-2.5 text-[15px] font-semibold px-6 py-3.5 rounded-xl ${variants[variant]}`}
    >
      {iconPosition === "before" && iconEl}
      {children}
      {iconPosition === "after" && iconEl}
    </Link>
  );
}
