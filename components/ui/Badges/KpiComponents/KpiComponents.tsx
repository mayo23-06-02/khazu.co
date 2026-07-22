"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface KpiGaugeProps {
  value: number;
  label: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function KpiGauge({
  value,
  label,
  color = "stroke[#CD2C58]",
  size = "md",
  className = "",
}: KpiGaugeProps) {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={twMerge(
        clsx("flex flex-col items-center justify-center", className),
      )}
    >
      <div className={twMerge(clsx("relative", sizes[size]))}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform -rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-dark/5 fill-none stroke-[8]"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={twMerge(
              clsx(
                "fill-none stroke-[8] transition-all duration-1000 ease-out",
                color,
              ),
            )}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={twMerge(
              clsx(
                "font-display font-black text-gray-800",
                size === "sm"
                  ? "text-xs"
                  : size === "md"
                    ? "text-lg"
                    : "text-2xl",
              ),
            )}
          >
            {value}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-800/40">
        {label}
      </span>
    </div>
  );
}

export function ValueScoreBadge({ score }: { score: number }) {
  const getRating = (v: number) => {
    if (v >= 90)
      return {
        label: "Exceptional",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    if (v >= 75)
      return {
        label: "Great Value",
        color: "bg[#CD2C58]/20 text-gray-800 border[#CD2C58]/30",
      };
    if (v >= 50)
      return {
        label: "Fair Value",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return {
      label: "Below Avg",
      color: "bg-red-100 text-red-800 border-red-200",
    };
  };
  const rating = getRating(score);
  return (
    <div
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-widest",
          rating.color,
        ),
      )}
    >
      {rating.label} • {score}
    </div>
  );
}

export function MarketRankBadge({ rank }: { rank: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10">
      <span className="text[#CD2C58]">#{rank}</span> in segment
    </div>
  );
}
