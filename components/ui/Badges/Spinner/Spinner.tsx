"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className = "", label = "Loading" }: SpinnerProps) {
  const sizes = {
    xs: "size-3 border-[1.5px]",
    sm: "size-4 border-2",
    md: "size-5 border-2",
    lg: "size-7 border-[3px]",
  };
  return (
    <span
      role="status"
      aria-label={label}
      className={twMerge(
        clsx(
          "inline-block animate-spin rounded-full border-current border-t-transparent text-primary",
          sizes[size],
          className,
        ),
      )}
    />
  );
}
