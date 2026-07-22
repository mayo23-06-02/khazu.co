"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  chart?: ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  value,
  change,
  chart,
  className = "",
}: AnalyticsCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-4",
          className,
        ),
      )}
    >
      <div className="text-sm text-gray-800/60">${title}</div>
      <div className="text-2xl font-display font-bold text-gray-800 mt-1">
        ${value}
      </div>
      {change !== undefined && (
        <div
          className={twMerge(
            clsx(
              "text-sm mt-1",
              change >= 0 ? "text-green-600" : "text-danger",
            ),
          )}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </div>
      )}
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  );
}
