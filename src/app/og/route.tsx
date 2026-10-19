import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

// Dynamic Open Graph share image — code-generated per request, not a
// static file, so real page titles render as real text (per the design
// spec's own reasoning in Docs/design/asset-prompt-library.md §10.1:
// baked-in text from an image generator won't update when titles change).
// Wired in via buildMetadata() in src/lib/site.ts, so every page that
// already calls buildMetadata() picks this up automatically.
export const runtime = "nodejs";

// Luminous SaaS dark canvas (src/app/paw-tokens.css) with the chevron-
// network mark. Variants only change the accent glow: blue for writing,
// violet for builds, the warm note for training.
const BASE = { bg: "#0f172a", text: "#f8fafc", sub: "#94a3b8", word: "#4d8eff", ring: "linear-gradient(135deg, #3b82f6, #8b5cf6)" };
const VARIANTS = {
  blog: { glow: "rgba(59,130,246,0.35)", glow2: "rgba(139,92,246,0.25)" },
  project: { glow: "rgba(139,92,246,0.38)", glow2: "rgba(59,130,246,0.22)" },
  tool: { glow: "rgba(139,92,246,0.38)", glow2: "rgba(59,130,246,0.22)" },
  training: { glow: "rgba(223,116,18,0.32)", glow2: "rgba(139,92,246,0.25)" },
} as const;

export type OgVariant = keyof typeof VARIANTS;

// Geist (SIL Open Font License, from Google Fonts) so the share image uses
// the site's typeface. The two-tone wordmark is two text runs, which the
// renderer doesn't kern across, so "AtWork" is pulled 2px left to close the
// "t|A" gap the browser closes on the site.
// Every path is a literal so the build traces only these files (a
// variable path makes it bundle the whole project into this function).
const read = {
  geist400: () => readFileSync(path.join(process.cwd(), "src/app/og/fonts/Geist-400.ttf")),
  geist600: () => readFileSync(path.join(process.cwd(), "src/app/og/fonts/Geist-600.ttf")),
  mark: () => readFileSync(path.join(process.cwd(), "public/images/brand/promptatwork-mark.png")),
  headshot: () => readFileSync(path.join(process.cwd(), "public/images/headshot.png")),
};

let assets: { fonts: { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]; mark: string; headshot: string } | null = null;
function loadAssets() {
  const png = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`;
  assets ??= {
    fonts: [
      { name: "Geist", data: read.geist400(), weight: 400, style: "normal" },
      { name: "Geist", data: read.geist600(), weight: 600, style: "normal" },
    ],
    mark: png(read.mark()),
    headshot: png(read.headshot()),
  };
  return assets;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

// A post's cover image, as a data URI the renderer can draw. Only Sanity's
// CDN is fetched (never an arbitrary URL from the query string), asked for
// as a JPEG cropped to the panel; any failure falls back to the headshot.
async function loadCover(raw: string | null): Promise<string | null> {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io") return null;
    url.search = "w=840&h=1000&fit=crop&fm=jpg&q=80";
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) return null;
    return `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const a = loadAssets();
  const { searchParams } = new URL(request.url);
  const title = truncate(searchParams.get("title") || "PromptAtWork", 90);
  const subtitle = searchParams.get("subtitle") ? truncate(searchParams.get("subtitle")!, 150) : null;
  const eyebrow = searchParams.get("eyebrow") ? truncate(searchParams.get("eyebrow")!, 32) : null;
  const cover = await loadCover(searchParams.get("image"));
  const variantKey = (searchParams.get("variant") as OgVariant) || "blog";
  const v = VARIANTS[variantKey] ?? VARIANTS.blog;
  // Longer titles need a smaller size to avoid awkward mid-word wraps
  // against the fixed-width text column; a subheading takes room too.
  const titleFontSize = subtitle
    ? title.length > 60 ? 36 : title.length > 40 ? 42 : 48
    : title.length > 55 ? 38 : title.length > 38 ? 44 : 52;
  // A subheading needs a wider text column, so the headshot shrinks.
  const portrait = subtitle ? 400 : 500;

  const card = new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        position: "relative",
        fontFamily: "Geist",
        background: `radial-gradient(60% 80% at 85% 20%, ${v.glow}, transparent 70%), radial-gradient(45% 60% at 0% 100%, ${v.glow2}, transparent 70%), ${BASE.bg}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 40px 64px 72px", width: subtitle ? 720 : 700 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: eyebrow ? 32 : 44 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't work inside ImageResponse */}
          <img src={a.mark} width={56} height={56} style={{ borderRadius: 14 }} alt="" />
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: BASE.text }}>
            <div style={{ display: "flex" }}>Prompt</div>
            <div style={{ display: "flex", color: BASE.word, marginLeft: -2 }}>AtWork</div>
          </div>
        </div>
        {eyebrow && (
          <div style={{ display: "flex", marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 600,
                color: "#c4b5fd",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                padding: "7px 16px",
                borderRadius: 999,
                border: "1.5px solid rgba(139,92,246,0.55)",
                background: "rgba(139,92,246,0.14)",
              }}
            >
              {eyebrow}
            </div>
          </div>
        )}
        <div style={{ display: "flex", fontSize: titleFontSize, fontWeight: 600, color: BASE.text, lineHeight: 1.16, maxWidth: 600, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ display: "flex", fontSize: 23, color: "#cbd5e1", lineHeight: 1.4, marginTop: 20, maxWidth: 600 }}>{subtitle}</div>
        )}
        <div style={{ display: "flex", fontSize: 21, color: BASE.sub, marginTop: subtitle ? 26 : 32 }}>promptatwork.com</div>
      </div>

      {cover ? (
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 56,
            top: 56,
            width: 392,
            height: 518,
            borderRadius: 28,
            padding: 4,
            background: BASE.ring,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't work inside ImageResponse */}
          <img src={cover} width={384} height={510} style={{ objectFit: "cover", borderRadius: 24 }} alt="" />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: subtitle ? 56 : 64,
            top: (630 - portrait) / 2,
            width: portrait,
            height: portrait,
            borderRadius: "50%",
            padding: 6,
            background: BASE.ring,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't work inside ImageResponse */}
          <img src={a.headshot} width={portrait - 12} height={portrait - 12} style={{ objectFit: "cover", borderRadius: "50%" }} alt="" />
        </div>
      )}
    </div>,
    { width: 1200, height: 630, fonts: a.fonts },
  );

  // ImageResponse only makes PNG, and with the headshot photo that's
  // ~500 KB, over WhatsApp's ~300 KB limit for link previews (it then shows
  // the bare URL). Re-encoded as JPEG it's well under it.
  const jpeg = await sharp(Buffer.from(await card.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      // The title is in the URL, so a cached card can't go stale; cache it
      // so link-preview crawlers (which time out fast) get it instantly.
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
