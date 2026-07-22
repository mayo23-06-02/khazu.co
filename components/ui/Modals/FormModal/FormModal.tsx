'use client'
import { ReactNode } from 'react'
import { Modal } from '../Modal/Modal'
import { Button } from '@/components/ui'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit: () => void
  submitLabel?: string
  loading?: boolean
}

export function FormModal({ isOpen, onClose, title, children, onSubmit, submitLabel = 'Submit', loading = false }: FormModalProps) {
  const footer = (
    <div className="flex gap-2 justify-end">
      <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
      <Button variant="primary" size="sm" onClick={onSubmit} loading={loading}>{submitLabel}</Button>
    </div>
  )
  return <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>{children}</Modal>
}