'use client'
import { useState } from 'react'
import { MdSend } from 'react-icons/md'
import { Textarea, Button } from '@/components/ui'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  className?: string
}

export function ChatInput({ onSend, placeholder = 'Type a message...', className = '' }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const handleSend = () => { if (message.trim()) { onSend(message.trim()); setMessage('') } }
  return (
    <div className={twMerge(clsx('flex gap-2', className))}>
      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={placeholder} className="flex-1 min-h-[44px]" />
      <Button variant="primary" size="sm" onClick={handleSend}><MdSend size={16} /></Button>
    </div>
  )
}