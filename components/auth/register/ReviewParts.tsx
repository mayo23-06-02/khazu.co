"use client";

import type { ReactNode } from "react";

export function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-line overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-alt border-b border-line">
        <span className="text-xs font-bold uppercase tracking-wider text-dark-light">
          {title}
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-bold text-primary hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-line text-sm">{children}</div>
    </div>
  );
}

export function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <span className="text-muted font-medium shrink-0">{label}</span>
      <span className="text-ink font-semibold text-right break-all">
        {value || "—"}
      </span>
    </div>
  );
}
