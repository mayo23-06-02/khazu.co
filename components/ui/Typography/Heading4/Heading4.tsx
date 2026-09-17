"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading4Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Heading4({ children, className = "", as: Tag = "h4" }: Heading4Props) {
  return (
    <Tag className={twMerge(clsx("font-display font-semibold tracking-tight text-ink text-base sm:text-lg", className))}>
      {children}
    </Tag>
  );
}
