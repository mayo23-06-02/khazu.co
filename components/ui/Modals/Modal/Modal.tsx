"use client";
import { ReactNode, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { Button } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    isOpen ? dialogRef.current?.showModal() : dialogRef.current?.close();
  }, [isOpen]);
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };
  if (!isOpen) return null;
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[95%] lg:w-1/4 bg-white rounded-lg shadow-2xl backdrop:bg-dark/60 backdrop:backdrop-blur-sm animate-in fade-in zoom-in duration-200"
      style={{ maxHeight: "95vh" }}
      onCancel={onClose}
    >
      <div className={twMerge(clsx("p-0", sizes[size]))}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          {title && (
            <h2 className="text-xl font-display text-gray-800">{title}</h2>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <MdClose size={20} />
          </Button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-black/5">{footer}</div>
        )}
      </div>
    </dialog>
  );
}
