"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Heading = { id: string; text: string; level: number };

/**
 * "On this page" — built from the h2/h3 headings (with ids) inside the
 * page's [data-docs-content] element, so pages never keep a second,
 * hand-written list in sync. Highlights the heading currently in view.
 */
export default function DocsToc() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = document.querySelector("[data-docs-content]");
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("h2[id], h3[id]"));
    // Read the rendered page on the next frame, once the new page's content is in the DOM.
    const frame = requestAnimationFrame(() => {
      setHeadings(els.map((el) => ({ id: el.id, text: el.textContent ?? "", level: el.tagName === "H3" ? 3 : 2 })));
      setActiveId(els[0]?.id ?? null);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <span className="font-mono text-[10.5px] font-semibold tracking-[0.14em] text-muted">ON THIS PAGE</span>
      <ul className="flex flex-col gap-2">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block text-[13px] leading-snug ${
                activeId === h.id ? "text-primary font-medium" : "text-muted hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
