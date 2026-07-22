'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface VisuallyHiddenProps {
  children: ReactNode
  className?: string
}

export function VisuallyHidden({ children, className = '' }: VisuallyHiddenProps) {
  return <span className={twMerge(clsx('absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0', className))}>{children}</span>
}