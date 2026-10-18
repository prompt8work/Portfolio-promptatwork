import Image from "next/image";
import Link from "next/link";
import type { Offering } from "../../lib/portfolio";
import { CtaButton, Highlight, card, faint, muted } from "../portfolio/ui";

// The workshop / solution card: category badge, cover, title, highlights,
// description, "Ideal for" line and an optional button. Shared by the
// portfolio's offerings grid and the /training hub. Covers keep their own
// colours: thumbnails stay dark in both themes.

// Luminous SaaS tokens, so the card follows the light/dark toggle.
const t = {
  card: `${card} hover:border-[color-mix(in_srgb,var(--accent-violet)_60%,transparent)]`,
  badge: `border-outline-variant ${muted}`,
  dot: { cyan: "bg-primary", green: "bg-secondary", violet: "bg-accent-violet" },
  title: "text-ink",
  titleLink: "hover:text-primary",
  faint,
  muted,
  strong: muted,
  cover: "border-white/10",
  focus: "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary",
};

// Cover gradients stand in for designed workshop artwork (thumbVariant 1–9).
const banners = [
  "from-[#0e7490] to-[#064e3b]",
  "from-[#1e3a8a] to-[#0e7490]",
  "from-[#312e81] to-[#0f766e]",
  "from-[#7c2d12] to-[#1e293b]",
  "from-[#065f46] to-[#1e3a8a]",
  "from-[#4c1d95] to-[#0e7490]",
  "from-[#0f172a] to-[#155e75]",
  "from-[#14532d] to-[#0c4a6e]",
  "from-[#1e1b4b] to-[#7c2d12]",
];

/** Cover gradient for an offering's thumbVariant (also used by TrainingHero). */
export function bannerGradient(variant?: number) {
  return banners[((variant ?? 1) - 1 + banners.length) % banners.length];
}

export const grid =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:22px_22px]";

export function OfferingBanner({ o, border = t.cover }: { o: Offering; border?: string }) {
  const bg = bannerGradient(o.thumbVariant);
  return (
    <div className={`relative flex aspect-video flex-col justify-between overflow-hidden rounded-[14px] border bg-linear-to-br p-[18px] ${border} ${bg}`}>
      {o.image ? (
        <>
          <Image src={o.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/55 via-transparent to-black/60" />
        </>
      ) : (
        <div className={grid} />
      )}
      <div className="relative max-w-[85%] text-2xl leading-[1.05] font-extrabold tracking-tight text-white uppercase">
        <Highlight text={o.thumbTitle ?? o.title} className="rounded bg-[#facc15] px-1.5 text-[#111]" />
      </div>
      <Tools items={o.thumbTools} />
    </div>
  );
}

export function Tools({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="relative flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="rounded-md border border-white/15 bg-black/35 px-2 py-1 font-mono text-[11px] text-white">
          {t}
        </span>
      ))}
    </div>
  );
}

