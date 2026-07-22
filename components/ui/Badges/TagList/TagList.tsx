'use client'
import { Badge } from '../Badge/Badge'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface TagListProps {
  tags: string[]
  className?: string
}

export function TagList({ tags, className = '' }: TagListProps) {
  return <div className={twMerge(clsx('flex flex-wrap gap-1', className))}>{tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>
}