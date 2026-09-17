"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "line" | "dot" | "dash";
}

export function Separator({
  className = "",
  orientation = "horizontal",
  variant = "line",
}: SeparatorProps) {
  const variantClasses = {
    line: orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
    dot: "size-1 rounded-full",
    dash: orientation === "horizontal" ? "h-px w-4" : "h-4 w-px",
  };
  return (
    <span
      aria-hidden="true"
      className={twMerge(clsx("shrink-0 bg-line-strong", variantClasses[variant], className))}
    />
  );
}
