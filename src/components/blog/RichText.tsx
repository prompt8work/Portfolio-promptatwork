import type { ReactNode } from "react";
import { slugify } from "../../lib/slugify";

// Blog bodies are plain text in Sanity with a small Markdown subset, so a
// post reads as an article (sections, lists, steps, sources) instead of a
// wall of equal paragraphs. Supported, one block per blank-line group:
//
//   ## Section heading        ### Sub-heading
//   - bullet / * bullet       1. numbered step
//   > highlighted tip         --- divider
//   ![Caption](https://…)     an image, captioned
//   | A | B |                 a table; the first row is the header,
//   |---|---|                 the second the separator
//   | 1 | 2 |
//   **bold**, *italic*, `code`, [text](https://…) and bare https:// links inline
//
// A "## Sources" / "## References" section renders as a references card.
// Text without any of this still renders as ordinary paragraphs. Raw HTML
// is never rendered: it shows as text, so a post can't inject markup.

type Block =
  | { kind: "h2" | "h3" | "p" | "quote"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "img"; alt: string; src: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "hr" };

const bullet = /^\s*[-*]\s+/;
const numbered = /^\s*\d+[.)]\s+/;
const image = /^!\[([^\]]*)\]\((https:\/\/[^\s)]+)\)$/;
const tableRow = /^\|.*\|$/;
const tableSeparator = /^\|(\s*:?-{3,}:?\s*\|)+$/;
const referencesHeading = /^(sources|references|further reading)\b/i;

const cells = (row: string) =>
  row
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim());

function parse(text: string): Block[] {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split("\n").map((l) => l.trim());
      const h = chunk.match(/^(#{2,3})\s+(.+)$/);
      if (h && lines.length === 1) return { kind: h[1].length === 2 ? "h2" : "h3", text: h[2] };
      if (lines.length === 1 && /^(-{3,}|\*{3,})$/.test(chunk)) return { kind: "hr" };
      const img = lines.length === 1 && chunk.match(image);
      if (img) return { kind: "img", alt: img[1], src: img[2] };
      if (lines.length >= 3 && lines.every((l) => tableRow.test(l)) && tableSeparator.test(lines[1].replace(/\s/g, "")))
        return { kind: "table", head: cells(lines[0]), rows: lines.slice(2).map(cells) };
      if (lines.every((l) => bullet.test(l))) return { kind: "ul", items: lines.map((l) => l.replace(bullet, "")) };
      if (lines.every((l) => numbered.test(l))) return { kind: "ol", items: lines.map((l) => l.replace(numbered, "")) };
      if (lines.every((l) => l.startsWith(">"))) return { kind: "quote", text: lines.map((l) => l.replace(/^>\s?/, "")).join("\n") };
      return { kind: "p", text: chunk };
    });
}

const inlinePattern =
  /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)|]+)|(?<![\w*])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![\w*])/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(inlinePattern)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1]) out.push(<strong key={key} className="font-semibold text-ink">{inline(m[1])}</strong>);
    else if (m[2])
      out.push(
        <code key={key} className="font-mono text-[0.86em] text-primary bg-surface-container border border-line rounded px-1.5 py-0.5">
          {m[2]}
        </code>,
      );
    else if (m[6]) out.push(<em key={key}>{inline(m[6])}</em>);
    else out.push(<ExternalLink key={key} href={m[4] ?? m[5]}>{m[3] ?? hostOf(m[5])}</ExternalLink>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline decoration-primary/40 underline-offset-[3px] hover:decoration-primary break-words"
    >
      {children}
    </a>
  );
}

function renderBlock(b: Block, key: number): ReactNode {
  switch (b.kind) {
    case "h2":
      return (
        <h2 key={key} id={slugify(b.text)} className="scroll-mt-28 pt-6 text-[22px] sm:text-2xl font-semibold tracking-tight text-ink">
          {inline(b.text)}
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} id={slugify(b.text)} className="scroll-mt-28 pt-2 text-lg font-semibold text-ink">
          {inline(b.text)}
        </h3>
      );
    case "ul":
      return (
        <ul key={key} className="flex flex-col gap-2.5 pl-1">
          {b.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="flex flex-col gap-3">
          {b.items.map((item, i) => (
            <li key={i} className="flex gap-3.5 rounded-xl border border-line bg-card px-4 py-3.5">
              <span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[13px] font-semibold text-primary"
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{inline(item)}</span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <aside key={key} className="rounded-xl border border-secondary/30 bg-accent-violet/8 border-l-4 border-l-primary px-5 py-4 text-ink">
          {inline(b.text)}
        </aside>
      );
    case "hr":
      return <hr key={key} className="my-2 border-line" />;
    case "img":
      return (
        <figure key={key} className="flex flex-col gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- any https host may appear in a post; next/image needs each one allow-listed */}
          <img src={b.src} alt={b.alt} loading="lazy" className="w-full rounded-2xl border border-line" />
          {b.alt && <figcaption className="text-center text-sm text-muted">{inline(b.alt)}</figcaption>}
        </figure>
      );
    case "table":
      return (
        <div key={key} className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
            <thead className="bg-surface-container">
              <tr>
                {b.head.map((c, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-semibold text-ink">
                    {inline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-t border-line">
                  {b.head.map((_, c) => (
                    <td key={c} className="px-4 py-3 align-top">
                      {inline(row[c] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return (
        <p key={key} className="whitespace-pre-line">
          {inline(b.text)}
        </p>
      );
  }
}

/** One reference line: "Label: https://…" shows the label, linked, with its domain. */
function Reference({ text }: { text: string }) {
  const m = text.match(/^(.*?):?\s*(https?:\/\/\S+)$/);
  if (!m || !m[1]) return <li className="text-sm">{inline(text)}</li>;
  const [, label, url] = m;
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start justify-between gap-4 rounded-lg px-3 py-2.5 -mx-3 hover:bg-surface-container"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink group-hover:text-primary">{label}</span>
          <span className="text-xs text-muted">{hostOf(url)}</span>
        </span>
        <span aria-hidden className="mt-0.5 text-muted group-hover:text-primary">↗</span>
      </a>
    </li>
  );
}

function References({ heading, blocks }: { heading: string; blocks: Block[] }) {
  const items = blocks.flatMap((b) => ("items" in b ? b.items : "text" in b ? [b.text] : []));
  return (
    <section aria-labelledby={slugify(heading)} className="mt-4 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h2 id={slugify(heading)} className="scroll-mt-28 text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-3">
        {heading}
      </h2>
      <ul className="flex flex-col">
        {items.map((t, i) => (
          <Reference key={i} text={t} />
        ))}
      </ul>
    </section>
  );
}

export default function RichText({ text }: { text: string }) {
  const blocks = parse(text);
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.kind === "h2" && referencesHeading.test(b.text)) {
      // The references section runs to the next "##" heading.
      let end = i + 1;
      while (end < blocks.length && blocks[end].kind !== "h2") end++;
      out.push(<References key={i} heading={b.text} blocks={blocks.slice(i + 1, end)} />);
      i = end - 1;
      continue;
    }
    out.push(renderBlock(b, i));
  }
  return <div className="flex flex-col gap-5 text-[16px] leading-[1.75] text-on-surface-variant">{out}</div>;
}
