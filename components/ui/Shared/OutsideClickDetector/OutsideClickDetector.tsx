'use client'
import { ReactNode, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface OutsideClickDetectorProps {
  children: ReactNode
  onOutsideClick: () => void
  className?: string
}

export function OutsideClickDetector({ children, onOutsideClick, className = '' }: OutsideClickDetectorProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOutsideClick() }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onOutsideClick])
  return <div ref={ref} className={className}>{children}</div>
}