'use client'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface IconProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Icon({ children, size = 'md', className = '' }: IconProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6', xl: 'w-8 h-8' }
  return <span className={twMerge(clsx('inline-flex items-center justify-center', sizes[size], className))}>{children}</span>
}