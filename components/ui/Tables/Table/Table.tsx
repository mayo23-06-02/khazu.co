'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return <div className={twMerge(clsx('w-full overflow-x-auto', className))}><table className="w-full text-sm">{children}</table></div>
}