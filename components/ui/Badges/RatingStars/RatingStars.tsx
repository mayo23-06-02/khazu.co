"use client";
import { MdStar, MdStarHalf, MdStarBorder } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  className = "",
}: RatingStarsProps) {
  const sizes = { sm: "size-3", md: "size-4", lg: "size-5" };
  return (
    <span
      className={twMerge(clsx("inline-flex items-center gap-0.5", className))}
      role="img"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating > i;
        const Icon = filled ? MdStar : half ? MdStarHalf : MdStarBorder;
        return (
          <Icon
            key={i}
            aria-hidden="true"
            className={clsx(sizes[size], filled || half ? "text-warning" : "text-line-strong")}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-2xs font-semibold text-muted">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
