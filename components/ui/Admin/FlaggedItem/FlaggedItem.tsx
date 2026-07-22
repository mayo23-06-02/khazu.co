"use client";
import { Badge, Button } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FlaggedItemProps {
  id: string;
  title: string;
  flagReason: string;
  riskScore: number;
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}

export function FlaggedItem({
  id,
  title,
  flagReason,
  riskScore,
  onApprove,
  onReject,
  className = "",
}: FlaggedItemProps) {
  const riskColor =
    riskScore > 70
      ? "bg-danger/10 text-danger"
      : riskScore > 40
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800";
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-4",
          className,
        ),
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">${title}</h3>
        <Badge variant="secondary" className={riskColor}>
          Risk ${riskScore}%
        </Badge>
      </div>
      <p className="mt-1 text-sm text-gray-800/60">Reason: ${flagReason}</p>
      <div className="mt-3 flex gap-2">
        <Button variant="primary" size="sm" onClick={onApprove}>
          Approve
        </Button>
        <Button variant="danger" size="sm" onClick={onReject}>
          Reject
        </Button>
      </div>
    </div>
  );
}
