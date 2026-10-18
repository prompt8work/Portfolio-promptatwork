import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

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

const dataUris = new Map<string, string>();
function dataUri(file: string): string {
  let uri = dataUris.get(file);
  if (!uri) {
    uri = `data:image/png;base64,${readFileSync(path.join(process.cwd(), file)).toString("base64")}`;
    dataUris.set(file, uri);
  }
  return uri;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = truncate(searchParams.get("title") || "PromptAtWork", 90);
  const variantKey = (searchParams.get("variant") as OgVariant) || "blog";
  const v = VARIANTS[variantKey] ?? VARIANTS.blog;
  // Longer titles need a smaller size to avoid awkward mid-word wraps
  // against the fixed-width text column.
  const titleFontSize = title.length > 55 ? 38 : title.length > 38 ? 44 : 52;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        position: "relative",
        background: `radial-gradient(60% 80% at 85% 20%, ${v.glow}, transparent 70%), radial-gradient(45% 60% at 0% 100%, ${v.glow2}, transparent 70%), ${BASE.bg}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 40px 72px 72px", width: 700 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't work inside ImageResponse */}
          <img src={dataUri("public/images/brand/promptatwork-mark.png")} width={56} height={56} style={{ borderRadius: 14 }} alt="" />
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: BASE.text }}>
            <span>Prompt</span>
            <span style={{ color: BASE.word }}>AtWork</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: titleFontSize, fontWeight: 600, color: BASE.text, lineHeight: 1.18, maxWidth: 580, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 23, color: BASE.sub, marginTop: 32 }}>promptatwork.com</div>
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 64,
          top: 65,
          width: 500,
          height: 500,
          borderRadius: "50%",
          padding: 6,
          background: BASE.ring,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't work inside ImageResponse */}
        <img src={dataUri("public/images/headshot.png")} width={488} height={488} style={{ objectFit: "cover", borderRadius: "50%" }} alt="" />
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
