"use client";

import { useEffect } from "react";
import { useAnimate } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { DURATION, EASE, shakeKeyframes } from "../../lib/motion";

type Option = string | { value: string; label: string };

type FieldProps = {
  id: string;
  name: string;
  label: string;
  as?: "input" | "textarea" | "select";
  type?: string;
  error?: string;
  disabled?: boolean;
  defaultValue?: string;
  rows?: number;
  options?: Option[];
  autoComplete?: string;
};

/**
 * The one form field. Label floats up on focus / when filled (CSS, see
 * `.field` in globals.css), an invalid field shakes once when its error
 * appears, and the error is wired up with aria-invalid/aria-describedby.
 */
export default function Field({
  id,
  name,
  label,
  as = "input",
  type = "text",
  error,
  disabled,
  defaultValue,
  rows = 4,
  options = [],
  autoComplete,
}: FieldProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    if (!error || reduce || !scope.current) return;
    animate(scope.current, { x: shakeKeyframes }, { duration: DURATION.shake, ease: EASE });
  }, [error, reduce, animate, scope]);

  const errorId = `${id}-error`;
  const common = {
    id,
    name,
    disabled,
    defaultValue,
    "aria-invalid": !!error || undefined,
    "aria-describedby": error ? errorId : undefined,
    className: `field-control ${as === "select" ? "field-select" : ""}`,
  };

  return (
    <div className="flex flex-col gap-1">
      <div ref={scope} className="field" data-invalid={!!error || undefined}>
        {as === "textarea" ? (
          <textarea {...common} rows={rows} placeholder=" " />
        ) : as === "select" ? (
          <select {...common}>
            {options.map((o) => {
              const opt = typeof o === "string" ? { value: o, label: o } : o;
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              );
            })}
          </select>
        ) : (
          <input {...common} type={type} placeholder=" " autoComplete={autoComplete} />
        )}
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} className="text-xs text-error-token">
          {error}
        </p>
      )}
    </div>
  );
}
