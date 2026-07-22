"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: "xs" | "sm";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variants = {
    primary: "bg[#CD2C58] text-gray-800",
    secondary: "bg-dark/10 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-danger/10 text-danger",
    warning: "bg-orange-100 text-orange-800",
    info: "bg-blue-100 text-blue-800",
  };
  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-0.5 text-xs",
  };
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full font-medium",
          variants[variant],
          sizes[size],
          className,
        ),
      )}
    >
      {children}
    </span>
  );
}
