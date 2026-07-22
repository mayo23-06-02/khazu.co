"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputColorProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputColor = forwardRef<HTMLInputElement, InputColorProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className={twMerge(clsx("flex flex-col gap-1", className))}>
      {label && (
        <label className="text-sm font-medium text-gray-800">{label}</label>
      )}
      <input
        ref={ref}
        type="color"
        className="w-12 h-10 rounded cursor-pointer"
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
InputColor.displayName = "InputColor";
