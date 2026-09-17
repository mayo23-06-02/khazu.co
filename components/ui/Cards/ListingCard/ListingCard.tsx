"use client";
import { Badge, Button } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ListingCardProps {
  title: string;
  status: "pending" | "approved" | "rejected" | "sold";
  seller: string;
  price: number;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

export function ListingCard({
  title,
  status,
  seller,
  price,
  onApprove,
  onReject,
  className = "",
}: ListingCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    sold: "bg-gray-100 text-gray-800",
  };
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
        <div>
          <h3 className="font-display font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-800/60">
            {seller} • SZL {price.toLocaleString()}
          </p>
        </div>
        <Badge variant="secondary" className={statusColors[status]}>
          {status}
        </Badge>
      </div>
      {status === "pending" && (
        <div className="flex gap-2 mt-3">
          <Button variant="primary" size="sm" onClick={onApprove}>
            Approve
          </Button>
          <Button variant="danger" size="sm" onClick={onReject}>
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
