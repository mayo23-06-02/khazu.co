"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Heading6Props {
  children: ReactNode;
  className?: string;
}

export function Heading6({ children, className = "" }: Heading6Props) {
  return (
    <h6
      className={twMerge(
        clsx(
          "font-display font-medium text-black leading-snug text-sm md:text-base",
          className,
        ),
      )}
    >
      {children}
    </h6>
  );
}
