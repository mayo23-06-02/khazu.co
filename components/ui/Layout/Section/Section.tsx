"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: "cream" | "white" | "dark" | "primary" | "transparent";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  className = "",
  bg = "transparent",
  padding = "lg",
}: SectionProps) {
  const bgClasses = {
    cream: "bg-cream",
    white: "bg-white",
    dark: "bg-dark",
    primary: "bg[#CD2C58]",
    transparent: "bg-transparent",
  };
  const paddingClasses = {
    none: "py-0",
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
    xl: "py-16",
  };
  return (
    <section
      className={twMerge(
        clsx("w-full", bgClasses[bg], paddingClasses[padding], className),
      )}
    >
      {children}
    </section>
  );
}
