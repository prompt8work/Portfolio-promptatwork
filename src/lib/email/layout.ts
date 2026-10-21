import { brand } from "../navigation";
import { siteUrl } from "../site";
import type { SiteSettings } from "../content-types";

// Branded shell shared by every email the site sends (contact notification
// and confirmation). Email clients ignore stylesheets and most modern CSS, so
// this is table layout with inline styles. Colours are the site's tokens
// (paw-tokens.css): dark header like the site, light body for readability.

export const emailColors = {
  canvas: "#0b1326",
  header: "#0f172a",
  accent: "#4d8eff",
  violet: "#8b5cf6",
  ink: "#1a1f36",
  muted: "#5b6478",
  line: "#e3e7ef",
  page: "#f3f5fa",
};

const c = emailColors;

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

const withHttps = (handle?: string) => (handle ? (handle.startsWith("http") ? handle : `https://${handle}`) : undefined);

export function button(label: string, href: string, variant: "solid" | "outline" = "solid") {
  const solid = variant === "solid";
  return `<a href="${href}" style="display:inline-block;padding:11px 20px;border-radius:10px;font-weight:600;font-size:14px;text-decoration:none;${
    solid ? `background:${c.accent};color:#ffffff;` : `border:1px solid ${c.accent};color:${c.accent};`
  }">${escapeHtml(label)}</a>`;
}

export function sectionTitle(text: string) {
  return `<p style="margin:28px 0 10px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${c.violet}">${escapeHtml(text)}</p>`;
}

/** A linked card row: title, one line, arrow link. */
export function linkCard(title: string, text: string, href: string) {
  return `<tr><td style="padding:0 0 10px"><a href="${href}" style="display:block;text-decoration:none;border:1px solid ${c.line};border-radius:12px;padding:14px 16px">
<span style="display:block;font-weight:700;color:${c.ink};font-size:15px">${escapeHtml(title)}</span>
<span style="display:block;color:${c.muted};font-size:13px;line-height:1.5;margin-top:3px">${escapeHtml(text)}</span>
<span style="display:block;color:${c.accent};font-size:13px;font-weight:600;margin-top:6px">View details &rarr;</span></a></td></tr>`;
}

export function cards(rows: string[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows.join("")}</table>`;
}

type LayoutOptions = {
  settings: SiteSettings;
  /** Hidden inbox preview line. */
  preheader?: string;
  body: string;
};

export function emailLayout({ settings, preheader, body }: LayoutOptions) {
  const logo = absoluteUrl(brand.logo);
  const footerLinks = [
    ["Courses", absoluteUrl("/training")],
    ["AI Lab", absoluteUrl("/ai-lab")],
    ["Blog", absoluteUrl("/blog")],
    ["Contact", absoluteUrl("/contact")],
  ]
    .map(([label, href]) => `<a href="${href}" style="color:#c2c6d6;text-decoration:none;margin:0 8px">${label}</a>`)
    .join("&middot;");
  const social = [
    ["LinkedIn", withHttps(settings.linkedin)],
    ["GitHub", withHttps(settings.github)],
  ]
    .filter(([, href]) => href)
    .map(([label, href]) => `<a href="${href}" style="color:${c.accent};text-decoration:none;margin:0 8px">${label}</a>`)
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${escapeHtml(settings.brandName)}</title></head>
<body style="margin:0;padding:0;background:${c.page}">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.page}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:separate;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<tr><td style="background:${c.header};border-radius:16px 16px 0 0;padding:20px 28px">
<a href="${siteUrl}" style="text-decoration:none"><img src="${logo}" width="32" height="32" alt="" style="vertical-align:middle;border-radius:8px;border:0">
<span style="vertical-align:middle;margin-left:10px;font-size:19px;font-weight:700;color:#f8fafc">Prompt<span style="color:${c.accent}">AtWork</span></span></a>
</td></tr>
<tr><td style="height:4px;background:${c.accent};background-image:linear-gradient(90deg,${c.accent},${c.violet})"></td></tr>
<tr><td style="background:#ffffff;padding:28px;color:${c.ink};font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="background:${c.canvas};border-radius:0 0 16px 16px;padding:22px 28px;text-align:center;font-size:12px;line-height:1.7;color:#8c909f">
${settings.footerBlurb ? `<p style="margin:0 0 10px;color:#c2c6d6">${escapeHtml(settings.footerBlurb)}</p>` : ""}
<p style="margin:0 0 6px">${footerLinks}</p>
${social ? `<p style="margin:0 0 6px">${social}</p>` : ""}
<p style="margin:8px 0 0">${escapeHtml(settings.personName)} &middot; ${escapeHtml(settings.brandName)}${settings.location ? ` &middot; ${escapeHtml(settings.location)}` : ""}</p>
</td></tr>
</table></td></tr></table></body></html>`;
}
