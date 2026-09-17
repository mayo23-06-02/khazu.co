"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TableRowProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function TableRow({ children, className = "", hover = false, onClick }: TableRowProps) {
  const interactive = Boolean(onClick);
  return (
    <tr
      onClick={onClick}
      {...(interactive
        ? {
            role: "button",
            tabIndex: 0,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            },
          }
        : {})}
      className={twMerge(
        clsx(
          "border-b border-line last:border-0",
          (hover || interactive) && "transition-colors hover:bg-surface-alt",
          interactive && "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary",
          className,
        ),
      )}
    >
      {children}
    </tr>
  );
}
