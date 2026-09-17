"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TableProps {
  children: ReactNode;
  className?: string;
  caption?: string;
}

export function Table({ children, className = "", caption }: TableProps) {
  return (
    <div
      className={twMerge(
        clsx("w-full overflow-x-auto rounded-xl border border-line bg-white", className),
      )}
    >
      <table className="w-full min-w-max border-collapse text-left text-xs">
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}
