'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ToastContainerProps {
  children: ReactNode
  className?: string
}

export function ToastContainer({ children, className = '' }: ToastContainerProps) {
  return <div className={twMerge(clsx('fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full', className))}>{children}</div>
}