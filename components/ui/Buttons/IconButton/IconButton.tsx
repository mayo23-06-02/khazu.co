"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonVariants,
  iconButtonSizes,
  type ButtonVariant,
  type ButtonSize,
} from "../buttonStyles";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Required: an icon alone gives screen readers nothing to announce. */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Pill shape instead of the standard xl radius. */
  round?: boolean;
}

export function IconButton({
  children,
  label,
  variant = "ghost",
  size = "md",
  round = false,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={twMerge(
        clsx(
          buttonBase,
          buttonVariants[variant],
          iconButtonSizes[size],
          "p-0",
          round && "rounded-full",
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  );
}
