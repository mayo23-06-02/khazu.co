'use client'
import { ToggleSwitch } from '@/components/ui'

interface UserStatusToggleProps {
  isActive: boolean
  onToggle: (active: boolean) => void
  label?: string
}

export function UserStatusToggle({ isActive, onToggle, label = 'Active' }: UserStatusToggleProps) {
  return <ToggleSwitch label={label} checked={isActive} onChange={(e) => onToggle(e.target.checked)} />
}