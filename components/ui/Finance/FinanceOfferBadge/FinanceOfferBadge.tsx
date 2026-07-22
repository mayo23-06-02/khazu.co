'use client'
import { MdAttachMoney } from 'react-icons/md'
import { Badge } from '@/components/ui'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface FinanceOfferBadgeProps {
  monthlyPayment: number
  term?: number
  className?: string
}

export function FinanceOfferBadge({ monthlyPayment, term = 60, className = '' }: FinanceOfferBadgeProps) {
  return (
    <Badge variant="primary" className={twMerge(clsx('flex items-center gap-1', className))}>
      <MdAttachMoney size={14} />
      SZL {Math.round(monthlyPayment).toLocaleString()}/mo for {term} months
    </Badge>
  )
}