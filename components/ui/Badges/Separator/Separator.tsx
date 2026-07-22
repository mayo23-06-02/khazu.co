'use client'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface SeparatorProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: 'line' | 'dot' | 'dash'
}

export function Separator({ className = '', orientation = 'horizontal', variant = 'line' }: SeparatorProps) {
  const variantClasses = {
    line: orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
    dot: orientation === 'horizontal' ? 'w-1 h-1 rounded-full mx-2' : 'h-1 w-1 rounded-full my-2',
    dash: orientation === 'horizontal' ? 'h-px w-4' : 'w-px h-4',
  }
  return <div className={twMerge(clsx('bg-dark/10', variantClasses[variant], className))} />
}