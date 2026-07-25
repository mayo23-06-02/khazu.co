'use client'
import { ReactNode } from 'react'
import { MdClose } from 'react-icons/md'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface OffCanvasProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  position?: 'left' | 'right'
}

export function OffCanvas({ isOpen, onClose, children, className = '', position = 'right' }: OffCanvasProps) {
  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1a1a1a]/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className={twMerge(
          clsx(
            'fixed top-0 z-50 h-[100dvh] w-full max-w-[100vw] sm:max-w-md bg-white shadow-2xl overflow-y-auto',
            position === 'right' ? 'right-0' : 'left-0',
          ),
          className,
        )}
      >
        <div className="flex justify-end px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sticky top-0 bg-white z-10">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
        </div>
        <div className="px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </>
  )
}