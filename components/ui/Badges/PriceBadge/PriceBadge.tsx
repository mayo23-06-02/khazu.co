'use client'
import { Badge } from '../Badge/Badge'

interface PriceBadgeProps {
  originalPrice: number
  currentPrice: number
  className?: string
}

export function PriceBadge({ originalPrice, currentPrice, className = '' }: PriceBadgeProps) {
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  if (discount <= 0) return null
  return <Badge variant="danger" className={className}>-{discount}%</Badge>
}