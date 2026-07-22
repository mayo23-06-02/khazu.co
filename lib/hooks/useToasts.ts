"use client";

import { useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastEntry = { id: number; type: ToastType; message: string };

/** Local toast queue for pages/components using the `Toast`/`ToastContainer` primitives. */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const pushToast = (type: ToastType, message: string) => {
    setToasts((t) => [...t, { id: Date.now(), type, message }]);
  };

  const dismissToast = (id: number) => {
    setToasts((t) => t.filter((entry) => entry.id !== id));
  };

  return { toasts, pushToast, dismissToast };
}
