"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading2Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Heading2({ children, className = "", as: Tag = "h2" }: Heading2Props) {
  return (
    <Tag className={twMerge(clsx("font-display font-bold tracking-tight text-balance text-ink text-xl sm:text-2xl lg:text-3xl", className))}>
      {children}
    </Tag>
  );
}
