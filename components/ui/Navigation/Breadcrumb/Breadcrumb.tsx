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
  separator = <MdChevronRight className="text-gray-800/20 text-xs" />,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={twMerge(clsx("flex items-center gap-1 text-sm", className))}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-800/50 hover:text-gray-800 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? "text-gray-800 font-medium" : "text-gray-800/50"
                  }
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
