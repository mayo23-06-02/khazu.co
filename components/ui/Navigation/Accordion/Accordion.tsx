"use client";
import { ReactNode, useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpen = [],
  multiple = false,
  className = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);
  const toggle = (id: string) => {
    if (multiple)
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    else setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
  };
  return (
    <div className={twMerge(clsx("divide-y divide-gray-300", className))}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id} className="py-2">
            <button
              onClick={() => !item.disabled && toggle(item.id)}
              disabled={item.disabled}
              className={twMerge(
                clsx(
                  "w-full flex items-center justify-between p-3 text-left transition-colors",
                  item.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300/5",
                ),
              )}
            >
              <span className="font-medium text-lg">{item.title}</span>
              {isOpen ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
            </button>
            {isOpen && (
              <div className="p-3 pt-1 text-gray-600">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
