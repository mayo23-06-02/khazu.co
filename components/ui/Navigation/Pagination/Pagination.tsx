"use client";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/Buttons/Button/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showNumbers?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showNumbers = true,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    if (end - start < maxVisible - 1) {
      if (start === 1) end = Math.min(totalPages, start + maxVisible - 1);
      else if (end === totalPages) start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  if (totalPages <= 1) return null;
  return (
    <div
      className={twMerge(
        clsx("flex items-center gap-1 sm:gap-2 flex-wrap", className),
      )}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center rounded-lg font-medium transition-colors border border-black/20 px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark/5"
      >
        <MdChevronLeft size={14} />
        <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
      </button>
      {showNumbers &&
        getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={twMerge(
              clsx(
                "inline-flex items-center justify-center rounded-lg font-medium transition-colors px-3 py-1.5 text-sm",
                page === currentPage
                  ? "bg[#CD2C58] text-gray-800"
                  : "border border-black/20 hover:bg-dark/5",
              ),
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center rounded-lg font-medium transition-colors border border-black/20 px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark/5"
      >
        <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
        <MdChevronRight size={14} />
      </button>
    </div>
  );
}
