import { ReactNode } from "react";
import Reveal from "../motion/Reveal";
import WordReveal from "../motion/WordReveal";
import IntroFade from "../motion/IntroFade";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "start" | "between";
  /**
   * "page": this heading opens the page — renders the H1 with the shared
   * page-intro (word reveal + fade-up, CSS, visible without JS).
   * "section" (default): an H2 revealed on scroll.
   */
  level?: "section" | "page";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "between",
  level = "section",
}: SectionHeadingProps) {
  const eyebrowColor = "text-primary";
  const titleColor = "text-ink";
  const descColor = "text-muted";
  const layout = `flex flex-col mb-11 sm:mb-[52px] gap-6 ${
    align === "between" ? "sm:flex-row sm:items-end sm:justify-between" : ""
  }`;
  const titleClass = `text-3xl sm:text-[38px] font-semibold ${titleColor}`;

  if (level === "page") {
    return (
      <div className={layout}>
        <div className="flex flex-col gap-3.5 max-w-[640px]">
          <IntroFade as="span" className={`font-mono text-xs tracking-wide font-semibold ${eyebrowColor}`}>
            {eyebrow}
          </IntroFade>
          <WordReveal as="h1" className={titleClass}>
            {title}
          </WordReveal>
          {description && (
            <IntroFade as="p" after={title} step={1} className={`text-[15px] leading-relaxed ${descColor}`}>
              {description}
            </IntroFade>
          )}
        </div>
        {action && (
          <IntroFade after={title} step={2}>
            {action}
          </IntroFade>
        )}
      </div>
    );
  }

  return (
    <Reveal className={layout}>
      <div className="flex flex-col gap-3.5 max-w-[640px]">
        <span className={`font-mono text-xs tracking-wide font-semibold ${eyebrowColor}`}>{eyebrow}</span>
        <h2 className={titleClass}>{title}</h2>
        {description && <p className={`text-[15px] leading-relaxed ${descColor}`}>{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
