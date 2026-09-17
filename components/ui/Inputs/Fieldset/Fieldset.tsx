"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FieldsetProps {
  children: ReactNode;
  legend?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function Fieldset({ children, legend, description, className = "" }: FieldsetProps) {
  return (
    <fieldset
      className={twMerge(
        clsx("rounded-xl border border-line bg-white p-4 sm:p-5", className),
      )}
    >
      {legend && (
        <legend className="px-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
          {legend}
        </legend>
      )}
      {description && <p className="mb-3 text-2xs text-muted">{description}</p>}
      <div className="flex flex-col gap-3">{children}</div>
    </fieldset>
  );
}
