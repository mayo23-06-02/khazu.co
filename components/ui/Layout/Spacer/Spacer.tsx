'use client'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface SpacerProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function Spacer({ className = '', size = 'md' }: SpacerProps) {
  const sizes = { xs: 'h-2', sm: 'h-4', md: 'h-6', lg: 'h-8', xl: 'h-10', '2xl': 'h-12' }
  return <div className={twMerge(clsx('w-full', sizes[size], className))} />
}