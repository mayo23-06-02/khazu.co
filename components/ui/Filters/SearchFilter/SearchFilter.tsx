'use client'
import { MdSearch } from 'react-icons/md'
import { InputText } from '@/components/ui'

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchFilter({ value, onChange, placeholder = 'Search...', className = '' }: SearchFilterProps) {
  return <InputText value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} icon={<MdSearch size={16} />} className={className} />
}