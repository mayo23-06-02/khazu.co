"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading1Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Heading1({ children, className = "", as: Tag = "h1" }: Heading1Props) {
  return (
    <Tag className={twMerge(clsx("font-display font-bold tracking-tight text-balance text-ink text-2xl sm:text-3xl lg:text-4xl", className))}>
      {children}
    </Tag>
  );
}
