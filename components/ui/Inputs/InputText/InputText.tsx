"use client";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  fieldWrap, labelClass, hintClass, errorClass,
  controlBase, controlSizes, tone, type ControlSize,
} from "../inputStyles";

export interface InputTextProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  size?: ControlSize;
  fullWidth?: boolean;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, error, hint, icon, size = "md", fullWidth = true, className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className={twMerge(clsx(fieldWrap, fullWidth && "w-full"))}>
        {label && (
          <label htmlFor={fieldId} className={labelClass}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            type="text"
            aria-invalid={!!error || undefined}
            aria-describedby={error && fieldId ? `${fieldId}-error` : undefined}
            className={twMerge(
              clsx(controlBase, controlSizes[size], tone(error), icon && "pl-9", className),
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className={hintClass}>{hint}</p>}
        {error && (
          <p id={fieldId ? `${fieldId}-error` : undefined} className={errorClass} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
InputText.displayName = "InputText";
