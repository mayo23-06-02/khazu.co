"use client";
import { ReactNode, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "underline" | "pills" | "full";
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = "",
  variant = "underline",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const handleChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variantClasses = {
    underline: {
      list: "border-b border-black/5 gap-1",
      item: (isActive: boolean, disabled: boolean) =>
        clsx(
          "px-4 py-2.5 text-sm font-medium transition-colors border-b-2",
          isActive
            ? "border[#CD2C58] text-gray-800"
            : "border-transparent text-gray-800/50 hover:text-gray-800 hover:border-black/10",
          disabled && "opacity-50 cursor-not-allowed",
        ),
    },
    pills: {
      list: "gap-1",
      item: (isActive: boolean, disabled: boolean) =>
        clsx(
          "px-4 py-2 text-sm font-medium transition-colors rounded-lg",
          isActive
            ? "bg[#CD2C58] text-gray-800"
            : "text-gray-800/60 hover:bg-dark/5 hover:text-gray-800",
          disabled && "opacity-50 cursor-not-allowed",
        ),
    },
    full: {
      list: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1",
      item: (isActive: boolean, disabled: boolean) =>
        clsx(
          "px-4 py-2.5 text-sm font-medium transition-colors rounded-lg text-center",
          isActive
            ? "bg[#CD2C58] text-gray-800"
            : "bg-dark/5 text-gray-800/60 hover:bg-dark/10 hover:text-gray-800",
          disabled && "opacity-50 cursor-not-allowed",
        ),
    },
  };

  return (
    <div className={twMerge(clsx("w-full", className))}>
      <div
        className={twMerge(
          clsx("flex flex-wrap", variantClasses[variant].list),
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleChange(tab.id)}
            className={variantClasses[variant].item(
              activeTab === tab.id,
              !!tab.disabled,
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
