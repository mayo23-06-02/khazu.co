"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FormGroupProps {
  children: ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal";
  spacing?: "sm" | "md" | "lg";
}

export function FormGroup({
  children,
  className = "",
  direction = "vertical",
  spacing = "md",
}: FormGroupProps) {
  const spacings = { sm: "gap-2", md: "gap-3", lg: "gap-4" };
  return (
    <div
      className={twMerge(
        clsx(
          "flex",
          // Horizontal groups stack on small screens so fields never squash.
          direction === "vertical" ? "flex-col" : "flex-col sm:flex-row sm:items-end",
          spacings[spacing],
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}
