'use client'
import { MdShare } from 'react-icons/md'
import { IconButton } from '../IconButton/IconButton'

interface ShareButtonProps {
  title?: string
  text?: string
  url?: string
  className?: string
}

export function ShareButton({ title, text, url = typeof window !== 'undefined' ? window.location.href : '', className = '' }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title, text, url })
    else navigator.clipboard.writeText(url)
  }
  return <IconButton variant="secondary" onClick={handleShare} className={className} aria-label="Share"><MdShare size={18} /></IconButton>
}