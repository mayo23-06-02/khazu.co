"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className = "",
}: ProgressBarProps) {
  const percent = Math.min(100, (value / max) * 100);
  return (
    <div className={twMerge(clsx("flex flex-col gap-1", className))}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="text-gray-800/60">{value}</span>
        </div>
      )}
      <div className="h-2 bg-dark/10 rounded-full overflow-hidden">
        <div
          className="h-full bg[#CD2C58] transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