/** Colours a pipeline sketch: # comments dim, arrows and prompts cyan, quotes green. */
function SnippetLine({ line }: { line: string }) {
  if (line.trimStart().startsWith("#")) return <span className="text-slate-400">{line}</span>;
  return (
    <>
      {line.split(/("[^"]*"|→|⇄|↺|\$|>)/g).map((part, i) =>
        part.startsWith('"') ? (
          <span key={i} className="text-secondary">{part}</span>
        ) : /^(→|⇄|↺|\$|>)$/.test(part) ? (
          <span key={i} className="text-primary">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}

function Terminal({ snippet }: { snippet?: string }) {
  return (
    <div data-theme="dark" className="overflow-hidden rounded-[14px] border border-white/10 bg-[#050c17]">
      <div className="flex gap-1.5 border-b border-white/[0.06] bg-white/[0.04] px-3 py-2.5">
        <i className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
      </div>
      <pre className="min-h-32 px-3.5 pt-3.5 pb-4 font-mono text-[12.5px] leading-[1.7] whitespace-pre-wrap text-slate-300">
        {(snippet ?? "").split("\n").map((line, i) => (
          <div key={i}>
            <SnippetLine line={line} />
          </div>
        ))}
      </pre>
    </div>
  );
}

/**
 * With `o.href`, the title and cover link to the offering's page. `linkCard`
 * stretches the title link over the whole card (used on /training, where
 * cards have no button of their own).
 */
export default function OfferingCard({
  o,
  linkCard = false,
}: {
  o: Offering;
  linkCard?: boolean;
}) {
  const stretched = linkCard && !!o.href;
  // A banner without an image would only repeat the title on a gradient, so
  // the card's own content goes on the gradient instead (dark in both
  // themes, like the covers).
  const onArt = o.thumbStyle !== "terminal" && !o.image;
  const cover = o.thumbStyle === "terminal" ? <Terminal snippet={o.snippet} /> : <OfferingBanner o={o} border={t.cover} />;

  return (
    <article
      data-theme={onArt ? "dark" : undefined}
      className={`${t.card} ${o.href ? t.focus : ""} group relative flex flex-col p-4 transition hover:-translate-y-0.5 ${onArt ? `isolate overflow-hidden bg-linear-to-br p-5 ${bannerGradient(o.thumbVariant)}` : ""}`}
    >
      {onArt && <div className={`${grid} -z-10`} />}
      <span className={`mb-3 inline-flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-xs font-semibold ${t.badge}`}>
        <i className={`h-[7px] w-[7px] rounded-full ${t.dot[o.tone ?? "cyan"]}`} />
        {o.category}
      </span>
      {onArt ? null : o.href && !stretched ? (
        // Mouse shortcut only; the title link is the one keyboard and screen-reader users get.
        <Link href={o.href} tabIndex={-1} aria-hidden className="block">
          {cover}
        </Link>
      ) : (
        cover
      )}
      <h3 className={`${onArt ? "mt-2" : "mt-4"} mb-1.5 text-lg font-semibold ${t.title}`}>
        {o.href ? (
          <Link
            href={o.href}
            className={`${t.title} ${t.titleLink} focus-visible:outline-none ${stretched ? "after:absolute after:inset-0 after:rounded-[20px]" : ""}`}
          >
            {o.title}
          </Link>
        ) : (
          o.title
        )}
      </h3>
      {!!o.meta?.length && (
        <div className={`mb-2.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[13px] ${t.faint}`}>
          {o.meta.map((m, i) => (
            <span key={m}>
              {i > 0 && <span className="mr-2.5">•</span>}
              {m}
            </span>
          ))}
        </div>
      )}
      {o.description && <p className={`mb-4 flex-1 text-[15px] ${t.muted}`}>{o.description}</p>}
      {onArt && !!o.thumbTools?.length && (
        <div className="mb-4">
          <Tools items={o.thumbTools} />
        </div>
      )}
      {(o.footText || o.link) && (
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {o.footText && (
            <span className={`text-[13px] ${t.faint}`}>
              {o.footLabel && `${o.footLabel}: `}
              <b className={`font-medium ${t.strong}`}>{o.footText}</b>
            </span>
          )}
          <CtaButton cta={o.link} small />
        </div>
      )}
    </article>
  );
}

/**
 * Category filter pills. Pass `href` on each option to make them links
 * (deep-linkable tabs), or `onSelect` to filter in place.
 */
export function FilterPills({
  options,
  active,
  onSelect,
  className = "",
}: {
  options: { key: string | null; label: string; href?: string }[];
  active: string | null;
  onSelect?: (key: string | null) => void;
  className?: string;
}) {
  const base = "rounded-full border px-4 py-2 text-sm transition-colors";
  const on = "border-transparent bg-linear-to-r from-accent-blue to-accent-violet font-semibold text-white hover:text-white";
  const off = `border-outline-variant ${muted} hover:text-ink`;
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Filter by category">
      {options.map((opt) => {
        const isOn = active === opt.key;
        const cls = `${base} ${focus} ${isOn ? on : off}`;
        return opt.href ? (
          <Link key={opt.key ?? "all"} href={opt.href} scroll={false} replace aria-current={isOn ? "true" : undefined} className={cls}>
            {opt.label}
          </Link>
        ) : (
          <button key={opt.key ?? "all"} type="button" aria-pressed={isOn} onClick={() => onSelect?.(opt.key)} className={cls}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
