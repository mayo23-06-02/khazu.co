"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TableCellProps {
  children: ReactNode;
  className?: string;
  as?: "td" | "th";
  align?: "left" | "center" | "right";
}

export function TableCell({ children, className = "", as: Tag = "td", align = "left" }: TableCellProps) {
  const aligns = { left: "text-left", center: "text-center", right: "text-right" };
  return (
    <Tag
      scope={Tag === "th" ? "col" : undefined}
      className={twMerge(
        clsx("px-3 py-2.5 align-middle", Tag === "td" && "text-ink", aligns[align], className),
      )}
    >
      {children}
    </Tag>
  );
}
