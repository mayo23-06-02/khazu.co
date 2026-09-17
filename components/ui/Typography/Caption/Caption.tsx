"use client";
import { ReactNode, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CaptionProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  muted?: boolean;
}

/** Small uppercase label used above a value or section title. */
export function Caption({
  children,
  className = "",
  as: Tag = "span",
  muted = true,
}: CaptionProps) {
  return (
    <Tag
      className={twMerge(
        clsx(
          "text-2xs font-semibold uppercase tracking-wider",
          muted ? "text-muted" : "text-ink",
          className,
        ),
      )}
    >
      {children}
    </Tag>
  );
}
