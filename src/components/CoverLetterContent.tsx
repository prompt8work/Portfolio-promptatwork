"use client";

import { Download, Mail, MapPin } from "lucide-react";
import PageTransition from "./PageTransition";
import IntroFade from "./motion/IntroFade";
import LinkedinIcon from "./icons/LinkedinIcon";
import { personalInfo, coverLetter } from "../../data";

const sectionHeading =
  "text-base font-bold tracking-wide text-ink border-b-2 border-primary/30 pb-2 mb-3 print:text-sm print:pb-1 print:mb-2";

export default function CoverLetterContent() {
  // "Today's" date, formatted once server-side and again on client
  // hydration (same VideoCard/BatchCard hydration-mismatch pattern —
  // timeZone: "UTC" fixes the timezone half of it) — the remaining sliver
  // of risk is the render happening to straddle a UTC midnight between
  // server and client, which suppressHydrationWarning on the element
  // below accepts as expected for genuinely wall-clock content, the same
  // way <body> already does for the ColorZilla extension mismatch.
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <PageTransition>
      {/* A printable document, so it's pinned to the light theme: it reads
          like paper on screen whatever the visitor's toggle is set to. */}
      <div data-theme="light" className="min-h-screen bg-surface-container text-ink py-8 px-4">
        {/* PDF Export Button - Hidden on Print */}
        <div className="fixed top-4 right-4 z-50 no-print">
          <button
            onClick={handleExportPDF}
            className="motion-btn flex items-center gap-2 bg-primary hover:bg-primary text-white px-6 py-3 rounded-lg shadow-lg font-semibold"
          >
            <Download className="w-5 h-5" />
            Export to PDF
          </button>
        </div>

        <IntroFade>
          <div className="max-w-5xl mx-auto bg-white shadow-sm border border-line rounded-2xl overflow-hidden print:shadow-none print:rounded-none print:border-none">
          <div data-print-header className="bg-surface-container text-ink border-b border-line p-4 md:p-8 print:p-4 print:py-2">
            <div className="text-center md:text-left print:text-left">
              <h1 className="text-2xl md:text-3xl font-semibold mb-1 print:text-xl print:mb-0.5">
                {personalInfo.name}
              </h1>
              <p className="text-muted text-xs md:text-sm mb-4 print:text-xs print:mb-2">
                {personalInfo.title}
              </p>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-4 text-xs print:flex-row print:gap-3 print:text-xs">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 md:hidden print:hidden" />
                  <a href={`mailto:${personalInfo.email}`} className="text-on-surface hover:text-primary transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <LinkedinIcon className="w-3 h-3 md:hidden print:hidden" />
                  <a
                    href={`https://${personalInfo.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-surface hover:text-primary transition-colors"
                  >
                    {personalInfo.linkedin}
                  </a>
                </div>
                <div className="flex items-center gap-1 md:ml-auto print:ml-auto">
                  <MapPin className="w-3 h-3" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 print:p-4">
            <div className="mb-6 print:mb-3">
              <p className="text-sm text-muted print:text-xs" suppressHydrationWarning>{currentDate}</p>
            </div>

            <div className="mb-6 print:mb-3">
              <p className="text-lg font-bold text-ink print:text-base">
                {coverLetter.recipient.salutation},
              </p>
            </div>

            <div className="mb-6 print:mb-3">
              <p className="text-sm text-on-surface-variant leading-relaxed print:text-xs print:leading-tight">
                {coverLetter.opening.paragraph}
              </p>
            </div>

            {coverLetter.body.map((section, idx) => (
              <div key={idx} className="mb-6 print:mb-3">
                <h2 className={sectionHeading}>{section.heading.toUpperCase()}</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed print:text-xs print:leading-tight">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="mb-6 print:mb-3">
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4 print:text-xs print:leading-tight print:mb-2">
                {coverLetter.closing.paragraph}
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed print:text-xs print:leading-tight">
                {coverLetter.closing.callToAction}
              </p>
            </div>

            <div className="mt-8 mb-6 print:mt-6 print:mb-4">
              <p className="text-sm text-on-surface mb-8 print:text-xs print:mb-6">
                {coverLetter.signature.closing},
              </p>
              <div className="mb-8 print:mb-6">
                <div className="h-12 border-b border-outline-variant mb-2 print:h-10"></div>
              </div>
              <p className="text-base font-semibold text-ink print:text-sm">{coverLetter.signature.name}</p>
              <p className="text-sm text-muted print:text-xs">{coverLetter.signature.title}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-line no-print">
              <h3 className="text-sm font-bold text-ink mb-3">Attachments:</h3>
              <ul className="space-y-2">
                {coverLetter.attachments.map((attachment, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-muted text-sm">
                    <span className="text-primary">📎</span>
                    <span className="font-semibold">{attachment.name}</span>
                    <span>- {attachment.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-print-footer className="hidden print:block bg-surface-container p-4 border-t-2 border-line">
            <div className="flex justify-between items-center text-xs text-muted">
              <div>
                <p className="mb-6">Date: ___________________</p>
              </div>
              <div className="text-right">
                <p className="mb-6">Signature: ___________________</p>
              </div>
            </div>
          </div>
        </div>
        </IntroFade>
      </div>
    </PageTransition>
  );
}
