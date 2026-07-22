"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  as?: any;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  as: Component = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center cursor-pointer rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#1a1a1a] text-white hover:bg-[#CD2C58] hover:text-white",
    secondary:
      "bg-[#CD2C58] text-white hover:bg-[#1a1a1a] hover:text-white focus:ring-black/50",
    outline:
      "border border-black bg-transparent text-gray-800 hover:bg-dark/10",
    ghost: "bg-transparent text-gray-800 hover:bg-dark/5",
    danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger/50",
  };
  const sizes = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-10 py-3.5 text-base",
    lg: "px-14 py-6 text-lg",
  };
  return (
    <Component
      className={twMerge(
        clsx(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        ),
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4 mr-2" />
      )}
      {children}
    </Component>
  );
}
