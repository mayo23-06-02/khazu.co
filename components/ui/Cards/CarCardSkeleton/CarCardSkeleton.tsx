"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CarCardSkeletonProps {
  className?: string;
}

export function CarCardSkeleton({ className = "" }: CarCardSkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden animate-pulse",
          className,
        ),
      )}
    >
      <div className="aspect-[16/10] bg-dark/10" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-dark/10 rounded w-3/4" />
        <div className="h-4 bg-dark/10 rounded w-1/2" />
        <div className="h-4 bg-dark/10 rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-8 bg-dark/10 rounded flex-1" />
          <div className="h-8 bg-dark/10 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}
