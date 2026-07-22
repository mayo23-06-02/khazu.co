'use client'
import { ReactNode, useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  position?: 'left' | 'right'
}

export function MobileDrawer({ isOpen, onClose, children, className = '', position = 'left' }: MobileDrawerProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    return () => { if (typeof document !== 'undefined') document.body.style.overflow = '' }
  }, [isOpen])
  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-40 bg-dark/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className={twMerge(clsx('fixed top-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-300', position === 'left' ? 'left-0' : 'right-0', isOpen ? 'translate-x-0' : '-translate-x-full', className))}>
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark/5 transition-colors" aria-label="Close drawer"><MdClose size={20} /></button>
        </div>
        <div className="px-4 pb-4">{children}</div>
      </div>
    </>
  )
}