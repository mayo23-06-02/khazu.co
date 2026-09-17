"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: "cream" | "white" | "dark" | "primary" | "muted" | "transparent";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  className = "",
  bg = "transparent",
  padding = "lg",
}: SectionProps) {
  const backgrounds = {
    cream: "bg-cream text-ink",
    white: "bg-white text-ink",
    dark: "bg-dark text-white",
    primary: "bg-primary text-white",
    muted: "bg-surface-alt text-ink",
    transparent: "bg-transparent",
  };
  const paddings = {
    none: "py-0",
    sm: "py-5 sm:py-6",
    md: "py-6 sm:py-8",
    lg: "py-8 sm:py-12",
    xl: "py-12 sm:py-16",
  };
  return (
    <section className={twMerge(clsx(backgrounds[bg], paddings[padding], className))}>
      {children}
    </section>
  );
}
