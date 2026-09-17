"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { errorClass, hintClass } from "../inputStyles";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-2.5">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            aria-invalid={!!error || undefined}
            className={twMerge(
              clsx(
                "mt-px size-4 shrink-0 cursor-pointer rounded-sm border border-line-strong",
                "accent-primary text-primary",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-danger",
                className,
              ),
            )}
            {...props}
          />
          {label && <span className="text-sm leading-snug text-ink">{label}</span>}
        </label>
        {hint && !error && <p className={clsx(hintClass, "pl-6.5")}>{hint}</p>}
        {error && (
          <p className={clsx(errorClass, "pl-6.5")} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
