"use client";
import { ReactNode, ButtonHTMLAttributes, ElementType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonVariants,
  buttonSizes,
  type ButtonVariant,
  type ButtonSize,
} from "../buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  as?: ElementType;
  href?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  className = "",
  disabled,
  as: Component = "button",
  ...props
}: ButtonProps) {
  return (
    <Component
      className={twMerge(
        clsx(
          buttonBase,
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && "w-full",
          className,
        ),
      )}
      disabled={Component === "button" ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leadingIcon
      )}
      {children}
      {!loading && trailingIcon}
    </Component>
  );
}
