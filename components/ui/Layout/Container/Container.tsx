"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Container({ children, className = "", maxWidth = "lg" }: ContainerProps) {
  const widths = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-8xl",
    "2xl": "max-w-9xl",
    full: "max-w-full",
  };
  return (
    <div
      className={twMerge(
        clsx("mx-auto box-border w-full px-4 sm:px-6 lg:px-8", widths[maxWidth], className),
      )}
    >
      {children}
    </div>
  );
}
