"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading4Props {
  children: ReactNode;
  className?: string;
}

export function Heading4({ children, className = "" }: Heading4Props) {
  return (
    <h4
      className={twMerge(
        clsx(
          "font-display font-medium text-black leading-snug text-lg md:text-xl",
          className,
        ),
      )}
    >
      {children}
    </h4>
  );
}
