"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface StatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  className?: string;
}

export function StatsCard({
  icon,
  value,
  label,
  trend,
  className = "",
}: StatsCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-4",
          className,
        ),
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-[#CD2C58]">{icon}</div>
        <div>
          <div className="text-2xl font-display font-bold text-gray-800">
            {value}
          </div>
          <div className="text-sm text-gray-800/60">{label}</div>
          {trend && (
            <div className="text-xs text-gray-800/40 mt-0.5">{trend}</div>
          )}
        </div>
      </div>
    </div>
  );
}
