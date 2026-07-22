"use client";
import { ReactNode, useRef, useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface DropdownItem {
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: "default" | "danger";
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
  align?: "left" | "right" | "center";
}

export function DropdownMenu({
  trigger,
  items,
  className = "",
  align = "left",
}: DropdownMenuProps) {
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
  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
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
              "absolute top-full mt-1 min-w-[160px] bg-white rounded-lg shadow-xl border border-black/5 py-1 z-50",
              alignClasses[align],
            ),
          )}
        >
          {items.map((item, index) => {
            const content = (
              <>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </>
            );
            return item.href ? (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={twMerge(
                  clsx(
                    "block px-4 py-2 text-sm transition-colors",
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-dark/5 text-gray-800",
                    item.variant === "danger" &&
                      "text-danger hover:bg-danger/5",
                  ),
                )}
              >
                {content}
              </a>
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={twMerge(
                  clsx(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-dark/5 text-gray-800",
                    item.variant === "danger" &&
                      "text-danger hover:bg-danger/5",
                  ),
                )}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
