'use client'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={twMerge(clsx('animate-pulse bg-dark/10 rounded-lg', className))} />
}