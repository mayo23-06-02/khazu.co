"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

interface LogoProps {
  href?: string;
  className?: string;
  /** "light" uses white logo for dark backgrounds */
  variant?: "default" | "light";
  children?: React.ReactNode;
}

export function Logo({
  href = "/",
  className = "",
  variant = "default",
  children,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={twMerge(
        clsx(
          "font-display uppercase font-bold text-2xl text-gray-800",
          className,
        ),
      )}
    >
      {children ?? (
        <Image
          src={variant === "light" ? "/logo-white.svg" : "/logo.svg"}
          alt="khazu logo"
          width={150}
          height={150}
        />
      )}
    </Link>
  );
}
