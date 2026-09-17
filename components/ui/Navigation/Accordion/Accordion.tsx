"use client";
import { ReactNode, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
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
    setOpenItems((prev) => {
      const isOpen = prev.includes(id);
      if (multiple) return isOpen ? prev.filter((i) => i !== id) : [...prev, id];
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={twMerge(clsx("divide-y divide-line rounded-xl border border-line bg-white", className))}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left text-sm font-semibold text-ink transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
            >
              <span className="min-w-0">{item.title}</span>
              <MdExpandMore
                aria-hidden="true"
                className={clsx(
                  "size-4 shrink-0 text-muted transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="px-3.5 pb-3 text-xs leading-relaxed text-muted">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
