"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export function NavLink({
  href,
  children,
  className = "",
  active = false,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 text-sm font-medium transition-colors rounded-lg px-3 py-2",
          active
            ? "bg[#CD2C58]/10 text[#CD2C58]"
            : "text-gray-800/70 hover:text-gray-800 hover:bg-dark/5",
          className,
        ),
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
