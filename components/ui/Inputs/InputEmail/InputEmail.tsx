'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { MdEmail } from 'react-icons/md'
import { InputText } from '../InputText/InputText'

interface InputEmailProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputEmail = forwardRef<HTMLInputElement, InputEmailProps>(({ label, error, className = '', ...props }, ref) => (
  <InputText ref={ref} type="email" label={label} error={error} icon={<MdEmail size={16} />} className={className} {...props} />
))
InputEmail.displayName = 'InputEmail'