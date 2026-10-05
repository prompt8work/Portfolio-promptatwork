import Image from "next/image";
import Reveal from "../motion/Reveal";
import { DocsTag } from "../docs/DocsHeader";
import type { Institute } from "../../lib/trainings";

/** "Institutes I've trained for" on the light Training hub; same fields as the portfolio's dark cards. */
export default function InstituteCards({ items }: { items: Institute[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((it) => (
        <Reveal key={it.name} className="flex flex-col rounded-[20px] border border-neutral-200 bg-white p-5">
          <div className="mb-4 grid h-[84px] place-items-center rounded-[14px] border border-neutral-200 bg-neutral-50 px-[18px] py-2.5">
            <Image
              src={it.logo.url}
              alt={it.logo.alt ?? it.name}
              width={it.logo.width}
              height={it.logo.height}
              className="h-auto max-h-[54px] w-auto"
              sizes="240px"
            />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-neutral-900">{it.name}</h3>
          <p className="mb-2.5 font-mono text-[13px] text-cyan-700">{it.period}</p>
          <p className="mb-3.5 text-[15px] leading-relaxed text-neutral-600">{it.description}</p>
          {it.highlightText && (
            <p className="mb-3.5 text-sm text-neutral-600">
              {it.highlightLabel && <b className="font-semibold text-neutral-900">{it.highlightLabel}: </b>}
              {it.highlightText}
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-1.5">
            {it.tags.map((t) => (
              <DocsTag key={t}>{t}</DocsTag>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
