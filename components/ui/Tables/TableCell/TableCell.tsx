'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface TableCellProps {
  children: ReactNode
  className?: string
  as?: 'td' | 'th'
}

export function TableCell({ children, className = '', as = 'td' }: TableCellProps) {
  const Component = as
  return <Component className={twMerge(clsx('px-4 py-3', className))}>{children}</Component>
}