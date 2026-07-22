'use client'
import { MdChat } from 'react-icons/md'
import { Button } from '@/components/ui'

interface WhatsAppButtonProps {
  phone: string
  message?: string
  className?: string
}

export function WhatsAppButton({ phone, message = 'Hello, I am interested in your car.', className = '' }: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  return (
    <Button variant="primary" size="md" onClick={() => window.open(url, '_blank')} className={className}>
      <MdChat size={20} className="mr-2" /> WhatsApp
    </Button>
  )
}