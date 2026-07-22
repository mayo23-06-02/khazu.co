"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FieldsetProps {
  children: ReactNode;
  legend?: ReactNode;
  className?: string;
}

export function Fieldset({ children, legend, className = "" }: FieldsetProps) {
  return (
    <fieldset
      className={twMerge(
        clsx("border border-black/10 rounded-lg p-4", className),
      )}
    >
      {legend && (
        <legend className="px-2 text-sm font-medium text-gray-800">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
}
