import Image from "next/image";
import { hero } from "../../../data/homeContent";
import LinkedinIcon from "../icons/LinkedinIcon";
import Button from "../ui/Button";
import ArrowLink from "../ui/ArrowLink";
import WordReveal from "../motion/WordReveal";
import IntroFade from "../motion/IntroFade";
import RotatingText from "../motion/RotatingText";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative w-full min-h-[620px] sm:min-h-[720px] lg:min-h-[800px] overflow-hidden flex items-center"
    >
      {/* Portrait curtain: CSS clip-path reveal, so it runs on first paint
          without waiting for JS (this is the LCP image). */}
      <div className="motion-curtain absolute inset-0">
        <Image
          src="/images/Hero_image.png"
          alt="Niharika Dhande at her desk"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 22%" }}
          priority
        />
      </div>
      {/* Desktop: text and photo sit side by side, so the fade only needs to
          cover the left column, left clear on the right where she is. */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, var(--color-neutral-50) 0%, rgba(250,248,244,0.94) 20%, rgba(250,248,244,0.55) 42%, rgba(250,248,244,0.08) 60%, transparent 72%)",
        }}
      />
      {/* Mobile/tablet: text stacks full-width directly over the photo, so a
          side fade isn't enough — needs a top-heavy wash strong enough to
          read over her face, easing off toward the bottom where the CTAs
          and icon buttons already carry their own solid backgrounds. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,248,244,0.96) 0%, rgba(250,248,244,0.9) 45%, rgba(250,248,244,0.72) 68%, rgba(250,248,244,0.35) 88%, rgba(250,248,244,0.15) 100%)",
        }}
      />

      {/* Soft plum/lavender blob drifting behind the text column (20s loop). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] top-[8%] w-[520px] h-[520px] max-w-[90vw]"
      >
        <div className="motion-blob w-full h-full rounded-full bg-[radial-gradient(circle_at_40%_40%,var(--color-plum-200),var(--color-lavender-200)_55%,transparent_72%)] opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <IntroFade className="inline-flex items-center gap-2 self-start bg-plum-100 border border-neutral-300 rounded-full px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-plum-600" />
            <RotatingText items={hero.roles} className="font-mono text-xs tracking-wide text-plum-700 font-semibold" />
          </IntroFade>

          <WordReveal
            as="h1"
            className="font-display font-semibold text-4xl sm:text-5xl lg:text-[52px] leading-[1.12] text-neutral-900 tracking-tight"
          >
            {hero.heading}
          </WordReveal>

          <IntroFade
            as="p"
            after={hero.heading}
            step={1}
            className="max-w-[520px] text-[17px] leading-relaxed text-neutral-600"
          >
            {hero.description}
          </IntroFade>

          <IntroFade after={hero.heading} step={2} className="flex items-center gap-3.5 flex-wrap mt-1.5">
            <Button
              href={hero.ctaPrimary.href}
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              }
              arrow
            >
              {hero.ctaPrimary.label}
            </Button>
            <Button href={hero.ctaSecondary.href} variant="secondary">
              {hero.ctaSecondary.label}
            </Button>
            <ArrowLink href={hero.ctaTertiary.href}>{hero.ctaTertiary.label}</ArrowLink>
          </IntroFade>

          <IntroFade after={hero.heading} step={3} className="flex items-center gap-3 mt-2">
            <a
              href="#"
              aria-label="GitHub"
              className="w-[38px] h-[38px] rounded-full border border-neutral-300 flex items-center justify-center text-neutral-800 hover:border-plum-600 hover:text-plum-600 motion-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-[38px] h-[38px] rounded-full border border-neutral-300 flex items-center justify-center text-neutral-800 hover:border-plum-600 hover:text-plum-600 motion-btn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              aria-label="Email"
              className="w-[38px] h-[38px] rounded-full border border-neutral-300 flex items-center justify-center text-neutral-800 hover:border-plum-600 hover:text-plum-600 motion-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>
          </IntroFade>
        </div>

        {/* Empty spacer column: keeps the text on the left while the
            right side of the full-bleed photo stays visible on desktop. */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
}
