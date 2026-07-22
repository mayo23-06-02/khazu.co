'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { InputText } from '../InputText/InputText'

interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  min?: number
  max?: number
  step?: number
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(({ label, error, min, max, step = 1, className = '', ...props }, ref) => (
  <InputText ref={ref} type="number" label={label} error={error} className={className} min={min} max={max} step={step} {...props} />
))
InputNumber.displayName = 'InputNumber'