"use client";
import { Badge } from "../Badge/Badge";

interface PriceBadgeProps {
  originalPrice: number;
  currentPrice: number;
  className?: string;
}

/** Renders nothing unless the price actually dropped. */
export function PriceBadge({ originalPrice, currentPrice, className = "" }: PriceBadgeProps) {
  if (!originalPrice || originalPrice <= currentPrice) return null;
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  if (discount <= 0) return null;
  return (
    <Badge variant="danger" className={className}>
      -{discount}%
    </Badge>
  );
}
