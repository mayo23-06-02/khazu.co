"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading2Props {
  children: ReactNode;
  className?: string;
}

export function Heading2({ children, className = "" }: Heading2Props) {
  return (
    <h2
      className={twMerge(
        clsx(
          "font-display font-semibold text-black leading-tight tracking-tight text-2xl md:text-4xl",
          className,
        ),
      )}
    >
      {children}
    </h2>
  );
}
