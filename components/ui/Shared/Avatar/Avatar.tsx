"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, alt = "", initials, size = "md", className = "" }: AvatarProps) {
  const sizes = {
    xs: "size-6 text-2xs",
    sm: "size-7 text-2xs",
    md: "size-9 text-xs",
    lg: "size-11 text-sm",
    xl: "size-14 text-base",
  };
  const base = clsx(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
    sizes[size],
  );

  if (src) {
    // Plain <img>: avatar sources are frequently remote and unconfigured hosts
    // would throw with next/image.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={twMerge(clsx(base, "object-cover", className))}
        loading="lazy"
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt || initials || "Avatar"}
      className={twMerge(
        clsx(base, "bg-primary-subtle font-semibold uppercase text-primary", className),
      )}
    >
      {initials?.slice(0, 2) ?? "?"}
    </span>
  );
}
