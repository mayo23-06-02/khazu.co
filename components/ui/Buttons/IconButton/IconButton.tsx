"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg[#CD2C58] text-gray-800 hover:bg[#CD2C58]/80 focus:ring[#CD2C58]/50",
    secondary: "bg-dark/10 text-gray-800 hover:bg-dark/20 focus:ring-dark/30",
    outline:
      "border-2 border-black bg-transparent text-gray-800 hover:bg-dark/10",
    ghost: "bg-transparent text-gray-800 hover:bg-dark/5",
    danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger/50",
  };
  const sizes = { sm: "p-1.5", md: "p-2", lg: "p-2.5" };
  return (
    <button
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
}
