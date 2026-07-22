"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InlineAlertProps {
  children: ReactNode;
  variant?: "info" | "warning" | "danger" | "success";
  className?: string;
}

export function InlineAlert({
  children,
  variant = "info",
  className = "",
}: InlineAlertProps) {
  const variants = {
    info: "text-gray-800/60",
    warning: "text-yellow-800",
    danger: "text-danger",
    success: "text-green-800",
  };
  return (
    <p className={twMerge(clsx("text-sm", variants[variant], className))}>
      {children}
    </p>
  );
}
