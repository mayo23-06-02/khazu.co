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

/**
 * The canonical "big primary action" button — Search cars, Sell My Car,
 * Sign Up Free, Get this deal, etc. Bakes in one fixed size (h-12 on
 * mobile, h-14 from md up) so every prominent CTA across the app matches
 * without each call site re-declaring its own height/padding override.
 */
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
      className={twMerge(
        clsx(
          "h-12 md:h-14 text-sm sm:text-base shadow-brand active:scale-[0.98]",
          className,
        ),
      )}
    >
      {children}
    </Button>
  );
}
