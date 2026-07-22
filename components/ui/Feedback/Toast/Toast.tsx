'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ToastProps {
  children?: ReactNode
  className?: string
}

export function Toast({ children, className = '' }: ToastProps) {
  return (
    <div className={twMerge(clsx('w-full', className))}>
      {children || <span>Toast Component</span>}
    </div>
  )
}
