"use client";
import { forwardRef, SelectHTMLAttributes } from "react";
import { MdExpandMore } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, fullWidth = false, className = "", ...props },
    ref,
  ) => (
    <div
      className={twMerge(clsx("flex flex-col gap-1", fullWidth && "w-full"))}
    >
      {label && (
        <label className="text-sm font-medium text-gray-800">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={twMerge(
            clsx(
              "w-full appearance-none rounded-md border border-gray-800/20 bg-white px-4 py-2.5 pr-10 text-gray-800 transition-colors focus:outline-none focus:ring-2",
              error
                ? "border-gray-300 focus:ring-gray-400"
                : "border-gray-300 focus:border[#CD2C58] focus:ring[#CD2C58]/30",
              className,
            ),
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800/40 pointer-events-none">
          <MdExpandMore size={14} />
        </div>
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  ),
);
Select.displayName = "Select";
