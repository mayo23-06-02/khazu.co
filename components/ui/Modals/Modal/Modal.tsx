"use client";
import { ReactNode, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = "",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-dark/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          clsx(
            // Full-width sheet on phones, centred dialog from sm up.
            "w-full rounded-t-2xl bg-white shadow-xl outline-none",
            "sm:rounded-2xl",
            "max-h-[92dvh] overflow-y-auto safe-area-pb",
            sizes[size],
            className,
          ),
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
            <div className="min-w-0">
              {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-1 shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <MdClose className="size-4" />
            </button>
          </div>
        )}
        <div className="px-4 py-4 text-sm text-ink">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
