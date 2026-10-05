import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // /og reads the headshot photo from disk at runtime to compose the
  // social share image; make sure it's traced into that function's bundle.
  outputFileTracingIncludes: {
    "/og": ["./public/images/headshot.png"],
  },
  // Work, Engineering and About were folded into the AI Lab hub and the
  // homepage (Docs/development-plan/11-ai-lab-docs-hub.md). Permanent so
  // search engines and shared links move to the new URLs.
  async redirects() {
    return [
      { source: "/projects", destination: "/ai-lab/work", permanent: true },
      { source: "/projects/:slug", destination: "/ai-lab/work/:slug", permanent: true },
      { source: "/engineering", destination: "/ai-lab/engineering", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      // The single Resume page (and its PDF download) became two portfolio
      // profiles, and the Experience timeline lives inside them now.
      { source: "/resume", destination: "/portfolio", permanent: true },
      { source: "/resume/:path*", destination: "/portfolio", permanent: true },
      { source: "/experience", destination: "/portfolio", permanent: true },
    ];
  },
  // Baseline security headers on every response. No Content-Security-Policy
  // yet: the embedded Studio, Mermaid and YouTube embeds each need their
  // own allowances, so a CSP needs its own tested pass rather than a guess.
  // SAMEORIGIN (not DENY) so Sanity Studio's same-origin previews still work.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
