'use client'
import { ReactNode } from 'react'
import { Checkbox } from '@/components/ui'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface Option {
  value: string
  label: ReactNode
}

interface CheckboxGroupProps {
  options: Option[]
  values: string[]
  onChange: (values: string[]) => void
  className?: string
}

export function CheckboxGroup({ options, values, onChange, className = '' }: CheckboxGroupProps) {
  const toggle = (value: string) => {
    if (values.includes(value)) onChange(values.filter(v => v !== value))
    else onChange([...values, value])
  }
  return <div className={twMerge(clsx('flex flex-col gap-1', className))}>{options.map(opt => <Checkbox key={opt.value} label={opt.label as string} checked={values.includes(opt.value)} onChange={() => toggle(opt.value)} />)}</div>
}