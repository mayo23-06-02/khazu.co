'use client'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  color?: 'light' | 'medium' | 'heavy'
}

export function Divider({ className = '', orientation = 'horizontal', color = 'light' }: DividerProps) {
  const colorClasses = { light: 'bg-dark/5', medium: 'bg-dark/10', heavy: 'bg-dark/20' }
  return (
    <div className={twMerge(clsx(colorClasses[color], orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full', className))} />
  )
}