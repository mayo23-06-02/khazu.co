"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  color?: "light" | "medium" | "heavy";
  label?: string;
}

export function Divider({
  className = "",
  orientation = "horizontal",
  color = "light",
  label,
}: DividerProps) {
  const colorClasses = {
    light: "bg-line",
    medium: "bg-line-strong",
    heavy: "bg-dark/25",
  };

  if (label && orientation === "horizontal") {
    return (
      <div className={twMerge(clsx("flex items-center gap-3", className))} role="separator">
        <span className={clsx("h-px flex-1", colorClasses[color])} />
        <span className="text-2xs font-medium uppercase tracking-wider text-muted">{label}</span>
        <span className={clsx("h-px flex-1", colorClasses[color])} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={twMerge(
        clsx(
          colorClasses[color],
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className,
        ),
      )}
    />
  );
}
