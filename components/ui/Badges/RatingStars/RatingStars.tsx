"use client";
import { MdStar, MdStarHalf } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  size = "md",
  className = "",
}: RatingStarsProps) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-lg" };
  return (
    <div
      className={twMerge(
        clsx(
          "flex items-center gap-0.5 text-yellow-400",
          sizes[size],
          className,
        ),
      )}
    >
      {Array.from({ length: Math.floor(rating) }).map((_, i) => (
        <MdStar key={i} />
      ))}
      {rating % 1 >= 0.5 && <MdStarHalf />}
      {Array.from({ length: max - Math.ceil(rating) }).map((_, i) => (
        <MdStar key={i} className="opacity-20" />
      ))}
    </div>
  );
}
