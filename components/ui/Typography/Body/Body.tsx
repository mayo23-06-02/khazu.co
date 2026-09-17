"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BodyProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: "xs" | "sm" | "base" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  muted?: boolean;
}

export function Body({
  children,
  className = "",
  as: Tag = "p",
  size = "base",
  weight = "normal",
  muted = false,
}: BodyProps) {
  const sizes = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" };
  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  return (
    <Tag
      className={twMerge(
        clsx(
          "leading-relaxed",
          sizes[size],
          weights[weight],
          muted ? "text-muted" : "text-ink",
          className,
        ),
      )}
    >
      {children}
    </Tag>
  );
}
