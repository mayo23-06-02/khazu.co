'use client'
import { Pagination } from '@/components/ui'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function PaginationControls({ currentPage, totalPages, onPageChange, className = '' }: PaginationControlsProps) {
  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className={className} />
}