"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label, description, className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <label htmlFor={fieldId} className="flex cursor-pointer items-center gap-3">
        <span className="relative inline-flex shrink-0">
          <input ref={ref} id={fieldId} type="checkbox" className="peer sr-only" {...props} />
          <span
            className={twMerge(
              clsx(
                "block h-5 w-9 rounded-full bg-line-strong transition-colors duration-200 ease-out",
                "peer-checked:bg-primary",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                "peer-disabled:opacity-50",
                className,
              ),
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out peer-checked:translate-x-4"
          />
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && <span className="text-sm font-medium text-ink">{label}</span>}
            {description && <span className="text-2xs text-muted">{description}</span>}
          </span>
        )}
      </label>
    );
  },
);
ToggleSwitch.displayName = "ToggleSwitch";
