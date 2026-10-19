// Minimal allowlist HTML sanitizer for CMS-authored blog bodies.
//
// Blog bodies are written by the site owner (and her review automation)
// in Sanity, so this is defence in depth rather than the only barrier:
// anything outside the allowlist is dropped, every attribute except
// `class` (and `href` on links) is removed, and script-like content is
// stripped entirely. No dependency: the allowlist is small and fixed.

const ALLOWED_TAGS = new Set([
  "p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i", "a",
  "blockquote", "br", "hr", "div", "section", "aside", "span", "code",
  "table", "thead", "tbody", "tr", "th", "td", "small",
]);

// Elements removed together with everything inside them.
const DROP_WITH_CONTENT = /<(script|style|iframe|object|embed|noscript|template|svg|math)\b[\s\S]*?<\/\1\s*>/gi;

const SAFE_HREF = /^(https?:\/\/|mailto:|#|\/)/i;

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function readAttr(attrs: string, name: string): string | null {
  const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  if (!m) return null;
  return (m[2] ?? m[3] ?? m[4] ?? "").trim();
}

export function sanitizeHtml(input: string): string {
  const withoutDangerous = input.replace(/<!--[\s\S]*?-->/g, "").replace(DROP_WITH_CONTENT, "");

  return withoutDangerous.replace(/<\s*(\/?)\s*([a-zA-Z0-9]+)([^>]*)>/g, (_match, slash: string, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (slash) return `</${tag}>`;
    if (tag === "br" || tag === "hr") return `<${tag}>`;

    const out: string[] = [];
    const cls = readAttr(attrs, "class");
    if (cls && /^[\w\s-]+$/.test(cls)) out.push(`class="${escapeAttr(cls)}"`);
    if (tag === "a") {
      const href = readAttr(attrs, "href");
      if (href && SAFE_HREF.test(href)) {
        out.push(`href="${escapeAttr(href)}"`);
        if (/^https?:\/\//i.test(href)) out.push('target="_blank"', 'rel="noopener noreferrer"');
      }
    }
    return out.length ? `<${tag} ${out.join(" ")}>` : `<${tag}>`;
  });
}

/** True when a body was authored as HTML rather than plain text. */
export function isHtmlBody(body: string): boolean {
  return /^\s*<(p|h2|h3|div|section|ul|ol|aside|blockquote)\b/i.test(body);
}
