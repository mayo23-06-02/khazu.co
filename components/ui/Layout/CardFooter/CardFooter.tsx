'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface CardFooterProps {
  children?: ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={twMerge(clsx('w-full', className))}>
      {children || <span>CardFooter Component</span>}
    </div>
  )
}
