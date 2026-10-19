"use client";

import { useRef, useState } from "react";
import LinkedinIcon from "../icons/LinkedinIcon";
import CopyButton from "../motion/CopyButton";

// PRD 04.2 FR-03/FR-04/FR-06/NFR-02: sharing goes through LinkedIn's own
// share screens, not an API integration — no LinkedIn key or OAuth; the
// reader still publishes the post themselves.
//
// LinkedIn shows an organic *link* post as a small thumbnail card (the big
// picture is only for promoted posts), so the panel's main path posts the
// share image itself with the link in the text:
//   - phones (Web Share with files): copy the text, then send the image to
//     the share sheet and on to the LinkedIn app, where the text is pasted;
//   - desktop: download the image, then LinkedIn opens with the text filled
//     in and the image is attached with LinkedIn's photo button.
// The text is the post's heading, subheading, link and hashtags from its
// tags, editable before sharing. The plain link card stays as an option.

type Props = { url: string; slug: string; title: string; summary?: string; tags?: string[]; image: string };

/** Tags of up to three words as CamelCase hashtags ("Claude Code" → #ClaudeCode). */
function hashtags(tags: string[] = []) {
  const out = tags
    .map((t) => t.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/))
    .filter((w) => w.length > 0 && w.length <= 3 && w[0])
    .map((w) => "#" + w.map((x) => (x === x.toUpperCase() ? x : x[0].toUpperCase() + x.slice(1))).join(""));
  return [...new Set(out)].slice(0, 5).join(" ");
}

export default function ShareActions({ url, slug, title, summary, tags, image }: Props) {
  const pill =
    "border border-outline-variant text-on-surface-variant text-sm font-semibold px-4 py-2.5 rounded-full hover:border-primary/70 hover:text-primary";
  const dialog = useRef<HTMLDialogElement>(null);
  const initialText = [title, summary, `Read the full post: ${url}`, hashtags(tags)].filter(Boolean).join("\n\n");
  const [text, setText] = useState(initialText);
  const [file, setFile] = useState<File | null>(null);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [status, setStatus] = useState("");

  // Fetch the image when the panel opens, so the share/download click
  // still counts as a user action (Safari refuses a share after a slow await).
  function open() {
    dialog.current?.showModal();
    setStatus("");
    if (file) return;
    fetch(image)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((b) => {
        const ext = b.type === "image/png" ? "png" : "jpg";
        const f = new File([b], `${slug}-promptatwork.${ext}`, { type: b.type || "image/jpeg" });
        setFile(f);
        // Touch devices only: desktop share sheets (macOS, Windows) rarely list LinkedIn.
        setCanShareFiles(matchMedia("(pointer: coarse)").matches && !!navigator.canShare?.({ files: [f] }));
      })
      .catch(() => setFile(null));
  }

  async function copyForPhone() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Text copied. Now tap Share image and choose LinkedIn.");
    } catch {
      setStatus("Couldn't copy here. Select the text above and copy it yourself.");
    }
  }

  // navigator.share must be the first thing the tap does: phones only allow
  // it straight from a tap, and Safari counts an earlier clipboard write
  // against that. The image goes alone: with text attached, several share
  // targets (LinkedIn among them) refuse the share or keep only the text.
  // The text is pasted from step 1.
  async function shareImage() {
    if (!file) return;
    try {
      await navigator.share({ files: [file] });
      setStatus("Sent to the share sheet. In LinkedIn, paste the text from step 1.");
    } catch (e) {
      const name = (e as Error).name;
      if (name !== "AbortError")
        setStatus(`Sharing didn't work on this device (${name}). Download the image instead, then add it in LinkedIn.`);
    }
  }

  function download() {
    if (!file) {
      window.open(image, "_blank", "noopener");
      return;
    }
    const href = URL.createObjectURL(file);
    const a = Object.assign(document.createElement("a"), { href, download: file.name });
    a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    setStatus("Image saved to your Downloads. Next: open LinkedIn.");
  }

  // A LinkedIn share link carries the text but never an image, and pasting
  // an image into LinkedIn's post box isn't reliable, so the image is
  // downloaded and attached with LinkedIn's photo button.
  function openLinkedIn() {
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setStatus(
      file
        ? `In LinkedIn, click the photo button and choose ${file.name} from your Downloads.`
        : "In LinkedIn, click the photo button and choose the image you saved.",
    );
  }

  const step = "flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50";
  const primary = `${step} bg-linear-to-r from-accent-blue to-accent-violet text-white hover:opacity-90`;
  const secondary = `${step} border border-outline-variant text-ink hover:border-primary/70 hover:text-primary`;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button type="button" onClick={open} className={`motion-btn inline-flex items-center gap-2 ${pill}`}>
        <LinkedinIcon className="w-4 h-4" />
        Share on LinkedIn
      </button>
      <CopyButton text={url} label="Copy Link" className={pill} />

      <dialog
        ref={dialog}
        aria-labelledby="share-title"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto w-[calc(100%-32px)] max-w-[620px] max-h-[calc(100dvh-32px)] rounded-2xl border border-line bg-card p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="share-title" className="flex items-center gap-2 text-lg font-semibold">
                <LinkedinIcon className="w-5 h-5 text-primary" />
                Share on LinkedIn
              </h2>
              <p className="text-sm text-muted">
                Posting the picture with the link in the text shows it full size. A plain link shows as a small card.
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="-m-1.5 rounded-full p-1.5 text-muted hover:bg-surface-container hover:text-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element -- the exact share image (Sanity CDN or /og), shown as-is */}
          <img src={image} alt="The image that goes with the post" className="w-full rounded-xl border border-line" />

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Post text (edit before sharing)</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              className="w-full resize-y rounded-lg border border-outline-variant bg-surface-container-low px-3.5 py-3 text-sm leading-relaxed text-ink focus:border-primary/70 focus:outline-none"
            />
          </label>

          {canShareFiles ? (
            <div className="flex flex-col gap-2.5">
              <ol className="grid grid-cols-2 gap-2.5">
                <li className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Step 1</span>
                  <button type="button" onClick={copyForPhone} className={secondary}>
                    Copy text
                  </button>
                </li>
                <li className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Step 2</span>
                  <button type="button" onClick={shareImage} disabled={!file} className={primary}>
                    <LinkedinIcon className="w-4 h-4" />
                    Share image
                  </button>
                </li>
              </ol>
              <p className="text-center text-xs text-muted">
                Choose LinkedIn in the share sheet and paste the text, or{" "}
                <button type="button" onClick={download} className="underline underline-offset-2 hover:text-primary">
                  download the image
                </button>
                .
              </p>
            </div>
          ) : (
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <li className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Step 1</span>
                <button type="button" onClick={download} className={secondary}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
                  </svg>
                  Download image
                </button>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Step 2</span>
                <button type="button" onClick={openLinkedIn} className={primary}>
                  <LinkedinIcon className="w-4 h-4" />
                  Open LinkedIn
                </button>
              </li>
              <li className="sm:col-span-2 text-center text-xs text-muted">
                LinkedIn opens with the text filled in. Add the downloaded image with its photo button.
              </li>
            </ol>
          )}

          <p aria-live="polite" className="min-h-5 text-sm text-primary">
            {status}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline decoration-outline-variant underline-offset-4 hover:text-primary"
            >
              Share as a link card instead
            </a>
            {!canShareFiles && (
              <CopyButton text={text} label="Copy text" className="text-sm font-semibold text-muted hover:text-primary" />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
