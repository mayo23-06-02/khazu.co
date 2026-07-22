'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface CardHeaderProps {
  children?: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={twMerge(clsx('w-full', className))}>
      {children || <span>CardHeader Component</span>}
    </div>
  )
}
