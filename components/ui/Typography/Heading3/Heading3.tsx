"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading3Props {
  children: ReactNode;
  className?: string;
}

export function Heading3({ children, className = "" }: Heading3Props) {
  return (
    <h3
      className={twMerge(
        clsx(
          "font-display font-medium text-black leading-snug tracking-tight text-xl md:text-2xl",
          className,
        ),
      )}
    >
      {children}
    </h3>
  );
}
