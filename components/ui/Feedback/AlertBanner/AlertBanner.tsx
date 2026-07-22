"use client";
import { ReactNode } from "react";
import { MdInfo } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AlertBannerProps {
  children: ReactNode;
  variant?: "info" | "warning" | "danger" | "success";
  className?: string;
}

export function AlertBanner({
  children,
  variant = "info",
  className = "",
}: AlertBannerProps) {
  const variants = {
    info: "bg[#CD2C58]/10 text-gray-800 border[#CD2C58]/20",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    danger: "bg-danger/10 text-danger border-danger/20",
    success: "bg-green-50 text-green-800 border-green-200",
  };
  return (
    <div
      className={twMerge(
        clsx(
          "border rounded-lg p-3 text-sm flex items-center gap-2",
          variants[variant],
          className,
        ),
      )}
    >
      <MdInfo />
      {children}
    </div>
  );
}
