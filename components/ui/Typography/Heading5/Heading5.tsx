"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading5Props {
  children: ReactNode;
  className?: string;
}

export function Heading5({ children, className = "" }: Heading5Props) {
  return (
    <h5
      className={twMerge(
        clsx(
          "font-display font-medium text-black leading-snug text-base md:text-lg",
          className,
        ),
      )}
    >
      {children}
    </h5>
  );
}
