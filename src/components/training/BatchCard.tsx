"use client";

import { useActionState, useState } from "react";
import { submitRegistration, type RegistrationFormState } from "../../app/training/actions";
import type { TrainingBatch, ClassSchedule } from "../../supabase/trainingRepository";
import MotionCard from "../motion/MotionCard";
import CountUp from "../motion/CountUp";
import Field from "../motion/Field";
import FormSuccess from "../motion/FormSuccess";
import Chip from "../ui/Chip";

const initialState: RegistrationFormState = { status: "idle", message: "" };

// timeZone: "UTC" avoids a hydration mismatch — this is a Client
// Component, so this date renders once server-side and again during
// client hydration; without a fixed zone, a day-boundary timestamp can
// format to a different calendar day between Vercel's server (UTC) and a
// visitor's local browser, which React flags as a mismatch (found live on
// VideoCard, which has the identical pattern — see its own comment).
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BatchCard({
  batch,
  schedule,
  trainingId,
}: {
  batch: TrainingBatch;
  schedule: ClassSchedule[];
  trainingId: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(submitRegistration, initialState);
  const values = state.values ?? {};

  const seatsLeft = batch.seats - batch.seatsFilled;
  const isOpen = batch.status === "OPEN" && seatsLeft > 0;

  return (
    <MotionCard className="bg-card border border-line rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-ink">{batch.batchName}</h3>
          <span className="text-sm text-muted">
            {formatDate(batch.startDate)}
            {batch.endDate ? ` – ${formatDate(batch.endDate)}` : ""}
            {batch.mode ? ` · ${batch.mode}` : ""}
          </span>
        </div>
        <span
          className={`font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full self-start ${
            isOpen ? "bg-primary/10 text-primary" : "bg-surface-container text-muted"
          }`}
        >
          {batch.status === "OPEN" ? isOpen ? <CountUp value={`${seatsLeft} SEATS LEFT`} /> : "FULL" : batch.status}
        </span>
      </div>

      {schedule.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {schedule.map((s) => (
            <Chip key={s.id} size="sm">
              {formatDate(s.classDate)}, {s.startTime.slice(0, 5)}–{s.endTime.slice(0, 5)} {s.timezone}
            </Chip>
          ))}
        </div>
      )}

      {isOpen && !open && state.status !== "success" && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="paw-btn paw-btn--primary paw-btn--sm self-start"
        >
          Register for this batch
        </button>
      )}

      {isOpen && open && state.status !== "success" && (
        <form action={formAction} className="flex flex-col gap-4 pt-2 border-t border-surface-container" noValidate>
          <input type="hidden" name="batchId" value={batch.id} />
          <input type="hidden" name="trainingId" value={trainingId} />

          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor={`tr-website-${batch.id}`}>Leave this field empty</label>
            <input id={`tr-website-${batch.id}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id={`tr-name-${batch.id}`}
              name="name"
              label="Name"
              autoComplete="name"
              defaultValue={values.name}
              disabled={isPending}
              error={state.fieldErrors?.name}
            />
            <Field
              id={`tr-email-${batch.id}`}
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              defaultValue={values.email}
              disabled={isPending}
              error={state.fieldErrors?.email}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id={`tr-phone-${batch.id}`}
              name="phone"
              type="tel"
              label="Phone (optional)"
              autoComplete="tel"
              defaultValue={values.phone}
              disabled={isPending}
            />
            <Field
              id={`tr-org-${batch.id}`}
              name="organization"
              label="Organization (optional)"
              autoComplete="organization"
              defaultValue={values.organization}
              disabled={isPending}
            />
          </div>
          {/* Keyed on the echoed value: a <select> doesn't take a new
              defaultValue on React's form reset, so it remounts instead. */}
          <Field
            key={values.experienceLevel || "Beginner"}
            id={`tr-exp-${batch.id}`}
            name="experienceLevel"
            as="select"
            label="Experience Level"
            defaultValue={values.experienceLevel || "Beginner"}
            disabled={isPending}
            options={["Beginner", "Intermediate", "Advanced"]}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="paw-btn paw-btn--primary paw-btn--sm"
            >
              {isPending ? "Submitting…" : "Confirm Registration"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="text-sm text-muted hover:text-on-surface-variant"
            >
              Cancel
            </button>
          </div>

          {state.status === "error" && (
            <p role="alert" className="text-xs text-error-token">
              {state.message}
            </p>
          )}
        </form>
      )}

      {state.status === "success" && (
        <div className="pt-2 border-t border-surface-container">
          <FormSuccess message={state.message} />
        </div>
      )}
    </MotionCard>
  );
}
