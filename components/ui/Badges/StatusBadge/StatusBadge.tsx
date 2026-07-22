'use client'
import { Badge } from '../Badge/Badge'

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'sold' | 'expired' | 'flagged'
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colors = {
    active: 'success',
    pending: 'warning',
    sold: 'secondary',
    expired: 'secondary',
    flagged: 'danger',
  } as const
  return <Badge variant={colors[status]} className={className}>{status}</Badge>
}