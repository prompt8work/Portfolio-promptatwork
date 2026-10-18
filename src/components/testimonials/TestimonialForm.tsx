"use client";

import { useActionState } from "react";
import { submitTestimonial, type TestimonialFormState } from "../../app/testimonials/actions";
import Field from "../motion/Field";
import FormSuccess from "../motion/FormSuccess";

const initialState: TestimonialFormState = { status: "idle", message: "" };

export default function TestimonialForm() {
  const [state, formAction, isPending] = useActionState(submitTestimonial, initialState);
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-8">
        <FormSuccess message={state.message} />
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="bg-neutral-0 border border-neutral-200 rounded-2xl p-8 flex flex-col gap-[18px]"
      noValidate
    >
      {/* Honeypot — same pattern as CommentForm/Contact/BatchCard. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="ts-website">Leave this field empty</label>
        <input id="ts-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="ts-name"
          name="name"
          label="Your Name"
          autoComplete="name"
          defaultValue={values.name}
          disabled={isPending}
          error={state.fieldErrors?.name}
        />
        <Field
          id="ts-role"
          name="role"
          label="Role (optional)"
          autoComplete="organization-title"
          defaultValue={values.role}
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="ts-org"
          name="organization"
          label="Organization (optional)"
          autoComplete="organization"
          defaultValue={values.organization}
          disabled={isPending}
        />
        {/* Keyed on the echoed value: a <select> doesn't take a new
            defaultValue on React's form reset, so it remounts instead. */}
        <Field
          key={values.sourceContext || "general"}
          id="ts-context"
          name="sourceContext"
          as="select"
          label="Where does this relate to?"
          defaultValue={values.sourceContext || "general"}
          disabled={isPending}
          options={[
            { value: "general", label: "General" },
            { value: "training", label: "A training / workshop" },
            { value: "consulting", label: "Consulting / project work" },
          ]}
        />
      </div>

      <Field
        id="ts-quote"
        name="quote"
        as="textarea"
        label="Your Testimonial"
        defaultValue={values.quote}
        disabled={isPending}
        error={state.fieldErrors?.quote}
      />

      <p className="text-xs text-neutral-600">
        Submitted testimonials are reviewed before they appear on the site — yours won&apos;t show up immediately.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="paw-btn paw-btn--primary self-start"
      >
        {isPending ? "Submitting…" : "Submit Testimonial"}
      </button>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-error font-medium">
          {state.message}
        </p>
      )}
    </form>
  );
}
