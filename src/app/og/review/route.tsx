import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

// Share card for tool and model reviews (16:9, 1600x900): works as the
// blog post's cover image and as a LinkedIn image. Everything on it comes
// from query parameters written by the review automation, so the card
// never states anything the review itself doesn't.
//
//   /og/review?title=Should you pay for Claude?&highlight=Claude
//     &label=AI Tool Review&domain=General AI assistants
//     &chips=Projects,Skills,Memory&price=…&tip=…&verdict=…
export const runtime = "nodejs";

let fonts: { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[] | null = null;
function geist() {
  fonts ??= ([400, 600] as const).map((weight) => ({
    name: "Geist",
    data: readFileSync(path.join(process.cwd(), `src/app/og/fonts/Geist-${weight}.ttf`)),
    weight,
    style: "normal" as const,
  }));
  return fonts;
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

const C = {
  bg: "#0b1326",
  ink: "#f8fafc",
  sub: "#c2c6d6",
  muted: "#94a3b8",
  card: "rgba(30,41,59,0.85)",
  line: "#334155",
  hi: "#adc6ff",
  pillInk: "#c4abff",
};

function Fact({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        background: C.card,
        border: `2px solid ${highlight ? "rgba(77,142,255,0.8)" : C.line}`,
        borderRadius: 22,
        padding: "24px 28px",
        boxShadow: highlight ? "0 12px 32px rgba(59,130,246,0.25)" : "none",
      }}
    >
      <div style={{ display: "flex", fontSize: 19, fontWeight: 600, letterSpacing: 2, color: C.muted, textTransform: "uppercase" }}>{k}</div>
      <div style={{ display: "flex", marginTop: 10, fontSize: 29, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{v}</div>
    </div>
  );
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const title = clip(q.get("title") || "AI review", 60);
  const highlight = (q.get("highlight") || "").trim();
  const label = clip(q.get("label") || "AI Tool Review", 28);
  const domain = clip(q.get("domain") || "", 40);
  const sub = clip(q.get("sub") || "", 130);
  const chips = (q.get("chips") || "").split(",").map((c) => clip(c.trim(), 24)).filter(Boolean).slice(0, 5);
  const price = clip(q.get("price") || "", 70);
  const tip = clip(q.get("tip") || "", 70);
  const verdict = clip(q.get("verdict") || "", 70);
  const author = clip(q.get("author") || "Niharika Dhande · AI Solutions Engineer & Trainer", 70);

  // Split the title around the highlighted word so it can take the accent colour.
  const at = highlight ? title.indexOf(highlight) : -1;
  const titleParts =
    at >= 0
      ? [title.slice(0, at), highlight, title.slice(at + highlight.length)]
      : [title, "", ""];
  const titleSize = title.length > 44 ? 72 : title.length > 32 ? 84 : 92;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1600px",
        height: "900px",
        padding: "76px 88px 64px",
        fontFamily: "Geist",
        color: C.ink,
        background: `radial-gradient(55% 75% at 90% 5%, rgba(59,130,246,0.32), transparent 70%), radial-gradient(45% 60% at 0% 100%, rgba(139,92,246,0.30), transparent 70%), ${C.bg}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: C.pillInk,
            background: "rgba(87,27,193,0.35)",
            border: "2px solid rgba(208,188,255,0.45)",
            padding: "10px 22px",
            borderRadius: 999,
          }}
        >
          {label}
        </div>
        {domain && <div style={{ display: "flex", fontSize: 22, color: C.muted }}>{domain}</div>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: 40, fontSize: titleSize, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 1300 }}>
        {titleParts[0] && <span style={{ whiteSpace: "pre" }}>{titleParts[0]}</span>}
        {titleParts[1] && <span style={{ color: C.hi }}>{titleParts[1]}</span>}
        {titleParts[2] && <span style={{ whiteSpace: "pre" }}>{titleParts[2]}</span>}
      </div>

      {sub && <div style={{ display: "flex", marginTop: 22, fontSize: 31, color: C.sub, lineHeight: 1.3, maxWidth: 1150 }}>{sub}</div>}

      {chips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 40 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 600,
                color: "#dae2fd",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(59,130,246,0.12)",
                border: "2px solid rgba(77,142,255,0.4)",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 22, marginTop: "auto" }}>
        {price && <Fact k="Price in India" v={price} />}
        {tip && <Fact k="Do this today" v={tip} highlight />}
        {verdict && <Fact k="My verdict" v={verdict} />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 34, fontSize: 22, color: C.muted }}>
        <div style={{ display: "flex" }}>{author}</div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: C.hi }}>promptatwork.com</div>
      </div>
    </div>,
    { width: 1600, height: 900, fonts: geist() },
  );
}
