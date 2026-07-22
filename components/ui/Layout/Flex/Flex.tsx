'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface FlexProps {
  children: ReactNode
  className?: string
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  wrap?: boolean
}

export function Flex({
  children,
  className = '',
  direction = 'row',
  justify = 'start',
  items = 'stretch',
  gap = 'md',
  wrap = false,
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  }
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }
  const itemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }
  const gapClasses = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' }
  return (
    <div className={twMerge(clsx('flex', directionClasses[direction], justifyClasses[justify], itemsClasses[items], gapClasses[gap], wrap && 'flex-wrap', className))}>
      {children}
    </div>
  )
}