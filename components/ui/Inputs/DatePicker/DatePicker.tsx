'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { MdCalendarToday } from 'react-icons/md'
import { InputText } from '../InputText/InputText'

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({ label, error, className = '', ...props }, ref) => (
  <InputText ref={ref} type="date" label={label} error={error} icon={<MdCalendarToday size={16} />} className={className} {...props} />
))
DatePicker.displayName = 'DatePicker'