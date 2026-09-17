"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        clsx("flex flex-col items-center justify-center gap-2 px-4 py-10 text-center", className),
      )}
    >
      {icon && (
        <span className="mb-1 flex size-10 items-center justify-center rounded-full bg-surface-sunken text-muted">
          {icon}
        </span>
      )}
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
