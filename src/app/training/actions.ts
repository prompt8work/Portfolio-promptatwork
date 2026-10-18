"use server";

import { z } from "zod";
import { registerForBatch, type RegistrationResult } from "../../supabase/trainingRepository";

const experienceLevels = ["Beginner", "Intermediate", "Advanced"] as const;

const registrationSchema = z.object({
  batchId: z.string().uuid(),
  trainingId: z.string().trim().min(1),
  name: z.string().trim().min(1, "Name is required").max(200),
  // Lower-cased so "A@x.com" and "a@x.com" hit the duplicate check as the
  // same person (register_for_batch also lower-cases, as a second guard).
  email: z.string().trim().toLowerCase().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().trim().max(30).optional(),
  organization: z.string().trim().max(200).optional(),
  experienceLevel: z.enum(experienceLevels).optional(),
  // Honeypot — same reasoning as the Contact form: no length constraint,
  // checked as an explicit post-parse step below, not a schema rule.
  website: z.string().optional(),
});

export type RegistrationFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof registrationSchema>, string>>;
  /** Echoed back on a validation error so the fields survive React's
   *  post-action form reset (same as the Contact form). */
  values?: Partial<Record<"name" | "email" | "phone" | "organization" | "experienceLevel", string>>;
};

const resultMessages: Record<RegistrationResult, { status: "success" | "error"; message: string }> = {
  SUCCESS: { status: "success", message: "You're registered! Confirmation details will follow." },
  BATCH_NOT_FOUND: { status: "error", message: "That batch couldn't be found. Please refresh and try again." },
  BATCH_NOT_OPEN: { status: "error", message: "This batch isn't open for registration right now." },
  DEADLINE_PASSED: { status: "error", message: "The registration deadline for this batch has passed." },
  BATCH_FULL: { status: "error", message: "This batch is full. Check back for the next one." },
  DUPLICATE_REGISTRATION: { status: "error", message: "This email is already registered for this batch." },
};

export async function submitRegistration(
  _prevState: RegistrationFormState,
  formData: FormData
): Promise<RegistrationFormState> {
  const raw = {
    batchId: formData.get("batchId"),
    trainingId: formData.get("trainingId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    organization: formData.get("organization"),
    experienceLevel: formData.get("experienceLevel") || undefined,
    website: formData.get("website"),
  };

  const parsed = registrationSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: RegistrationFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof registrationSchema>;
      if (key && key !== "website") fieldErrors[key] = issue.message;
    }
    const text = (v: FormDataEntryValue | null | undefined) => (typeof v === "string" ? v : "");
    return {
      status: "error",
      message: "Please check the form and try again.",
      fieldErrors,
      values: {
        name: text(raw.name),
        email: text(raw.email),
        phone: text(raw.phone),
        organization: text(raw.organization),
        experienceLevel: text(raw.experienceLevel),
      },
    };
  }

  if (parsed.data.website) {
    return { status: "success", message: "You're registered! Confirmation details will follow." };
  }

  try {
    const result = await registerForBatch({
      batchId: parsed.data.batchId,
      trainingId: parsed.data.trainingId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      organization: parsed.data.organization,
      experienceLevel: parsed.data.experienceLevel,
    });
    return resultMessages[result];
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
