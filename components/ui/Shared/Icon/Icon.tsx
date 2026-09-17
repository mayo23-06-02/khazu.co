"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface IconProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

export function Icon({ children, size = "md", className = "", label }: IconProps) {
  const sizes = { xs: "size-3", sm: "size-4", md: "size-5", lg: "size-6", xl: "size-8" };
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={twMerge(clsx("inline-flex items-center justify-center", sizes[size], className))}
    >
      {children}
    </span>
  );
}
