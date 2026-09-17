"use client";
import { ReactNode, useState, useId } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({ children, content, position = "top", className = "" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? id : undefined}>{children}</span>
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={twMerge(
            clsx(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-dark px-2 py-1",
              "text-2xs font-medium text-white shadow-md",
              positionClasses[position],
              className,
            ),
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
