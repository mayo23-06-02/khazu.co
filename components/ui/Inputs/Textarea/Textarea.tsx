"use client";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = false, className = "", ...props }, ref) => (
    <div
      className={twMerge(clsx("flex flex-col gap-1", fullWidth && "w-full"))}
    >
      {label && (
        <label className="text-sm font-medium text-gray-800">{label}</label>
      )}
      <textarea
        ref={ref}
        className={twMerge(
          clsx(
            "w-full rounded-lg border bg-white px-4 py-2.5 text-gray-800 placeholder:text-gray-800/40 transition-colors focus:outline-none focus:ring-2",
            error
              ? "border-danger focus:ring-danger/30"
              : "border-black/20 focus:border[#CD2C58] focus:ring[#CD2C58]/30",
            className,
          ),
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  ),
);
Textarea.displayName = "Textarea";
