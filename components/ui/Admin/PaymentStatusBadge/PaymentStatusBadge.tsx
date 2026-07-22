'use client'
import { Badge } from '@/components/ui'

interface PaymentStatusBadgeProps {
  status: 'paid' | 'pending' | 'failed' | 'refunded'
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const colors = { paid: 'success', pending: 'warning', failed: 'danger', refunded: 'secondary' }
  return <Badge variant={colors[status] as any}>{status}</Badge>
}