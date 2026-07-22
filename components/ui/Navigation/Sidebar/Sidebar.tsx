"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
  children: ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg";
  position?: "left" | "right";
}

export function Sidebar({
  children,
  className = "",
  width = "md",
  position = "left",
}: SidebarProps) {
  const widths = { sm: "w-48", md: "w-64", lg: "w-80" };
  return (
    <aside
      className={twMerge(
        clsx(
          "hidden lg:block shrink-0 h-full overflow-y-auto",
          widths[width],
          position === "left"
            ? "border-r border-black/5 pr-4"
            : "border-l border-black/5 pl-4",
          className,
        ),
      )}
    >
      {children}
    </aside>
  );
}
