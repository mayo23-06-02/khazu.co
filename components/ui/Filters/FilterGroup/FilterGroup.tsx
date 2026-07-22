"use client";
import { ReactNode, useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FilterGroupProps {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function FilterGroup({
  label,
  children,
  defaultOpen = false,
  className = "",
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={twMerge(clsx("border-b border-black/5 py-3", className))}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-800"
      >
        ${label}
        {isOpen ? <MdExpandLess size={14} /> : <MdExpandMore size={14} />}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}
