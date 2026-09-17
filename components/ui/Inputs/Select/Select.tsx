"use client";
import { forwardRef, SelectHTMLAttributes } from "react";
import { MdExpandMore } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  fieldWrap, labelClass, hintClass, errorClass,
  controlBase, controlSizes, tone, type ControlSize,
} from "../inputStyles";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  size?: ControlSize;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, placeholder, options, size = "md", fullWidth = true, className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className={twMerge(clsx(fieldWrap, fullWidth && "w-full"))}>
        {label && (
          <label htmlFor={fieldId} className={labelClass}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={!!error || undefined}
            className={twMerge(
              clsx(controlBase, controlSizes[size], tone(error), "appearance-none pr-9 cursor-pointer", className),
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <MdExpandMore
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted"
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
Select.displayName = "Select";
