'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { MdPhone } from 'react-icons/md'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { InputText } from '../InputText/InputText'

interface InputPhoneProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  countryCode?: string
}

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(({ label, error, countryCode = '+268', className = '', ...props }, ref) => (
  <div className={twMerge(clsx('flex gap-2 items-end', className))}>
    <div className="shrink-0"><InputText value={countryCode} readOnly className="w-20 text-center" /></div>
    <InputText ref={ref} type="tel" label={label} error={error} icon={<MdPhone />} {...props} />
  </div>
))
InputPhone.displayName = 'InputPhone'