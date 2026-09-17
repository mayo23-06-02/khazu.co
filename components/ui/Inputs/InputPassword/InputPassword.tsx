"use client";
import { forwardRef, useState, InputHTMLAttributes } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  fieldWrap, labelClass, hintClass, errorClass,
  controlBase, controlSizes, tone, type ControlSize,
} from "../inputStyles";

export interface InputPasswordProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  size?: ControlSize;
  fullWidth?: boolean;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ label, error, hint, size = "md", fullWidth = true, className = "", id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const fieldId = id ?? props.name;
    return (
      <div className={twMerge(clsx(fieldWrap, fullWidth && "w-full"))}>
        {label && (
          <label htmlFor={fieldId} className={labelClass}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type={show ? "text" : "password"}
            aria-invalid={!!error || undefined}
            className={twMerge(
              clsx(controlBase, controlSizes[size], tone(error), "pr-9", className),
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {show ? <MdVisibilityOff className="size-4" /> : <MdVisibility className="size-4" />}
          </button>
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
InputPassword.displayName = "InputPassword";
