"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SmallProps {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

export function Small({ children, className = "", muted = false }: SmallProps) {
  return (
    <small
      className={twMerge(
        clsx(
          "text-sm leading-normal",
          muted ? "text-gray-800" : "text-gray-800",
          className,
        ),
      )}
    >
      <p>{children}</p>
    </small>
  );
}
