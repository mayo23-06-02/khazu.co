'use client'
import { useState } from 'react'
import { MdContentCopy, MdCheck } from 'react-icons/md'
import { IconButton } from '../IconButton/IconButton'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return <IconButton variant="secondary" onClick={handleCopy} className={className} aria-label="Copy to clipboard">{copied ? <MdCheck size={18} /> : <MdContentCopy size={18} />}</IconButton>
}