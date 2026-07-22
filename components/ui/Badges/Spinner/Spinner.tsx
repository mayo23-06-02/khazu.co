"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4",
  };
  return (
    <div
      className={twMerge(
        clsx(
          "border[#CD2C58] border-t-transparent rounded-full animate-spin",
          sizes[size],
          className,
        ),
      )}
    />
  );
}
