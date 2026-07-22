"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface LoadingOverlayProps {
  isLoading: boolean;
  className?: string;
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  className = "",
  message = "Loading...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;
  return (
    <div
      className={twMerge(
        clsx(
          "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm",
          className,
        ),
      )}
    >
      <div className="w-12 h-12 border-4 border[#CD2C58] border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-sm text-gray-800/60">${message}</p>
    </div>
  );
}
