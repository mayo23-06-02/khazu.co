'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface TableHeadProps {
  children: ReactNode
  className?: string
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return <thead className={twMerge(clsx('bg-dark/5 text-left', className))}>{children}</thead>
}