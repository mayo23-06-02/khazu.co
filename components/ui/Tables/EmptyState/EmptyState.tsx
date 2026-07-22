"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col items-center justify-center py-12 text-center",
          className,
        ),
      )}
    >
      {icon && <div className="text-4xl text-gray-800/20 mb-4">{icon}</div>}
      <h3 className="font-display  text-xl font-medium text-gray-800">
        {title}
      </h3>
      <p className=" text-gray-700 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
