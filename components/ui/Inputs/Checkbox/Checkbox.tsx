"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { MdCheck } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2.5 cursor-pointer">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={twMerge(
              clsx(
                "peer h-5 w-5 rounded border-black/30 text[#CD2C58] focus:ring-2 focus:ring[#CD2C58]/30 transition-colors",
                className,
              ),
            )}
            {...props}
          />
          <MdCheck
            size={12}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          />
        </div>
        {label && <span className="text-sm text-gray-800/80">{label}</span>}
      </label>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  ),
);
Checkbox.displayName = "Checkbox";
