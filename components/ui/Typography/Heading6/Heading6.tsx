"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading6Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Heading6({ children, className = "", as: Tag = "h6" }: Heading6Props) {
  return (
    <Tag className={twMerge(clsx("font-display font-semibold tracking-tight text-ink text-xs sm:text-sm uppercase", className))}>
      {children}
    </Tag>
  );
}
