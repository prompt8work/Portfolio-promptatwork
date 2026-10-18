"use client";

import { useActionState } from "react";
import { submitComment, type CommentFormState } from "../../app/blog/actions";
import Field from "../motion/Field";
import FormSuccess from "../motion/FormSuccess";

const initialState: CommentFormState = { status: "idle", message: "" };

export default function CommentForm({ contentId }: { contentId: string }) {
  const [state, formAction, isPending] = useActionState(submitComment, initialState);

  const values = state.values ?? {};

  if (state.status === "success") return <FormSuccess message={state.message} />;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="contentId" value={contentId} />

      {/* Honeypot — same pattern as the Contact form. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="cm-website">Leave this field empty</label>
        <input id="cm-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="cm-name"
          name="name"
          label="Name"
          autoComplete="name"
          defaultValue={values.name}
          disabled={isPending}
          error={state.fieldErrors?.name}
        />
        <Field
          id="cm-email"
          name="email"
          type="email"
          label="Email (not shown publicly)"
          autoComplete="email"
          defaultValue={values.email}
          disabled={isPending}
          error={state.fieldErrors?.email}
        />
      </div>
      <Field
        id="cm-comment"
        name="comment"
        as="textarea"
        rows={3}
        label="Comment"
        defaultValue={values.comment}
        disabled={isPending}
        error={state.fieldErrors?.comment}
      />

      <button
        type="submit"
        disabled={isPending}
        className="paw-btn paw-btn--primary paw-btn--sm self-start"
      >
        {isPending ? "Submitting…" : "Submit Comment"}
      </button>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-error-token font-medium">
          {state.message}
        </p>
      )}
    </form>
  );
}
