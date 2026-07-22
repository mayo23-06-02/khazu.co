"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading1Props {
  children: ReactNode;
  className?: string;
}

export function Heading1({ children, className = "" }: Heading1Props) {
  return (
    <h1
      className={twMerge(
        clsx(
          "font-display font-semibold text-black leading-tight tracking-tight text-xl md:text-3xl",
          className,
        ),
      )}
    >
      {children}
    </h1>
  );
}
