'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface StackProps {
  children: ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export function Stack({
  children,
  className = '',
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
}: StackProps) {
  const directionClasses = { vertical: 'flex-col', horizontal: 'flex-row' }
  const spacingClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
    '2xl': 'gap-8',
  }
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }
  return (
    <div className={twMerge(clsx('flex', directionClasses[direction], spacingClasses[spacing], alignClasses[align], className))}>
      {children}
    </div>
  )
}