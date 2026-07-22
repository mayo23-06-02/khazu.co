"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-4 sm:p-5",
    lg: "p-6 sm:p-8",
  };
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-md  border border-black/5",
          paddings[padding],
          hover && "hover:shadow-md transition-shadow duration-200",
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(clsx("border-b border-black/5 pb-1 mb-4", className))}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={twMerge(clsx("flex-1", className))}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(clsx("border-t border-black/5 pt-3 mt-4", className))}
    >
      {children}
    </div>
  );
}
