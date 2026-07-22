'use client'
import { MdClose } from 'react-icons/md'
import { Badge } from '@/components/ui'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ActiveFilterChipsProps {
  filters: Record<string, string>
  onRemove: (key: string) => void
  className?: string
}

export function ActiveFilterChips({ filters, onRemove, className = '' }: ActiveFilterChipsProps) {
  return (
    <div className={twMerge(clsx('flex flex-wrap gap-1', className))}>
      {Object.entries(filters).map(([key, value]) => (
        <Badge key={key} variant="secondary" className="flex items-center gap-1">
          ${key}: ${value}
          <button onClick={() => onRemove(key)} className="hover:text-danger transition-colors"><MdClose size={10} /></button>
        </Badge>
      ))}
    </div>
  )
}