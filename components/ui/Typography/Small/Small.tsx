"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SmallProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  muted?: boolean;
  weight?: "normal" | "medium" | "semibold" | "bold";
}

export function Small({
  children,
  className = "",
  as: Tag = "p",
  muted = false,
  weight = "normal",
}: SmallProps) {
  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  return (
    <Tag
      className={twMerge(
        clsx("text-xs leading-normal", weights[weight], muted ? "text-muted" : "text-ink", className),
      )}
    >
      {children}
    </Tag>
  );
}
