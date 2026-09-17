"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading5Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Heading5({ children, className = "", as: Tag = "h5" }: Heading5Props) {
  return (
    <Tag className={twMerge(clsx("font-display font-semibold tracking-tight text-ink text-sm sm:text-base", className))}>
      {children}
    </Tag>
  );
}
