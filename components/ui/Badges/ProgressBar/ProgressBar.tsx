"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "primary",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const tones = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  const sizes = { sm: "h-1", md: "h-1.5" };
  return (
    <div className={twMerge(clsx("flex w-full flex-col gap-1", className))}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-2xs font-medium text-muted">{label}</span>}
          {showValue && (
            <span className="text-2xs font-semibold text-ink">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={clsx("w-full overflow-hidden rounded-full bg-surface-sunken", sizes[size])}
      >
        <div
          className={clsx("h-full rounded-full transition-[width] duration-300 ease-out", tones[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
