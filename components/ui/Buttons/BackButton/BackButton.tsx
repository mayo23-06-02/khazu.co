'use client'
import { useRouter } from 'next/navigation'
import { MdArrowBack } from 'react-icons/md'
import { Button } from '../Button/Button'

interface BackButtonProps {
  label?: string
  className?: string
}

export function BackButton({ label = 'Back', className = '' }: BackButtonProps) {
  const router = useRouter()
  return <Button variant="ghost" size="sm" onClick={() => router.back()} className={className}><MdArrowBack size={16} className="mr-1" />{label}</Button>
}