"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  /** Lift the card off the page with a shadow instead of a hairline border. */
  elevated?: boolean;
  as?: "div" | "article" | "section" | "li";
}

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  elevated = false,
  as: Tag = "div",
}: CardProps) {
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-3.5 sm:p-4",
    lg: "p-4 sm:p-6",
  };
  return (
    <Tag
      className={twMerge(
        clsx(
          "rounded-xl bg-white",
          elevated ? "shadow-md" : "border border-line",
          paddings[padding],
          hover &&
            "transition-shadow duration-200 ease-out hover:shadow-md focus-within:shadow-md",
          className,
        ),
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={twMerge(clsx("mb-3 flex items-start justify-between gap-3 border-b border-line pb-3", className))}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={twMerge(clsx("flex-1", className))}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={twMerge(clsx("mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3", className))}>
      {children}
    </div>
  );
}
