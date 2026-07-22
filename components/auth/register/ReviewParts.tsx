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
    <div className="rounded-md border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
          {title}
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-bold text-[#a72346] hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-gray-100 text-sm">{children}</div>
    </div>
  );
}

export function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <span className="text-gray-500 font-medium shrink-0">{label}</span>
      <span className="text-gray-900 font-semibold text-right break-all">
        {value || "—"}
      </span>
    </div>
  );
}
