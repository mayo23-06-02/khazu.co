"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: ReactNode;
}

export function Breadcrumb({
  items,
  className = "",
  separator = <MdChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted" />,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={twMerge(clsx("min-w-0", className))}>
      <ol className="flex flex-wrap items-center gap-1 text-xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-semibold text-ink" : "text-muted"}
                >
                  {item.label}
                </span>
              )}
              {!isLast && separator}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
