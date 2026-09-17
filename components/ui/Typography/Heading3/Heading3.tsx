"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading3Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Heading3({ children, className = "", as: Tag = "h3" }: Heading3Props) {
  return (
    <Tag className={twMerge(clsx("font-display font-semibold tracking-tight text-ink text-lg sm:text-xl", className))}>
      {children}
    </Tag>
  );
}
