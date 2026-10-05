import type { Metadata } from "next";
import { Geist, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { siteUrl } from "../lib/site";
import { siteKeywords, personName } from "../lib/seo";
import { motionCssVars } from "../lib/motion";
import MotionProvider from "../components/motion/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} h-full antialiased`}
      style={motionCssVars}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) inject attributes onto <body> before React
          hydrates — a client-only mismatch, not a real SSR bug. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
