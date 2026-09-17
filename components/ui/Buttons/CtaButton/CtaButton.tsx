"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "../Button/Button";
import type { ButtonVariant } from "../buttonStyles";

interface CtaButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CtaButton({
  children,
  variant = "primary",
  fullWidth = true,
  className = "",
  onClick,
}: CtaButtonProps) {
  return (
    <Button
      variant={variant}
      size="lg"
      fullWidth={fullWidth}
      onClick={onClick}
      className={twMerge(clsx("shadow-brand active:scale-[0.98]", className))}
    >
      {children}
    </Button>
  );
}
