"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const variants = {
    primary: "bg[#CD2C58] text-gray-800",
    secondary: "bg-dark/10 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-danger/10 text-danger",
    warning: "bg-orange-100 text-orange-800",
  };
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          variants[variant],
          className,
        ),
      )}
    >
      {children}
    </span>
  );
}
