"use client";
import { ReactNode, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TabItem {
  id: string;
  label: ReactNode;
  content?: ReactNode;
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
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
  };
  const activeTab = tabs.find((t) => t.id === active);

  const listStyles = {
    underline: "border-b border-line gap-1",
    pills: "gap-1.5",
    full: "gap-1.5 w-full",
  };

  const tabStyles = (isActive: boolean) => {
    if (variant === "underline") {
      return clsx(
        "-mb-px border-b-2 px-3 py-2",
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-muted hover:text-ink",
      );
    }
    return clsx(
      "rounded-xl px-3 py-1.5",
      variant === "full" && "flex-1",
      isActive ? "bg-primary text-white" : "text-muted hover:bg-surface-sunken hover:text-ink",
    );
  };

  return (
    <div className={twMerge(clsx("w-full", className))}>
      <div
        role="tablist"
        className={clsx(
          "flex items-center overflow-x-auto scrollbar-hide",
          listStyles[variant],
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => select(tab.id)}
              className={clsx(
                "shrink-0 whitespace-nowrap text-xs font-semibold transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                "disabled:cursor-not-allowed disabled:opacity-40",
                tabStyles(isActive),
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab?.content && (
        <div role="tabpanel" className="pt-3">
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
