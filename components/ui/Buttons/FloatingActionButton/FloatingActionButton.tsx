"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { buttonVariants, type ButtonVariant } from "../buttonStyles";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
  variant?: ButtonVariant;
}

export function FloatingActionButton({
  children,
  label,
  variant = "primary",
  className = "",
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={twMerge(
        clsx(
          "fixed bottom-5 right-5 z-30 inline-flex size-12 items-center justify-center rounded-full",
          "shadow-lg transition-colors duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "safe-area-pb",
          buttonVariants[variant],
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  );
}
