"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant =
  | "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "xs" | "sm" | "md";
  /** Show a leading status dot. */
  dot?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary-subtle text-primary",
  secondary: "bg-surface-sunken text-dark-light",
  success: "bg-success-light text-success",
  danger: "bg-danger-light text-danger",
  warning: "bg-warning-light text-warning",
  info: "bg-info-light text-info",
  outline: "border border-line-strong text-ink",
};

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  dot = false,
  className = "",
}: BadgeProps) {
  const sizes = {
    xs: "px-1.5 py-0.5 text-2xs gap-1",
    sm: "px-2 py-0.5 text-2xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full font-semibold whitespace-nowrap leading-none",
          variants[variant],
          sizes[size],
          className,
        ),
      )}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
