import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { siteUrl } from "../lib/site";
import { siteKeywords, personName } from "../lib/seo";
import { motionCssVars } from "../lib/motion";
import { themeScript } from "../lib/theme";
import MotionProvider from "../components/motion/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const defaultTitle = "Niharika Dhande — AI Enablement Officer, AI Solutions Engineer & Prompt Engineer, Indore | PromptAtWork";
const defaultDescription =
  "Niharika Dhande is an AI Enablement Officer, AI Solutions Engineer and corporate AI trainer based in Indore, India — AI enablement, RAG and AI integrations, and hands-on AI training.";
const defaultOgImage = `${siteUrl}/og?title=${encodeURIComponent(defaultTitle)}&variant=blog`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  applicationName: "PromptAtWork",
  keywords: siteKeywords,
  authors: [{ name: personName, url: siteUrl }],
  creator: personName,
  publisher: personName,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Paste the content value of the Google Search Console / Bing Webmaster
  // "HTML tag" verification into these env vars; unset means no tag.
  verification: {
    // Either name works: Vercel production has GOOGLE_SITE_VERIFICATION.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    siteName: "PromptAtWork",
    locale: "en_IN",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: defaultTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is a server default; themeScript swaps it for the visitor's
    // stored or system theme before first paint, so <html> needs
    // suppressHydrationWarning (Next guide: preventing-flash-before-hydration).
    <html
      lang="en-IN"
      data-theme="dark"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      style={motionCssVars}
      suppressHydrationWarning
    >
      <head>
        {/* text/plain on the client: the script has already run during
            parsing, and React warns about rendering an executable <script>
            on the client (the 404 page renders this tree client-side). */}
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) inject attributes onto <body> before React
          hydrates — a client-only mismatch, not a real SSR bug. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
