"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "../Button/Button";

interface CtaButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CtaButton({
  children,
  className = "",
  onClick,
}: CtaButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      onClick={onClick}
      className={twMerge(
        clsx(
          "shadow-md hover:shadow-lg bg-[#1a1a1a] transform active:scale-95 transition-all",
          className,
        ),
      )}
    >
      {children}
    </Button>
  );
}
