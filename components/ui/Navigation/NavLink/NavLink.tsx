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

export function NavLink({ href, children, className = "", active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={twMerge(
        clsx(
          "rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          active ? "bg-primary-subtle text-primary" : "text-muted hover:bg-surface-sunken hover:text-ink",
          className,
        ),
      )}
    >
      {children}
    </Link>
  );
}
