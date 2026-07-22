'use client'
import { Button } from '../Button/Button'

interface DeleteButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function DeleteButton({ onClick, label = 'Delete', className = '' }: DeleteButtonProps) {
  return <Button variant="danger" size="sm" onClick={onClick} className={className}>{label}</Button>
}