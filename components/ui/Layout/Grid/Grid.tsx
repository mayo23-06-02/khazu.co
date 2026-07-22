'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 12

interface GridProps {
  children: ReactNode
  className?: string
  cols?: ColCount
  sm?: ColCount
  md?: ColCount
  lg?: ColCount
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

// Default (no sm/md/lg override): mobile-first responsive step per cols value.
const defaultColsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
  12: 'grid-cols-1 sm:grid-cols-4 lg:grid-cols-12',
}
// Literal per-breakpoint class lookups (kept as full strings for Tailwind's static scan).
const baseColsClasses = {
  1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
  5: 'grid-cols-5', 6: 'grid-cols-6', 12: 'grid-cols-12',
}
const smColsClasses = {
  1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5', 6: 'sm:grid-cols-6', 12: 'sm:grid-cols-12',
}
const mdColsClasses = {
  1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4',
  5: 'md:grid-cols-5', 6: 'md:grid-cols-6', 12: 'md:grid-cols-12',
}
const lgColsClasses = {
  1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6', 12: 'lg:grid-cols-12',
}

export function Grid({ children, className = '', cols = 3, sm, md, lg, gap = 'md' }: GridProps) {
  const gapClasses = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }
  const hasBreakpointOverride = sm !== undefined || md !== undefined || lg !== undefined
  const colsClassName = hasBreakpointOverride
    ? clsx(
        baseColsClasses[cols],
        sm !== undefined && smColsClasses[sm],
        md !== undefined && mdColsClasses[md],
        lg !== undefined && lgColsClasses[lg],
      )
    : defaultColsClasses[cols]
  return (
    <div className={twMerge(clsx('grid', colsClassName, gapClasses[gap], className))}>
      {children}
    </div>
  )
}