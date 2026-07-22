"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function FloatingActionButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: FloatingActionButtonProps) {
  const variants = {
    primary: "bg[#CD2C58] text-gray-800 hover:bg[#CD2C58]/90 shadow-lg",
    secondary: "bg-dark text-white hover:bg-dark/90 shadow-lg",
    danger: "bg-danger text-white hover:bg-danger/90 shadow-lg",
  };
  return (
    <button
      className={twMerge(
        clsx(
          "fixed bottom-6 right-6 z-30 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          variants[variant],
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  );
}
