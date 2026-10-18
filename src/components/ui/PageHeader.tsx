import type { ReactNode } from "react";
import WordReveal from "../motion/WordReveal";
import IntroFade from "../motion/IntroFade";
import Morph from "../motion/Morph";

/**
 * The shared opening of every non-home page: back link, eyebrow, H1 with
 * the word reveal, then description and extras fading up in order. All
 * CSS, so it's visible and animating on first paint. `titleMorph` names the H1
 * for the card → detail shared-element morph.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  back,
  titleMorph,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  back?: ReactNode;
  titleMorph?: string;
  children?: ReactNode;
}) {
  const eyebrowColor = "text-primary";
  const titleColor = "text-ink";
  const descColor = "text-muted";

  const h1 = (
    <WordReveal
      as="h1"
      className={`text-3xl sm:text-[42px] font-semibold leading-tight ${titleColor}`}
    >
      {title}
    </WordReveal>
  );

  return (
    <div className="flex flex-col gap-5">
      {back && <IntroFade>{back}</IntroFade>}
      {eyebrow && (
        <IntroFade as="span" className={`font-mono text-xs tracking-wide font-semibold ${eyebrowColor}`}>
          {eyebrow}
        </IntroFade>
      )}
      {titleMorph ? <Morph name={titleMorph}>{h1}</Morph> : h1}
      {description && (
        <IntroFade as="p" after={title} step={1} className={`text-[16px] leading-relaxed max-w-[640px] ${descColor}`}>
          {description}
        </IntroFade>
      )}
      {children && (
        <IntroFade after={title} step={2} className="flex flex-col gap-5">
          {children}
        </IntroFade>
      )}
    </div>
  );
}
