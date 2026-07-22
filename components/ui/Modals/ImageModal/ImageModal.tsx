'use client'
import { Modal } from '../Modal/Modal'
import { Button } from '@/components/ui'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt?: string
  onNext?: () => void
  onPrev?: () => void
}

export function ImageModal({ isOpen, onClose, src, alt = '', onNext, onPrev }: ImageModalProps) {
  const footer = (
    <div className="flex justify-center gap-2">
      {onPrev && <Button variant="secondary" size="sm" onClick={onPrev}><MdChevronLeft size={16} /></Button>}
      {onNext && <Button variant="secondary" size="sm" onClick={onNext}><MdChevronRight size={16} /></Button>}
    </div>
  )
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" footer={footer}>
      <div className="flex items-center justify-center">
        <img src={src} alt={alt} className="max-w-full max-h-[60vh] object-contain" />
      </div>
    </Modal>
  )
}