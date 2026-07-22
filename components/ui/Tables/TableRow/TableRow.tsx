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

export function TableRow({
  children,
  className = "",
  hover = false,
  onClick,
}: TableRowProps) {
  return (
    <tr
      className={twMerge(
        clsx(
          "border-b border-black/5",
          hover && "hover:bg-dark/5 transition-colors",
          className,
        ),
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
