"use server";

import { z } from "zod";
import { createTestimonial, SOURCE_CONTEXTS } from "../../supabase/testimonialRepository";

const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  role: z.string().trim().max(200).optional(),
  organization: z.string().trim().max(200).optional(),
  quote: z.string().trim().min(1, "Please share a few words").max(2000),
  sourceContext: z.enum(SOURCE_CONTEXTS),
  // Honeypot — same reasoning as contact/actions.ts: checked as an
  // explicit step after a successful parse, never as a schema constraint.
  website: z.string().optional(),
});

export type TestimonialFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof testimonialSchema>, string>>;
  /** Echoed back on a validation error so the fields survive React's
   *  post-action form reset (same as the Contact form). */
  values?: Partial<Record<"name" | "role" | "organization" | "quote" | "sourceContext", string>>;
};

export async function submitTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const raw = {
    name: formData.get("name"),
    role: formData.get("role"),
    organization: formData.get("organization"),
    quote: formData.get("quote"),
    sourceContext: formData.get("sourceContext"),
    website: formData.get("website"),
  };

  const parsed = testimonialSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: TestimonialFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof testimonialSchema>;
      if (key && key !== "website") fieldErrors[key] = issue.message;
    }
    const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");
    return {
      status: "error",
      message: "Please check the form and try again.",
      fieldErrors,
      values: {
        name: text(raw.name),
        role: text(raw.role),
        organization: text(raw.organization),
        quote: text(raw.quote),
        sourceContext: text(raw.sourceContext),
      },
    };
  }

  // Honeypot tripped: pretend success, same as every other public form.
  if (parsed.data.website) {
    return { status: "success", message: "Thank you — this will be reviewed before it appears on the site." };
  }

  try {
    await createTestimonial({
      name: parsed.data.name,
      role: parsed.data.role,
      organization: parsed.data.organization,
      quote: parsed.data.quote,
      sourceContext: parsed.data.sourceContext,
    });
  } catch {
    // Never surface the real error (PRD §97).
    return { status: "error", message: "Something went wrong. Please try again, or email directly." };
  }

  return { status: "success", message: "Thank you — this will be reviewed before it appears on the site." };
}
