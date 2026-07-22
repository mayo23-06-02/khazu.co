'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface GridProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

export function Grid({ children, className = '', cols = 3, gap = 'md' }: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
    12: 'grid-cols-1 sm:grid-cols-4 lg:grid-cols-12',
  }
  const gapClasses = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }
  return (
    <div className={twMerge(clsx('grid', colsClasses[cols], gapClasses[gap], className))}>
      {children}
    </div>
  )
}