'use client'
import { ReactNode, useState } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }
  return (
    <div className={twMerge(clsx('relative inline-block', className))} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className={twMerge(clsx('absolute z-50 px-2 py-1 text-xs font-medium text-white bg-dark rounded shadow-lg whitespace-nowrap', positionClasses[position]))}>
          {content}
          <div className="absolute w-2 h-2 bg-dark rotate-45" style={{ top: position === 'top' ? '100%' : undefined, bottom: position === 'bottom' ? '100%' : undefined, left: position === 'left' ? '100%' : undefined, right: position === 'right' ? '100%' : undefined }} />
        </div>
      )}
    </div>
  )
}