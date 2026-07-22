"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ChatBubbleProps {
  children: ReactNode;
  variant?: "sent" | "received";
  timestamp?: string;
  className?: string;
}

export function ChatBubble({
  children,
  variant = "received",
  timestamp,
  className = "",
}: ChatBubbleProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex",
          variant === "sent" ? "justify-end" : "justify-start",
          className,
        ),
      )}
    >
      <div
        className={twMerge(
          clsx(
            "max-w-[75%] rounded-lg p-3 text-sm",
            variant === "sent"
              ? "bg[#CD2C58] text-gray-800"
              : "bg-dark/10 text-gray-800",
            className,
          ),
        )}
      >
        {children}
        {timestamp && (
          <div
            className={twMerge(
              clsx(
                "text-[10px] mt-1",
                variant === "sent" ? "text-gray-800/50" : "text-gray-800/40",
              ),
            )}
          >
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
