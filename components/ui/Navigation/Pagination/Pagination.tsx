"use client";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showNumbers?: boolean;
}

/** Windowed page list: 1 … 4 5 [6] 7 8 … 20 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("gap");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("gap");
  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showNumbers = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const btn =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-xl px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40 disabled:pointer-events-none";

  return (
    <nav
      aria-label="Pagination"
      className={twMerge(clsx("flex flex-wrap items-center justify-center gap-1", className))}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className={clsx(btn, "border border-line-strong text-ink hover:bg-surface-sunken")}
      >
        <MdChevronLeft className="size-4" />
      </button>

      {showNumbers &&
        pageWindow(currentPage, totalPages).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-xs text-muted">
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={clsx(
                btn,
                p === currentPage
                  ? "bg-primary text-white"
                  : "border border-line-strong text-ink hover:bg-surface-sunken",
              )}
            >
              {p}
            </button>
          ),
        )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className={clsx(btn, "border border-line-strong text-ink hover:bg-surface-sunken")}
      >
        <MdChevronRight className="size-4" />
      </button>
    </nav>
  );
}
