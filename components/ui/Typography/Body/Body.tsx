"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BodyProps {
  children: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "base" | "lg";
  weight?: "normal" | "medium" | "semibold";
  muted?: boolean;
}

export function Body({
  children,
  className = "",
  size = "base",
  weight = "normal",
  muted = false,
}: BodyProps) {
  const sizes = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" };
  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  };
  return (
    <p
      className={twMerge(
        clsx(
          " leading-relaxed",
          sizes[size],
          weights[weight],
          muted ? "text-gray-800/60" : "text-gray-00",
          className,
        ),
      )}
    >
      {children}
    </p>
  );
}
