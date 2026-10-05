"use client";

import { useActionState } from "react";
import { personalInfo } from "../../../data";
import SectionHeading from "../ui/SectionHeading";
import LinkedinIcon from "../icons/LinkedinIcon";
import { submitContactForm, type ContactFormState } from "../../app/contact/actions";
import Chip from "../ui/Chip";
import Reveal from "../motion/Reveal";
import Field from "../motion/Field";
import FormSuccess from "../motion/FormSuccess";

const purposes = ["Job Opportunity", "AI Consulting", "Training", "Workshop", "Collaboration", "Speaking"];

const initialState: ContactFormState = { status: "idle", message: "" };

// `headingLevel="page"` when this section opens the page (/contact), so it
// gets the shared page intro and the H1.
export default function Contact({ headingLevel = "section" }: { headingLevel?: "section" | "page" }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <section id="contact" className="w-full">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 py-24 sm:py-28">
        <SectionHeading
          level={headingLevel}
          align="start"
          eyebrow="CONTACT"
          title="Let's make AI work for your team."
          description="Whether you need a workshop, a prompt library or a working AI solution, tell me what your team is trying to do and I'll show you where AI fits."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-14">
          <Reveal className="flex flex-col gap-7">
            <div className="flex gap-3.5 items-start">
              <span className="w-10 h-10 rounded-[10px] bg-plum-100 flex items-center justify-center shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-plum-700)"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-neutral-600">Email</span>
                <span className="text-[14.5px] text-neutral-900 font-medium">{personalInfo.email}</span>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <span className="w-10 h-10 rounded-[10px] bg-plum-100 flex items-center justify-center shrink-0">
                <LinkedinIcon className="w-[17px] h-[17px] text-plum-700" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-neutral-600">LinkedIn</span>
                <a
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14.5px] text-neutral-900 font-medium hover:text-plum-600"
                >
                  {personalInfo.linkedin.replace("linkedin.com/in/", "in/")}
                </a>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <span className="w-10 h-10 rounded-[10px] bg-plum-100 flex items-center justify-center shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-plum-700)"
                  strokeWidth="1.8"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-neutral-600">Location</span>
                <span className="text-[14.5px] text-neutral-900 font-medium">
                  {personalInfo.location} · Open to remote
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-xs text-neutral-600">Reach out about</span>
              <div className="flex flex-wrap gap-2">
                {purposes.map((p) => (
                  <Chip key={p} size="sm">
                    {p}
                  </Chip>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal index={1}>
            {state.status === "success" ? (
              <div className="bg-white border border-neutral-200 rounded-[18px] p-8">
                <FormSuccess message={state.message} />
              </div>
            ) : (
              <form
                action={formAction}
                className="bg-white border border-neutral-200 rounded-[18px] p-8 flex flex-col gap-[18px]"
                noValidate
              >
                {/* Honeypot — invisible to sighted users and screen readers (not
                type="hidden", which some bots skip), real visitors never
                fill it in. Non-empty means an automated submission. */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="company_website">Leave this field empty</label>
                  <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    id="c-name"
                    name="name"
                    label="Your Name"
                    autoComplete="name"
                    disabled={isPending}
                    error={state.fieldErrors?.name}
                  />
                  <Field
                    id="c-email"
                    name="email"
                    type="email"
                    label="Your Email"
                    autoComplete="email"
                    disabled={isPending}
                    error={state.fieldErrors?.email}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    id="c-org"
                    name="organization"
                    label="Organization (optional)"
                    autoComplete="organization"
                    disabled={isPending}
                  />
                  <Field
                    id="c-purpose"
                    name="purpose"
                    as="select"
                    label="Purpose"
                    defaultValue="Job Opportunity"
                    disabled={isPending}
                    options={[...purposes, "Project Discussion", "Other"]}
                  />
                </div>
                <Field
                  id="c-msg"
                  name="message"
                  as="textarea"
                  label="Your Message"
                  disabled={isPending}
                  error={state.fieldErrors?.message}
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="motion-btn self-start inline-flex items-center gap-2.5 bg-neutral-900 text-white text-[14.5px] font-semibold px-6 py-3.5 rounded-xl hover:bg-neutral-800 disabled:opacity-60"
                >
                  {isPending ? "Sending…" : "Send Message"}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
                  </svg>
                </button>

                {state.status === "error" && (
                  <p role="alert" className="text-sm text-error font-medium">
                    {state.message}
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
