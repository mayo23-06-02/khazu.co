"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { labelClass, errorClass } from "../inputStyles";

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
    <fieldset className={twMerge(clsx("flex flex-col gap-1.5", className))}>
      {label && <legend className={clsx(labelClass, "mb-1.5")}>{label}</legend>}
      <div
        className={clsx(
          "flex gap-x-4 gap-y-2",
          direction === "row" ? "flex-row flex-wrap items-center" : "flex-col",
        )}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className={clsx(
              "flex items-center gap-2",
              opt.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              disabled={opt.disabled}
              onChange={() => onChange?.(opt.value)}
              className="size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
            <span className="text-sm text-ink">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className={errorClass} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
