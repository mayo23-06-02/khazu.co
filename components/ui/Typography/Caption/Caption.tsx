"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CaptionProps {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

export function Caption({
  children,
  className = "",
  muted = false,
}: CaptionProps) {
  return (
    <figcaption
      className={twMerge(
        clsx(
          "text-[10px] sm:text-xs font-sans uppercase tracking-wider",
          muted ? "text-gray-800/40" : "text-gray-800/60",
          className,
        ),
      )}
    >
      {children}
    </figcaption>
  );
}
