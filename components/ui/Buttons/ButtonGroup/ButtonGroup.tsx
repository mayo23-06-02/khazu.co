"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  direction?: "row" | "column";
  /** Visually join the buttons into one segmented control. */
  attached?: boolean;
  gap?: "none" | "sm" | "md";
}

export function ButtonGroup({
  children,
  className = "",
  direction = "row",
  attached = false,
  gap = "sm",
}: ButtonGroupProps) {
  const gaps = { none: "gap-0", sm: "gap-2", md: "gap-3" };
  return (
    <div
      role="group"
      className={twMerge(
        clsx(
          "inline-flex",
          direction === "row" ? "flex-row flex-wrap items-center" : "flex-col",
          attached
            ? "gap-0 [&>*]:rounded-none [&>*:first-child]:rounded-l-xs [&>*:last-child]:rounded-r-xs -space-x-px"
            : gaps[gap],
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}
