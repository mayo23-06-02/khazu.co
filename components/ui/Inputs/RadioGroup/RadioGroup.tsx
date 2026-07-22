"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  direction?: "row" | "column";
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  className = "",
  direction = "column",
}: RadioGroupProps) {
  return (
    <div className={twMerge(clsx("flex flex-col gap-1", className))}>
      {label && (
        <span className="text-sm font-medium text-gray-800">{label}</span>
      )}
      <div
        className={twMerge(
          clsx(
            "flex",
            direction === "row" ? "flex-row gap-4" : "flex-col gap-2",
          ),
        )}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className={twMerge(
              clsx(
                "flex items-center gap-2 cursor-pointer",
                opt.disabled && "opacity-50 cursor-not-allowed",
              ),
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => !opt.disabled && onChange?.(opt.value)}
              disabled={opt.disabled}
              className="h-4 w-4 text[#CD2C58] focus:ring-2 focus:ring[#CD2C58]/30 border-black/30"
            />
            <span className="text-sm text-gray-800/80">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
