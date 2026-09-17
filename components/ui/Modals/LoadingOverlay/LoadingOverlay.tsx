"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Spinner } from "../../Badges/Spinner/Spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  className?: string;
  message?: string;
  /** Cover the nearest positioned ancestor instead of the whole viewport. */
  contained?: boolean;
}

export function LoadingOverlay({
  isLoading,
  className = "",
  message = "Loading…",
  contained = false,
}: LoadingOverlayProps) {
  if (!isLoading) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={twMerge(
        clsx(
          "inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-white/85 backdrop-blur-sm",
          contained ? "absolute" : "fixed",
          className,
        ),
      )}
    >
      <Spinner size="lg" />
      {message && <p className="text-xs font-medium text-muted">{message}</p>}
    </div>
  );
}
