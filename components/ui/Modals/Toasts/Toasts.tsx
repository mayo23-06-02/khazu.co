"use client";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({
  type = "info",
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);
  const icons = {
    success: <MdCheckCircle size={20} />,
    error: <MdError size={20} />,
    warning: <MdError size={20} />,
    info: <MdInfo size={20} />,
  };
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-danger/10 border-danger/30 text-danger",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
    info: "bg-[#CD2C58]/10 border-[#CD2C58]/30 text-gray-800",
  };
  if (!visible) return null;
  return (
    <div
      className={twMerge(
        clsx(
          "relative flex items-start gap-3 rounded-lg border p-4 shadow-sm animate-in slide-in-from-top-2 fade-in",
          styles[type],
        ),
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        className="shrink-0 opacity-50 hover:opacity-100"
      >
        <MdClose size={18} />
      </button>
    </div>
  );
}
