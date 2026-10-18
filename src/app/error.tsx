"use client";

import { useEffect } from "react";
import Link from "next/link";
import Nav from "../components/Nav";
import SiteFooter from "../components/SiteFooter";

// Catches uncaught exceptions below the root layout — most likely a Sanity
// or Supabase fetch failing during render. Never shows error.message: in
// production it's a generic string anyway, and internals stay in logs
// (same rule as the Server Actions' generic error states).
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="paw-page min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <div className="max-w-[760px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24">
          <p className="font-mono text-xs tracking-[0.14em] text-cyan-700 mb-3">ERROR</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-neutral-900 mb-4">
            Something went wrong loading this page
          </h1>
          <p className="text-[15px] leading-relaxed text-neutral-700 mb-8">
            It&apos;s usually temporary. Try again, or head back to the homepage.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="paw-btn paw-btn--primary"
            >
              Try again
            </button>
            <Link
              href="/"
              className="motion-btn inline-flex items-center gap-2.5 text-[15px] font-semibold px-6 py-3.5 rounded-xl bg-transparent text-neutral-900 border-[1.5px] border-neutral-300 hover:border-neutral-400"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
