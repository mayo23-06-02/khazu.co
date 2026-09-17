"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  fieldWrap, labelClass, hintClass, errorClass,
  controlBase, controlSizes, tone, type ControlSize,
} from "../inputStyles";

export interface InputPhoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  countryCode?: string;
  size?: ControlSize;
  fullWidth?: boolean;
}

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(
  ({ label, error, hint, countryCode = "+268", size = "md", fullWidth = true, className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className={twMerge(clsx(fieldWrap, fullWidth && "w-full"))}>
        {label && (
          <label htmlFor={fieldId} className={labelClass}>
            {label}
          </label>
        )}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
            {countryCode}
          </span>
          <input
            ref={ref}
            id={fieldId}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!error || undefined}
            className={twMerge(
              clsx(controlBase, controlSizes[size], tone(error), "pl-14", className),
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className={hintClass}>{hint}</p>}
        {error && (
          <p className={errorClass} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
InputPhone.displayName = "InputPhone";
