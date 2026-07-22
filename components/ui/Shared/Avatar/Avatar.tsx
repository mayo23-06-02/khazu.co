"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
  src?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  initials,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };
  return (
    <div
      className={twMerge(
        clsx(
          "relative flex items-center justify-center rounded-full bg-dark/10 text-gray-800 font-medium overflow-hidden",
          sizes[size],
          className,
        ),
      )}
    >
      {src ? (
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        initials || "?"
      )}
    </div>
  );
}
