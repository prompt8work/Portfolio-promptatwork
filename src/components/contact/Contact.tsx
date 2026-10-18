"use client";

import { useActionState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { personalInfo } from "../../../data";
import LinkedinIcon from "../icons/LinkedinIcon";
import { submitContactForm, type ContactFormState } from "../../app/contact/actions";
import IntroFade from "../motion/IntroFade";
import Reveal from "../motion/Reveal";
import Field from "../motion/Field";
import FormSuccess from "../motion/FormSuccess";

// Same list and order as the server action's validation (PRD §41).
const purposes = [
  "Job Opportunity",
  "AI Consulting",
  "Training",
  "Workshop",
  "Collaboration",
  "Speaking",
  "Project Discussion",
  "Other",
];

const initialState: ContactFormState = { status: "idle", message: "" };

const channel = "flex items-center gap-3.5 px-4 py-3.5 rounded-xl paw-glass";
const channelIcon = "w-10 h-10 rounded-[10px] grid place-items-center shrink-0";

// Contact (New-Contact board): heading, lead and the three ways to reach
// Niharika on the left; the form on the right, with "Reach out about" as a
// grid of toggle buttons. They're real radio inputs named "purpose", so the
// form posts exactly what the old <select> did.
export default function Contact() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const values = state.values ?? {};
  const purpose = values.purpose && purposes.includes(values.purpose) ? values.purpose : purposes[0];

  return (
    <section
      id="contact"
      className="w-full"
      style={{ background: "radial-gradient(40% 50% at 100% 0%, color-mix(in srgb, var(--accent-violet) 20%, transparent), transparent 70%)" }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-[72px]">
        <div className="flex flex-col gap-[22px]">
          <IntroFade as="p" className="paw-section-head__eyebrow m-0">
            CONTACT
          </IntroFade>
          <IntroFade step={1}>
            <h1 className="m-0 text-[40px] leading-[44px] sm:text-[56px] sm:leading-[60px] font-semibold tracking-[-0.035em]">
              Let&apos;s make AI work for your team.
            </h1>
          </IntroFade>
          <IntroFade as="p" step={2} className="m-0 text-[17px] leading-[27px] text-muted">
            Whether you need a workshop, a prompt library or a working AI solution, tell me what your team is trying to do and I&apos;ll show
            you where AI fits.
          </IntroFade>

          <IntroFade step={3} className="flex flex-col gap-3 mt-2">
            <a href={`mailto:${personalInfo.email}`} className={`${channel} hover:border-outline transition-colors`}>
              <span className={`${channelIcon} bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] text-primary`}>
                <Mail className="paw-icon" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block label-md text-muted">EMAIL</span>
                <span className="block text-[15px] font-medium truncate">{personalInfo.email}</span>
              </span>
            </a>
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${channel} hover:border-outline transition-colors`}
            >
              <span className={`${channelIcon} bg-[color-mix(in_srgb,var(--accent-violet)_16%,transparent)] text-secondary`}>
                <LinkedinIcon className="w-[18px] h-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block label-md text-muted">LINKEDIN</span>
                <span className="block text-[15px] font-medium truncate">
                  {personalInfo.linkedin.replace("linkedin.com/in/", "in/")}
                </span>
              </span>
            </a>
            <div className={channel}>
              <span className={`${channelIcon} bg-[color-mix(in_srgb,var(--tertiary-container)_18%,transparent)] text-tertiary`}>
                <MapPin className="paw-icon" aria-hidden="true" />
              </span>
              <span>
                <span className="block label-md text-muted">LOCATION</span>
                <span className="block text-[15px] font-medium">{personalInfo.location} · Open to remote</span>
              </span>
            </div>
          </IntroFade>
        </div>

        <Reveal index={1}>
          {state.status === "success" ? (
            <div className="paw-glass rounded-[20px] p-8">
              <FormSuccess message={state.message} />
            </div>
          ) : (
            <form action={formAction} className="paw-glass rounded-[20px] p-6 sm:p-8 flex flex-col gap-[18px]" noValidate>
              {/* Honeypot — invisible to sighted users and screen readers (not
                type="hidden", which some bots skip), real visitors never
                fill it in. Non-empty means an automated submission. */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="company_website">Leave this field empty</label>
                <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <fieldset className="m-0 p-0 border-0 flex flex-col gap-2.5" disabled={isPending}>
                <legend className="p-0 mb-2.5 text-sm font-semibold">Reach out about</legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {purposes.map((p) => (
                    <label key={p} className="relative">
                      <input type="radio" name="purpose" value={p} defaultChecked={p === purpose} className="peer sr-only" />
                      <span className="h-11 px-2 rounded-[10px] border border-line bg-canvas text-sm font-medium grid place-items-center text-center leading-tight cursor-pointer transition-[border-color,background-color,box-shadow] hover:border-outline peer-checked:border-accent-violet peer-checked:font-semibold peer-checked:bg-[color-mix(in_srgb,var(--accent-violet)_18%,transparent)] peer-checked:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-violet)_20%,transparent)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)]">
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field id="c-name" name="name" label="Your Name" autoComplete="name" defaultValue={values.name} disabled={isPending} error={state.fieldErrors?.name} />
                <Field
                  id="c-email"
                  name="email"
                  type="email"
                  label="Your Email"
                  autoComplete="email"
                  defaultValue={values.email}
                  disabled={isPending}
                  error={state.fieldErrors?.email}
                />
              </div>
              <Field id="c-org" name="organization" label="Organization (optional)" autoComplete="organization" defaultValue={values.organization} disabled={isPending} />
              <Field id="c-msg" name="message" as="textarea" label="Your Message" defaultValue={values.message} disabled={isPending} error={state.fieldErrors?.message} />

              <button type="submit" disabled={isPending} className="paw-btn paw-btn--primary w-full justify-center">
                {isPending ? "Sending…" : "Send Message"}
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>

              {state.status === "error" && (
                <p role="alert" className="m-0 text-sm text-error-token font-medium">
                  {state.message}
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
