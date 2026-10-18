import Link from "next/link";
import type { ReactNode } from "react";

// Luminous SaaS SectionHeader: mono eyebrow, headline-md title, and an
// optional "View all →" link or custom action on the right.
export default function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  action,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="paw-section-head flex-wrap">
      <div className="flex flex-col">
        {eyebrow && <p className="paw-section-head__eyebrow">{eyebrow}</p>}
        <Heading className="m-0 text-2xl leading-8 font-semibold tracking-[-0.01em]">{title}</Heading>
        {description && <p className="mt-1.5 text-sm text-muted max-w-[640px]">{description}</p>}
      </div>
      {link && (
        <Link href={link.href} className="paw-section-head__link">
          {link.label} →
        </Link>
      )}
      {action}
    </div>
  );
}
