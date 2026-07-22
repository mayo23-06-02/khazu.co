'use client'
import { Button } from '../Button/Button'

interface LoadMoreButtonProps {
  onClick: () => void
  loading?: boolean
  label?: string
  className?: string
}

export function LoadMoreButton({ onClick, loading = false, label = 'Load More', className = '' }: LoadMoreButtonProps) {
  return <Button variant="outline" size="lg" fullWidth onClick={onClick} loading={loading} className={className}>{label}</Button>
}