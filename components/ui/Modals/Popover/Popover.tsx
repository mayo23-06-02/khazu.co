"use client";
import { ReactNode, useRef, useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  position?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
}

export function Popover({
  trigger,
  children,
  className = "",
  position = "bottom-start",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const positionClasses = {
    "bottom-start": "top-full left-0 mt-1",
    "bottom-end": "top-full right-0 mt-1",
    "top-start": "bottom-full left-0 mb-1",
    "top-end": "bottom-full right-0 mb-1",
  };
  return (
    <div
      className={twMerge(clsx("relative inline-block", className))}
      ref={containerRef}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={twMerge(
            clsx(
              "absolute z-40 min-w-[200px] bg-white rounded-lg shadow-xl border border-black/5 p-3",
              positionClasses[position],
            ),
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
