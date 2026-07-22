'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface FormGroupProps {
  children: ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
  spacing?: 'sm' | 'md' | 'lg'
}

export function FormGroup({ children, className = '', direction = 'vertical', spacing = 'md' }: FormGroupProps) {
  const spacings = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' }
  return <div className={twMerge(clsx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-start', spacings[spacing], className))}>{children}</div>
}