import Link from "next/link";
import { ReactNode } from "react";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  size?: "sm" | "md";
  external?: boolean;
  direction?: "forward" | "back";
}

export default function ArrowLink({
  href,
  children,
  size = "md",
  external = false,
  direction = "forward",
}: ArrowLinkProps) {
  const color = "text-ink hover:text-primary";
  const textSize = size === "sm" ? "text-[13.5px]" : "text-[14.5px]";
  const iconSize = size === "sm" ? 12 : 14;

  const arrow = (
    <svg
      className="motion-arrow-icon shrink-0"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "back" ? "M19 12H5M11 18l-6-6 6-6" : "M5 12h14M13 6l6 6-6 6"} />
    </svg>
  );

  const content =
    direction === "back" ? (
      <>
        {arrow}
        {children}
      </>
    ) : (
      <>
        {children}
        {arrow}
      </>
    );

  const className = `motion-arrow inline-flex items-center gap-1.5 font-semibold ${textSize} ${color}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" data-direction={direction} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} data-direction={direction} className={className}>
      {content}
    </Link>
  );
}
