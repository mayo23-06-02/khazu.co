'use client'
import { MessageCard } from '@/components/ui'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface InboxListProps {
  messages: Array<{
    id: string
    sender: string
    preview: string
    timestamp: string
    unread?: boolean
  }>
  onMessageClick: (id: string) => void
  className?: string
}

export function InboxList({ messages, onMessageClick, className = '' }: InboxListProps) {
  return <div className={twMerge(clsx('space-y-2', className))}>{messages.map(msg => <MessageCard key={msg.id} sender={msg.sender} preview={msg.preview} timestamp={msg.timestamp} unread={msg.unread} onClick={() => onMessageClick(msg.id)} />)}</div>
}