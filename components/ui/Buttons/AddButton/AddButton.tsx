'use client'
import { MdAdd } from 'react-icons/md'
import { Button } from '../Button/Button'

interface AddButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function AddButton({ onClick, label = 'Add', className = '' }: AddButtonProps) {
  return <Button variant="primary" size="sm" onClick={onClick} className={className}><MdAdd size={14} className="mr-1" />{label}</Button>
}