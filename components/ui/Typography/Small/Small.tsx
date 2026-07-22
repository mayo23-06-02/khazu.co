"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SmallProps {
  children: ReactNode;
  className?: string;
  muted?: boolean;
  weight?: "normal" | "medium" | "semibold";
}

export function Small({
  children,
  className = "",
  muted = false,
  weight = "normal",
}: SmallProps) {
  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  };
  return (
    <small
      className={twMerge(
        clsx(
          "text-sm leading-normal",
          weights[weight],
          muted ? "text-gray-800" : "text-gray-800",
          className,
        ),
      )}
    >
      <p>{children}</p>
    </small>
  );
}
