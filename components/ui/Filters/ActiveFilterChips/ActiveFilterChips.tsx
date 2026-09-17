"use client";
import { MdClose } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Badge } from "../../Badges/Badge/Badge";

interface ActiveFilterChipsProps {
  filters: Record<string, string>;
  onRemove: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilterChips({
  filters,
  onRemove,
  onClearAll,
  className = "",
}: ActiveFilterChipsProps) {
  const entries = Object.entries(filters);
  if (entries.length === 0) return null;

  return (
    <div className={twMerge(clsx("flex flex-wrap items-center gap-1", className))}>
      {entries.map(([key, value]) => (
        <Badge key={key} variant="secondary" size="md">
          <span className="text-muted">{key}:</span>
          <span className="font-semibold text-ink">{value}</span>
          <button
            type="button"
            onClick={() => onRemove(key)}
            aria-label={`Remove ${key} filter`}
            className="-mr-0.5 ml-0.5 rounded-full p-0.5 transition-colors hover:bg-danger-light hover:text-danger"
          >
            <MdClose className="size-3" />
          </button>
        </Badge>
      ))}
      {onClearAll && entries.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-1 text-2xs font-semibold text-primary underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
