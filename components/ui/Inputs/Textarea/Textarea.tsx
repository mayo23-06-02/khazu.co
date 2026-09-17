"use client";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  fieldWrap, labelClass, hintClass, errorClass,
  controlBase, textareaSizes, tone, type ControlSize,
} from "../inputStyles";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: ControlSize;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, size = "md", fullWidth = true, className = "", id, rows = 4, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className={twMerge(clsx(fieldWrap, fullWidth && "w-full"))}>
        {label && (
          <label htmlFor={fieldId} className={labelClass}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={!!error || undefined}
          className={twMerge(
            clsx(controlBase, textareaSizes[size], tone(error), "resize-y min-h-20", className),
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea";
