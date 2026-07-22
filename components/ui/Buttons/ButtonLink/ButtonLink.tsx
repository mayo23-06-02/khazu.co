"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg[#CD2C58] text-gray-800 hover:bg[#CD2C58]/80 focus:ring[#CD2C58]/50",
    secondary: "bg-dark text-white hover:bg-dark/90 focus:ring-dark/50",
    outline:
      "border-2 border-black bg-transparent text-gray-800 hover:bg-dark/10",
    ghost: "bg-transparent text-gray-800 hover:bg-dark/5",
    danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger/50",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  };
  return (
    <Link
      href={href}
      className={twMerge(
        clsx(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        ),
      )}
    >
      {children}
    </Link>
  );
}
