"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonVariants,
  buttonSizes,
  type ButtonVariant,
  type ButtonSize,
} from "../buttonStyles";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  external?: boolean;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  external = false,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={twMerge(
        clsx(
          buttonBase,
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && "w-full",
          className,
        ),
      )}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </Link>
  );
}
