"use client";
import { ReactNode } from "react";
import { Button } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BulkActionBarProps {
  selectedCount: number;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "danger";
  }>;
  className?: string;
}

export function BulkActionBar({
  selectedCount,
  actions,
  className = "",
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div
      className={twMerge(
        clsx(
          "sticky top-0 z-20 bg-white border-b border-black/5 p-3 flex items-center justify-between",
          className,
        ),
      )}
    >
      <span className="text-sm text-gray-800/60">
        {selectedCount} selected
      </span>
      <div className="flex gap-2">
        {actions.map((a, i) => (
          <Button
            key={i}
            variant={(a.variant as any) || "secondary"}
            size="sm"
            onClick={a.onClick}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
