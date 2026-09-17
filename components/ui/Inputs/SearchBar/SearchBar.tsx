"use client";
import { forwardRef, useEffect, useState, InputHTMLAttributes } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { controlBase, controlSizes, type ControlSize } from "../inputStyles";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  onSearch?: (value: string) => void;
  debounce?: number;
  size?: ControlSize;
  fullWidth?: boolean;
  onClear?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      onSearch,
      debounce = 300,
      size = "md",
      fullWidth = true,
      className = "",
      placeholder = "Search\u2026",
      value,
      onChange,
      onClear,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = useState(String(value ?? ""));
    const isControlled = value !== undefined;
    const current = isControlled ? String(value) : internal;

    useEffect(() => {
      if (!onSearch) return;
      const t = setTimeout(() => onSearch(current), debounce);
      return () => clearTimeout(t);
    }, [current, debounce, onSearch]);

    return (
      <div className={twMerge(clsx("relative", fullWidth && "w-full"))}>
        <MdSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
        <input
          ref={ref}
          type="search"
          role="searchbox"
          placeholder={placeholder}
          value={current}
          onChange={(e) => {
            if (!isControlled) setInternal(e.target.value);
            onChange?.(e);
          }}
          className={twMerge(
            clsx(
              controlBase,
              controlSizes[size],
              "border-line-strong focus:border-primary focus:ring-primary/20",
              "pl-9 pr-9 [&::-webkit-search-cancel-button]:appearance-none",
              className,
            ),
          )}
          {...props}
        />
        {current && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              if (!isControlled) setInternal("");
              onClear?.();
              onSearch?.("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
          >
            <MdClose className="size-4" />
          </button>
        )}
      </div>
    );
  },
);
SearchBar.displayName = "SearchBar";
