"use server";

import { z } from "zod";
import { createComment } from "../../supabase/commentRepository";
import { addReaction, type ReactionType } from "../../supabase/blogReactionRepository";

const commentSchema = z.object({
  contentId: z.string().trim().min(1),
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  comment: z.string().trim().min(1, "Comment is required").max(2000),
  // Honeypot — same reasoning as the Contact form's company_website field:
  // no length constraint here, or a filled honeypot fails schema
  // validation and never reaches the "pretend success" branch below.
  website: z.string().optional(),
});

export type CommentFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof commentSchema>, string>>;
  /** Echoed back on a validation error so the fields survive React's
   *  post-action form reset (same as the Contact form). */
  values?: Partial<Record<"name" | "email" | "comment", string>>;
};

export async function submitComment(
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const raw = {
    contentId: formData.get("contentId"),
    name: formData.get("name"),
    email: formData.get("email"),
    comment: formData.get("comment"),
    website: formData.get("website"),
  };

  const parsed = commentSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: CommentFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof commentSchema>;
      if (key && key !== "website") fieldErrors[key] = issue.message;
    }
    const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");
    return {
      status: "error",
      message: "Please check the form and try again.",
      fieldErrors,
      values: { name: text(raw.name), email: text(raw.email), comment: text(raw.comment) },
    };
  }

  if (parsed.data.website) {
    return { status: "success", message: "Thanks — your comment is awaiting review." };
  }

  try {
    await createComment({
      contentId: parsed.data.contentId,
      name: parsed.data.name,
      email: parsed.data.email,
      comment: parsed.data.comment,
    });
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return {
    status: "success",
    message: "Thanks — your comment is awaiting review and will appear once approved.",
  };
}

export async function submitReaction(contentId: string, reactionType: ReactionType, visitorHash: string): Promise<void> {
  await addReaction(contentId, reactionType, visitorHash);
}
