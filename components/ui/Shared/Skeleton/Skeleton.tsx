"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
  /** Convenience shapes so callers stop hand-rolling sizes. */
  variant?: "line" | "circle" | "block";
}

export function Skeleton({ className = "", variant = "block" }: SkeletonProps) {
  const variants = {
    line: "h-3 w-full rounded-md",
    circle: "size-9 rounded-full",
    block: "h-20 w-full rounded-xl",
  };
  return (
    <div
      aria-hidden="true"
      className={twMerge(clsx("animate-pulse bg-surface-sunken", variants[variant], className))}
    />
  );
}
