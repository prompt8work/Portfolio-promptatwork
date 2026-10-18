"use client";

// Last-resort boundary for errors in the root layout itself. It replaces
// the whole document, so globals.css, the fonts and the theme script aren't
// loaded — hence inline styles only, using the Luminous SaaS dark canvas
// values (the theme's default) from src/app/paw-tokens.css.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0f172a",
          color: "#94a3b8",
          fontFamily: "system-ui, sans-serif",
          padding: "16px",
        }}
      >
        <title>Something went wrong — PromptAtWork</title>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, color: "#f8fafc", margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>
            The site hit an unexpected error. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "14px 24px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
