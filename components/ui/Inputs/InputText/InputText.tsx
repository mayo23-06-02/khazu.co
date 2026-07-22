"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    { label, error, icon, fullWidth = false, className = "", ...props },
    ref,
  ) => (
    <div
      className={twMerge(clsx("flex flex-col gap-1", fullWidth && "w-full"))}
    >
      {label && (
        <label className="text-sm font-medium text-gray-800">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800/40">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              "w-full  border-b bg-white px-4 py-2.5 text-gray-800 placeholder:text-gray-800/40 transition-colors focus:outline-none focus:ring-2",
              icon ? "pl-10" : "pl-4",
              error
                ? "border-gray-300  focus:ring-danger/30"
                : "border-gray-300 focus:border[#CD2C58] focus:ring[#CD2C58]/30",
              className,
            ),
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  ),
);
InputText.displayName = "InputText";
