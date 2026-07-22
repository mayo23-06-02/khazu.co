'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ButtonGroupProps {
  children: ReactNode
  className?: string
  direction?: 'row' | 'column'
}

export function ButtonGroup({ children, className = '', direction = 'row' }: ButtonGroupProps) {
  return <div className={twMerge(clsx('flex', direction === 'row' ? 'flex-row' : 'flex-col', className))}>{children}</div>
}