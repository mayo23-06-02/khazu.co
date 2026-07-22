"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  breadcrumb?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className = "",
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6",
          className,
        ),
      )}
    >
      <div>
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        <div className="font-display text-2xl sm:text-3xl font-bold text-gray-800">
          {title}
        </div>
        {subtitle && (
          <p className="mt-1 text-gray-800/60 text-sm">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
}
