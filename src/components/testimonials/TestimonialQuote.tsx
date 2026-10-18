import type { ReactNode } from "react";

/** One testimonial as a carousel slide — shared by the home page and training detail pages. */
export default function TestimonialQuote({ quote, name, detail }: { quote: string; name: string; detail?: ReactNode }) {
  return (
    <figure className="max-w-[720px] mx-auto text-center flex flex-col items-center gap-5 select-none">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="var(--primary)" aria-hidden="true">
        <path d="M9.5 7C6.5 7 4 9.5 4 12.5S6.5 18 9.5 18c.4 0 .8 0 1.1-.1-1 2-2.8 3.4-5.1 3.9l.5 1.7c4.4-1 7.5-4.6 7.5-9.5C13.5 10.5 12 7 9.5 7Zm10 0c-3 0-5.5 2.5-5.5 5.5S16.5 18 19.5 18c.4 0 .8 0 1.1-.1-1 2-2.8 3.4-5.1 3.9l.5 1.7c4.4-1 7.5-4.6 7.5-9.5C23.5 10.5 22 7 19.5 7Z" />
      </svg>
      <blockquote className="text-xl sm:text-2xl italic font-medium text-ink leading-relaxed">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-3 mt-1">
        <span className="w-[42px] h-[42px] rounded-full bg-outline-variant flex items-center justify-center font-mono text-[11px] text-muted">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="text-left">
          <span className="block text-sm font-semibold text-ink">{name}</span>
          {detail && <span className="block text-[12.5px] text-muted">{detail}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
