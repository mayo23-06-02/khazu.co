"use client";
import { Badge, type BadgeVariant } from "../Badge/Badge";

type Status = "active" | "pending" | "sold" | "expired" | "flagged" | "draft" | "archived";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const map: Record<Status, { variant: BadgeVariant; label: string }> = {
  active: { variant: "success", label: "Active" },
  pending: { variant: "warning", label: "Pending" },
  sold: { variant: "info", label: "Sold" },
  expired: { variant: "secondary", label: "Expired" },
  flagged: { variant: "danger", label: "Flagged" },
  draft: { variant: "secondary", label: "Draft" },
  archived: { variant: "secondary", label: "Archived" },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { variant, label } = map[status] ?? map.draft;
  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  );
}
