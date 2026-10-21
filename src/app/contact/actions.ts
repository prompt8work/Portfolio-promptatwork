"use server";

import { after } from "next/server";
import { z } from "zod";
import { createContactMessage } from "../../supabase/contactRepository";
import { sendContactEmails } from "../../lib/email/contactEmails";

// PRD §41 purpose options, exactly.
const purposes = [
  "Job Opportunity",
  "AI Consulting",
  "Training",
  "Workshop",
  "Collaboration",
  "Speaking",
  "Project Discussion",
  "Other",
] as const;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  organization: z.string().trim().max(200).optional(),
  purpose: z.enum(purposes),
  message: z.string().trim().min(1, "Message is required").max(4000),
  // Honeypot: a field real visitors never see or fill (hidden via CSS in
  // the form, not `type="hidden"` — some bots skip actual hidden inputs).
  // No length constraint here on purpose — a `max(0)` would make a filled
  // honeypot fail *schema validation* and fall into the generic error
  // branch below, which was tried first and never reached the "pretend
  // success" branch at all. The honeypot check has to happen after a
  // successful parse, as its own explicit step, not as a validation rule.
  company_website: z.string().optional(),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
  /** What was submitted, echoed back on a validation error: React resets
   *  the form after every action, and the fields use these as their
   *  defaults so the visitor's input survives the reset. */
  values?: Partial<Record<"name" | "email" | "organization" | "purpose" | "message", string>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization"),
    purpose: formData.get("purpose"),
    message: formData.get("message"),
    company_website: formData.get("company_website"),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof contactSchema>;
      if (key && key !== "company_website") fieldErrors[key] = issue.message;
    }
    const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");
    return {
      status: "error",
      message: "Please check the form and try again.",
      fieldErrors,
      values: {
        name: text(raw.name),
        email: text(raw.email),
        organization: text(raw.organization),
        purpose: text(raw.purpose),
        message: text(raw.message),
      },
    };
  }

  // Honeypot tripped: pretend success. Never let an automated submitter
  // learn that it was caught — that just teaches it to leave the field
  // blank next time.
  if (parsed.data.company_website) {
    return { status: "success", message: "Thanks — I'll get back to you soon." };
  }

  const contact = {
    name: parsed.data.name,
    email: parsed.data.email,
    organization: parsed.data.organization,
    purpose: parsed.data.purpose,
    message: parsed.data.message,
  };

  try {
    await createContactMessage(contact);
  } catch {
    // Never surface the real error (PRD §97) — database details, RLS
    // errors etc. stay in server logs, not in the response.
    return {
      status: "error",
      message: "Something went wrong. Please try again, or email directly.",
    };
  }

  // Emails go out after the response, so the visitor isn't kept waiting on
  // SMTP, and a mail failure never turns a saved message into an error.
  after(() => sendContactEmails(contact));

  return { status: "success", message: "Thanks — I'll reply within 1 working day. A confirmation is on its way to your inbox." };
}
