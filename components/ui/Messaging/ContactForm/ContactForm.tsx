'use client'
import { useState } from 'react'
import { InputText, Textarea, Button } from '@/components/ui'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; phone: string; message: string }) => void
  className?: string
}

export function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  return (
    <div className={twMerge(clsx('space-y-3', className))}>
      <InputText label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
      <InputText label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
      <InputText label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
      <Textarea label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} fullWidth />
      <Button variant="primary" size="lg" fullWidth onClick={() => onSubmit(form)}>Send Message</Button>
    </div>
  )
}