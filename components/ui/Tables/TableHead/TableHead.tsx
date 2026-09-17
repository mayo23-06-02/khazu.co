"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className = "" }: TableHeadProps) {
  return (
    <thead
      className={twMerge(
        clsx(
          "border-b border-line bg-surface-alt text-2xs font-semibold uppercase tracking-wide text-muted",
          className,
        ),
      )}
    >
      {children}
    </thead>
  );
}
