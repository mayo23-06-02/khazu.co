'use client'
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md'
import { Button } from '@/components/ui'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface RowActionsProps {
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  className?: string
}

export function RowActions({ onEdit, onDelete, onView, className = '' }: RowActionsProps) {
  return (
    <div className={twMerge(clsx('flex gap-1', className))}>
      {onView && <Button variant="ghost" size="sm" onClick={onView} aria-label="View"><MdVisibility size={14} /></Button>}
      {onEdit && <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit"><MdEdit size={14} /></Button>}
      {onDelete && <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Delete"><MdDelete size={14} /></Button>}
    </div>
  )
}