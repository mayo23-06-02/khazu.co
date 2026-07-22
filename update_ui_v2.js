const fs = require('fs');
const path = require('path');

const baseDir = 'components/ui';

const components = {
    // Navigation
    'Navigation/Navbar/Navbar.tsx': `'use client'
import { ReactNode, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Container } from '@/components/ui/Layout/Container/Container'

interface NavbarProps {
  logo: ReactNode
  links?: Array<{ label: string; href: string }>
  actions?: ReactNode
  className?: string
  sticky?: boolean
}

export function Navbar({ logo, links = [], actions, className = '', sticky = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className={twMerge(clsx('bg-white border-b border-black/5', sticky && 'sticky top-0 z-40', className))}>
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6">
            {logo}
            <div className="hidden md:flex items-center gap-6">
              {links.map(link => <a key={link.href} href={link.href} className="text-gray-800/70 hover:text-gray-800 transition-colors text-sm font-medium">{link.label}</a>)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">{actions}</div>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-dark/5 transition-colors" aria-label="Toggle menu">
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden py-4 border-t border-black/5 flex flex-col gap-3">
            {links.map(link => <a key={link.href} href={link.href} className="text-gray-800/70 hover:text-gray-800 transition-colors text-sm font-medium">{link.label}</a>)}
            <div className="pt-2">{actions}</div>
          </div>
        )}
      </Container>
    </nav>
  )
}`,
    'Navigation/NavLink/NavLink.tsx': `'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  active?: boolean
}

export function NavLink({ href, children, className = '', active = false }: NavLinkProps) {
  return (
    <Link href={href} className={twMerge(clsx('inline-flex items-center gap-1.5 text-sm font-medium transition-colors rounded-lg px-3 py-2', active ? 'bg[#CD2C58]/10 text[#CD2C58]' : 'text-gray-800/70 hover:text-gray-800 hover:bg-dark/5', className))} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  )
}`,
    'Navigation/Breadcrumb/Breadcrumb.tsx': `'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface BreadcrumbItem {
  label: ReactNode
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: ReactNode
}

export function Breadcrumb({ items, className = '', separator = <FaChevronRight className="text-gray-800/20 text-xs" /> }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={twMerge(clsx('flex items-center gap-1 text-sm', className))}>
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-gray-800/50 hover:text-gray-800 transition-colors">{item.label}</Link>
              ) : (
                <span className={isLast ? 'text-gray-800 font-medium' : 'text-gray-800/50'}>{item.label}</span>
              )}
              {!isLast && separator}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}`,
    'Navigation/Pagination/Pagination.tsx': `'use client'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Button } from '@/components/ui/Buttons/Button/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showNumbers?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '', showNumbers = true }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)
    if (end - start < maxVisible - 1) {
      if (start === 1) end = Math.min(totalPages, start + maxVisible - 1)
      else if (end === totalPages) start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }
  if (totalPages <= 1) return null
  return (
    <div className={twMerge(clsx('flex items-center gap-1 sm:gap-2 flex-wrap', className))}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex items-center justify-center rounded-lg font-medium transition-colors border border-black/20 px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark/5">
        <FaChevronLeft size={14} />
        <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
      </button>
      {showNumbers && getPageNumbers().map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={twMerge(clsx('inline-flex items-center justify-center rounded-lg font-medium transition-colors px-3 py-1.5 text-sm', page === currentPage ? 'bg[#CD2C58] text-gray-800' : 'border border-black/20 hover:bg-dark/5'))} aria-current={page === currentPage ? 'page' : undefined}>
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="inline-flex items-center justify-center rounded-lg font-medium transition-colors border border-black/20 px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark/5">
        <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
        <FaChevronRight size={14} />
      </button>
    </div>
  )
}`,
    'Navigation/Tabs/Tabs.tsx': `'use client'
import { ReactNode, useState } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface TabItem {
  id: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
  variant?: 'underline' | 'pills' | 'full'
}

export function Tabs({ tabs, defaultTab, onChange, className = '', variant = 'underline' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const handleChange = (tabId: string) => { setActiveTab(tabId); onChange?.(tabId) }

  const variantClasses = {
    underline: {
      list: 'border-b border-black/5 gap-1',
      item: (isActive: boolean, disabled: boolean) => clsx('px-4 py-2.5 text-sm font-medium transition-colors border-b-2', isActive ? 'border[#CD2C58] text-gray-800' : 'border-transparent text-gray-800/50 hover:text-gray-800 hover:border-black/10', disabled && 'opacity-50 cursor-not-allowed'),
    },
    pills: {
      list: 'gap-1',
      item: (isActive: boolean, disabled: boolean) => clsx('px-4 py-2 text-sm font-medium transition-colors rounded-lg', isActive ? 'bg[#CD2C58] text-gray-800' : 'text-gray-800/60 hover:bg-dark/5 hover:text-gray-800', disabled && 'opacity-50 cursor-not-allowed'),
    },
    full: {
      list: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1',
      item: (isActive: boolean, disabled: boolean) => clsx('px-4 py-2.5 text-sm font-medium transition-colors rounded-lg text-center', isActive ? 'bg[#CD2C58] text-gray-800' : 'bg-dark/5 text-gray-800/60 hover:bg-dark/10 hover:text-gray-800', disabled && 'opacity-50 cursor-not-allowed'),
    },
  }

  return (
    <div className={twMerge(clsx('w-full', className))}>
      <div className={twMerge(clsx('flex flex-wrap', variantClasses[variant].list))} role="tablist">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => !tab.disabled && handleChange(tab.id)} className={variantClasses[variant].item(activeTab === tab.id, !!tab.disabled)} role="tab" aria-selected={activeTab === tab.id} aria-disabled={tab.disabled} disabled={tab.disabled}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs.find(t => t.id === activeTab)?.content}</div>
    </div>
  )
}`,
    'Navigation/Sidebar/Sidebar.tsx': `'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface SidebarProps {
  children: ReactNode
  className?: string
  width?: 'sm' | 'md' | 'lg'
  position?: 'left' | 'right'
}

export function Sidebar({ children, className = '', width = 'md', position = 'left' }: SidebarProps) {
  const widths = { sm: 'w-48', md: 'w-64', lg: 'w-80' }
  return (
    <aside className={twMerge(clsx('hidden lg:block shrink-0 h-full overflow-y-auto', widths[width], position === 'left' ? 'border-r border-black/5 pr-4' : 'border-l border-black/5 pl-4', className))}>
      {children}
    </aside>
  )
}`,
    'Navigation/MobileDrawer/MobileDrawer.tsx': `'use client'
import { ReactNode, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  position?: 'left' | 'right'
}

export function MobileDrawer({ isOpen, onClose, children, className = '', position = 'left' }: MobileDrawerProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    return () => { if (typeof document !== 'undefined') document.body.style.overflow = '' }
  }, [isOpen])
  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-40 bg-dark/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className={twMerge(clsx('fixed top-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-300', position === 'left' ? 'left-0' : 'right-0', isOpen ? 'translate-x-0' : '-translate-x-full', className))}>
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark/5 transition-colors" aria-label="Close drawer"><FaTimes size={20} /></button>
        </div>
        <div className="px-4 pb-4">{children}</div>
      </div>
    </>
  )
}`,
    'Navigation/DropdownMenu/DropdownMenu.tsx': `'use client'
import { ReactNode, useRef, useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface DropdownItem {
  label: ReactNode
  onClick?: () => void
  href?: string
  icon?: ReactNode
  disabled?: boolean
  variant?: 'default' | 'danger'
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownItem[]
  className?: string
  align?: 'left' | 'right' | 'center'
}

export function DropdownMenu({ trigger, items, className = '', align = 'left' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const alignClasses = { left: 'left-0', right: 'right-0', center: 'left-1/2 -translate-x-1/2' }
  return (
    <div className={twMerge(clsx('relative inline-block', className))} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>
      {isOpen && (
        <div className={twMerge(clsx('absolute top-full mt-1 min-w-[160px] bg-white rounded-lg shadow-xl border border-black/5 py-1 z-50', alignClasses[align]))}>
          {items.map((item, index) => {
            const content = <>{item.icon && <span className="mr-2">{item.icon}</span>}{item.label}</>
            return item.href ? (
              <a key={index} href={item.href} onClick={() => setIsOpen(false)} className={twMerge(clsx('block px-4 py-2 text-sm transition-colors', item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark/5 text-gray-800', item.variant === 'danger' && 'text-danger hover:bg-danger/5'))}>{content}</a>
            ) : (
              <button key={index} onClick={() => { item.onClick?.(); setIsOpen(false) }} disabled={item.disabled} className={twMerge(clsx('w-full text-left px-4 py-2 text-sm transition-colors', item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark/5 text-gray-800', item.variant === 'danger' && 'text-danger hover:bg-danger/5'))}>{content}</button>
            )
          })}
        </div>
      )}
    </div>
  )
}`,
    'Navigation/Accordion/Accordion.tsx': `'use client'
import { ReactNode, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  defaultOpen?: string[]
  multiple?: boolean
  className?: string
}

export function Accordion({ items, defaultOpen = [], multiple = false, className = '' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)
  const toggle = (id: string) => {
    if (multiple) setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    else setOpenItems(prev => prev.includes(id) ? [] : [id])
  }
  return (
    <div className={twMerge(clsx('divide-y divide-dark/5', className))}>
      {items.map(item => {
        const isOpen = openItems.includes(item.id)
        return (
          <div key={item.id} className="py-2">
            <button onClick={() => !item.disabled && toggle(item.id)} disabled={item.disabled} className={twMerge(clsx('w-full flex items-center justify-between p-3 text-left transition-colors', item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark/5'))}>
              <span className="font-medium">{item.title}</span>
              {isOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            </button>
            {isOpen && <div className="p-3 pt-1 text-gray-800/60">{item.content}</div>}
          </div>
        )
      })}
    </div>
  )
}`,
    'Navigation/Stepper/Stepper.tsx': `'use client'
import { ReactNode } from 'react'
import { FaCheck } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface Step {
  id: string
  label: ReactNode
  status?: 'pending' | 'active' | 'completed' | 'error'
}

interface StepperProps {
  steps: Step[]
  currentStep?: string
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Stepper({ steps, currentStep, className = '', orientation = 'horizontal' }: StepperProps) {
  const getStatus = (step: Step) => {
    if (step.status) return step.status
    if (!currentStep) return 'pending'
    const idx = steps.findIndex(s => s.id === step.id)
    const cur = steps.findIndex(s => s.id === currentStep)
    if (idx < cur) return 'completed'
    if (idx === cur) return 'active'
    return 'pending'
  }
  return (
    <div className={twMerge(clsx('flex', orientation === 'horizontal' ? 'flex-row items-center overflow-x-auto' : 'flex-col gap-2', className))}>
      {steps.map((step, index) => {
        const status = getStatus(step)
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className={twMerge(clsx('flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors', status === 'completed' && 'bg[#CD2C58] text-gray-800', status === 'active' && 'bg[#CD2C58]/20 text[#CD2C58] border-2 border[#CD2C58]', status === 'error' && 'bg-danger text-white', status === 'pending' && 'bg-dark/10 text-gray-800/40'))}>
              {status === 'completed' ? <FaCheck size={14} /> : index + 1}
            </div>
            <span className={twMerge(clsx('text-sm', status === 'active' && 'font-medium text-gray-800', status === 'completed' && 'text-gray-800/70', status === 'pending' && 'text-gray-800/40'))}>{step.label}</span>
            {orientation === 'horizontal' && index < steps.length - 1 && (
              <div className={twMerge(clsx('h-px w-8', status === 'completed' || getStatus(steps[index + 1]) === 'completed' ? 'bg[#CD2C58]' : 'bg-dark/10'))} />
            )}
          </div>
        )
      })}
    </div>
  )
}`,
    // Inputs
    'Inputs/InputText/InputText.tsx': `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({ label, error, icon, fullWidth = false, className = '', ...props }, ref) => (
  <div className={twMerge(clsx('flex flex-col gap-1', fullWidth && 'w-full'))}>
    {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800/40">{icon}</div>}
      <input ref={ref} className={twMerge(clsx('w-full rounded-lg border bg-white px-4 py-2.5 text-gray-800 placeholder:text-gray-800/40 transition-colors focus:outline-none focus:ring-2', icon ? 'pl-10' : 'pl-4', error ? 'border-danger focus:ring-danger/30' : 'border-black/20 focus:border[#CD2C58] focus:ring[#CD2C58]/30', className))} {...props} />
    </div>
    {error && <p className="text-sm text-danger" role="alert">{error}</p>}
  </div>
))
InputText.displayName = 'InputText'`,
    'Inputs/InputNumber/InputNumber.tsx': `'use client'
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
InputNumber.displayName = 'InputNumber'`,
    'Inputs/InputEmail/InputEmail.tsx': `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { FaEnvelope } from 'react-icons/fa'
import { InputText } from '../InputText/InputText'

interface InputEmailProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputEmail = forwardRef<HTMLInputElement, InputEmailProps>(({ label, error, className = '', ...props }, ref) => (
  <InputText ref={ref} type="email" label={label} error={error} icon={<FaEnvelope size={16} />} className={className} {...props} />
))
InputEmail.displayName = 'InputEmail'`,
    'Inputs/InputPassword/InputPassword.tsx': `'use client'
import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { InputText } from '../InputText/InputText'

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(({ label, error, className = '', ...props }, ref) => {
  const [show, setShow] = useState(false)
  return (
    <div className={twMerge(clsx('relative', className))}>
      <InputText ref={ref} type={show ? 'text' : 'password'} label={label} error={error} className="pr-10" {...props} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-[38px] text-gray-800/40 hover:text-gray-800 transition-colors" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  )
})
InputPassword.displayName = 'InputPassword'`,
    'Inputs/Textarea/Textarea.tsx': `'use client'
import { forwardRef, TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, fullWidth = false, className = '', ...props }, ref) => (
  <div className={twMerge(clsx('flex flex-col gap-1', fullWidth && 'w-full'))}>
    {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
    <textarea ref={ref} className={twMerge(clsx('w-full rounded-lg border bg-white px-4 py-2.5 text-gray-800 placeholder:text-gray-800/40 transition-colors focus:outline-none focus:ring-2', error ? 'border-danger focus:ring-danger/30' : 'border-black/20 focus:border[#CD2C58] focus:ring[#CD2C58]/30', className))} {...props} />
    {error && <p className="text-sm text-danger" role="alert">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'`,
    'Inputs/Select/Select.tsx': `'use client'
import { forwardRef, SelectHTMLAttributes } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, fullWidth = false, className = '', ...props }, ref) => (
  <div className={twMerge(clsx('flex flex-col gap-1', fullWidth && 'w-full'))}>
    {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
    <div className="relative">
      <select ref={ref} className={twMerge(clsx('w-full appearance-none rounded-lg border bg-white px-4 py-2.5 pr-10 text-gray-800 transition-colors focus:outline-none focus:ring-2', error ? 'border-danger focus:ring-danger/30' : 'border-black/20 focus:border[#CD2C58] focus:ring[#CD2C58]/30', className))} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800/40 pointer-events-none"><FaChevronDown size={14} /></div>
    </div>
    {error && <p className="text-sm text-danger" role="alert">{error}</p>}
  </div>
))
Select.displayName = 'Select'`,
    'Inputs/Checkbox/Checkbox.tsx': `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { FaCheck } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div className="relative">
        <input ref={ref} type="checkbox" className={twMerge(clsx('peer h-5 w-5 rounded border-black/30 text[#CD2C58] focus:ring-2 focus:ring[#CD2C58]/30 transition-colors', className))} {...props} />
        <FaCheck size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
      </div>
      {label && <span className="text-sm text-gray-800/80">{label}</span>}
    </label>
    {error && <p className="text-sm text-danger" role="alert">{error}</p>}
  </div>
))
Checkbox.displayName = 'Checkbox'`,
    'Inputs/RadioGroup/RadioGroup.tsx': `'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface RadioOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  className?: string
  direction?: 'row' | 'column'
}

export function RadioGroup({ name, options, value, onChange, label, error, className = '', direction = 'column' }: RadioGroupProps) {
  return (
    <div className={twMerge(clsx('flex flex-col gap-1', className))}>
      {label && <span className="text-sm font-medium text-gray-800">{label}</span>}
      <div className={twMerge(clsx('flex', direction === 'row' ? 'flex-row gap-4' : 'flex-col gap-2'))}>
        {options.map(opt => (
          <label key={opt.value} className={twMerge(clsx('flex items-center gap-2 cursor-pointer', opt.disabled && 'opacity-50 cursor-not-allowed'))}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => !opt.disabled && onChange?.(opt.value)} disabled={opt.disabled} className="h-4 w-4 text[#CD2C58] focus:ring-2 focus:ring[#CD2C58]/30 border-black/30" />
            <span className="text-sm text-gray-800/80">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  )
}`,
    'Inputs/ToggleSwitch/ToggleSwitch.tsx': `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(({ label, className = '', ...props }, ref) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className="relative">
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <div className={twMerge(clsx('h-6 w-11 rounded-full bg-dark/20 transition-colors peer-checked:bg[#CD2C58] peer-focus:ring-2 peer-focus:ring[#CD2C58]/30', className))}>
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </div>
    </div>
    {label && <span className="text-sm text-gray-800/80">{label}</span>}
  </label>
))
ToggleSwitch.displayName = 'ToggleSwitch'`,
    'Inputs/Slider/Slider.tsx': `'use client'
import { useState } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface SliderProps {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  label?: string
  className?: string
}

export function Slider({ min = 0, max = 100, step = 1, value: controlledValue, defaultValue = 0, onChange, label, className = '' }: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = controlledValue ?? internalValue
  const percentage = ((value - min) / (max - min)) * 100
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = parseFloat(e.target.value); setInternalValue(v); onChange?.(v) }
  return (
    <div className={twMerge(clsx('flex flex-col gap-1', className))}>
      {label && <div className="flex justify-between"><span className="text-sm font-medium text-gray-800">{label}</span><span className="text-sm text-gray-800/60">{value}</span></div>}
      <div className="relative h-6 flex items-center">
        <div className="absolute h-1.5 w-full bg-dark/10 rounded-full" />
        <div className="absolute h-1.5 bg[#CD2C58] rounded-full transition-all" style={{ width: \`\${percentage}%\` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={handleChange} className="absolute w-full h-6 opacity-0 cursor-pointer" />
        <div className="absolute h-4 w-4 bg-white border-2 border[#CD2C58] rounded-full shadow-sm pointer-events-none" style={{ left: \`\${percentage}%\`, transform: 'translateX(-50%)' }} />
      </div>
    </div>
  )
}`,
    'Inputs/FileUpload/FileUpload.tsx': `'use client'
import { useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  label?: string
  className?: string
  error?: string
}

export function FileUpload({ onFilesChange, accept = '*/*', multiple = false, maxSize = 10 * 1024 * 1024, label = 'Upload files', className = '', error }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const valid = Array.from(newFiles).filter(f => f.size <= maxSize)
    const updated = multiple ? [...files, ...valid] : valid.slice(0, 1)
    setFiles(updated)
    onFilesChange?.(updated)
  }
  const removeFile = (index: number) => { const updated = files.filter((_, i) => i !== index); setFiles(updated); onFilesChange?.(updated) }
  return (
    <div className={twMerge(clsx('flex flex-col gap-1', className))}>
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }} onClick={() => inputRef.current?.click()} className={twMerge(clsx('border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors', isDragging ? 'border[#CD2C58] bg[#CD2C58]/5' : 'border-black/20 hover:border-black/40', error && 'border-danger bg-danger/5'))}>
        <div className="flex flex-col items-center gap-2">
          <FaCloudUploadAlt size={32} className="text-gray-800/40" />
          <div className="text-sm text-gray-800/60"><span className="font-medium text-gray-800">{label}</span><span className="block text-xs mt-1">Drag & drop or click to browse</span></div>
        </div>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-dark/5 rounded px-2 py-1 text-sm">
              <span className="truncate">{file.name}</span>
              <button onClick={(e) => { e.stopPropagation(); removeFile(index) }} className="text-gray-800/40 hover:text-danger transition-colors" aria-label="Remove file"><FaTimes size={14} /></button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  )
}`,
    'Inputs/ImageUpload/ImageUpload.tsx': `'use client'
import { useRef, useState } from 'react'
import { FaImage, FaTimes } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ImageUploadProps {
  onImagesChange?: (files: File[]) => void
  maxCount?: number
  maxSize?: number
  label?: string
  className?: string
  error?: string
  preview?: boolean
}

export function ImageUpload({ onImagesChange, maxCount = 10, maxSize = 5 * 1024 * 1024, label = 'Upload images', className = '', error, preview = true }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const valid = Array.from(newFiles).filter(f => f.size <= maxSize).slice(0, maxCount - files.length)
    const newPreviews = valid.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])
    setFiles(prev => [...prev, ...valid])
    onImagesChange?.([...files, ...valid])
  }
  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
    onImagesChange?.(files.filter((_, i) => i !== index))
  }
  return (
    <div className={twMerge(clsx('flex flex-col gap-1', className))}>
      <div onClick={() => inputRef.current?.click()} className={twMerge(clsx('border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors', error ? 'border-danger bg-danger/5' : 'border-black/20 hover:border-black/40'))}>
        <div className="flex flex-col items-center gap-1">
          <FaImage size={24} className="text-gray-800/40" />
          <span className="text-sm text-gray-800/60">{label}</span>
          <span className="text-xs text-gray-800/40">{files.length} / {maxCount} images</span>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {preview && previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
          {previews.map((src, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-dark/10">
              <img src={src} alt={\`Upload \${index + 1}\`} className="w-full h-full object-cover" />
              <button onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 hover:bg-white transition-colors" aria-label="Remove image"><FaTimes size={12} /></button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  )
}`,
    'Inputs/DatePicker/DatePicker.tsx': `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import { InputText } from '../InputText/InputText'

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({ label, error, className = '', ...props }, ref) => (
  <InputText ref={ref} type="date" label={label} error={error} icon={<FaCalendarAlt size={16} />} className={className} {...props} />
))
DatePicker.displayName = 'DatePicker'`,
    'Inputs/SearchBar/SearchBar.tsx': `'use client'
import { forwardRef, InputHTMLAttributes, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { InputText } from '../InputText/InputText'

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  debounce?: number
  label?: string
  error?: string
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ onSearch, debounce = 300, label, error, className = '', ...props }, ref) => {
  const [value, setValue] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => onSearch?.(value), debounce)
    return () => clearTimeout(timer)
  }, [value, debounce, onSearch])
  return <InputText ref={ref} label={label} error={error} icon={<FaSearch size={16} />} value={value} onChange={(e) => setValue(e.target.value)} className={className} {...props} />
})
SearchBar.displayName = 'SearchBar'`,
    'Inputs/Autocomplete/Autocomplete.tsx': `'use client'
import { useState, useEffect, useRef } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { InputText } from '../InputText/InputText'

interface AutocompleteProps {
  options: string[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  className?: string
}

export function Autocomplete({ options, value, onChange, label, error, placeholder, className = '' }: AutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => { setFiltered(options.filter(opt => opt.toLowerCase().includes(inputValue.toLowerCase()))) }, [inputValue, options])
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const handleSelect = (option: string) => { setInputValue(option); setIsOpen(false); onChange?.(option) }
  return (
    <div className={twMerge(clsx('relative', className))} ref={containerRef}>
      <InputText label={label} error={error} placeholder={placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onFocus={() => setIsOpen(true)} icon={<FaChevronDown size={14} />} />
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-black/5 max-h-60 overflow-y-auto z-50">
          {filtered.map(opt => <button key={opt} onClick={() => handleSelect(opt)} className="w-full text-left px-4 py-2 text-sm hover:bg-dark/5 transition-colors">{opt}</button>)}
        </div>
      )}
    </div>
  )
}`,
    'Inputs/FormGroup/FormGroup.tsx': `'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface FormGroupProps {
  children: ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
  spacing?: 'sm' | 'md' | 'lg'
}

export function FormGroup({ children, className = '', direction = 'vertical', spacing = 'md' }: FormGroupProps) {
  const spacings = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' }
  return <div className={twMerge(clsx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-start', spacings[spacing], className))}>{children}</div>
}`,
    'Inputs/Fieldset/Fieldset.tsx': `'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface FieldsetProps {
  children: ReactNode
  legend?: ReactNode
  className?: string
}

export function Fieldset({ children, legend, className = '' }: FieldsetProps) {
  return (
    <fieldset className={twMerge(clsx('border border-black/10 rounded-lg p-4', className))}>
      {legend && <legend className="px-2 text-sm font-medium text-gray-800">{legend}</legend>}
      {children}
    </fieldset>
  )
}`,
    'Inputs/InputPhone/InputPhone.tsx': `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { FaPhone } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { InputText } from '../InputText/InputText'

interface InputPhoneProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  countryCode?: string
}

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(({ label, error, countryCode = '+268', className = '', ...props }, ref) => (
  <div className={twMerge(clsx('flex gap-2', className))}>
    <div className="shrink-0"><InputText value={countryCode} readOnly className="w-20 text-center" /></div>
    <InputText ref={ref} type="tel" label={label} error={error} icon={<FaPhone />} {...props} />
  </div>
))
InputPhone.displayName = 'InputPhone'`,
    'Inputs/InputColor/InputColor.tsx': `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface InputColorProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputColor = forwardRef<HTMLInputElement, InputColorProps>(({ label, error, className = '', ...props }, ref) => (
  <div className={twMerge(clsx('flex flex-col gap-1', className))}>
    {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
    <input ref={ref} type="color" className="w-12 h-10 rounded cursor-pointer" {...props} />
    {error && <p className="text-sm text-danger" role="alert">{error}</p>}
  </div>
))
InputColor.displayName = 'InputColor'`,
    'Inputs/RichTextEditor/RichTextEditor.tsx': `'use client'
import { useState } from 'react'
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  className?: string
}

export function RichTextEditor({ value = '', onChange, label, error, className = '' }: RichTextEditorProps) {
  const [content, setContent] = useState(value)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setContent(e.target.value); onChange?.(e.target.value) }
  return (
    <div className={twMerge(clsx('flex flex-col gap-1', className))}>
      {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
      <div className="border border-black/20 rounded-lg overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-black/10 bg-cream/30">
          <button type="button" className="p-1.5 rounded hover:bg-dark/5 transition-colors" aria-label="Bold"><FaBold size={14} /></button>
          <button type="button" className="p-1.5 rounded hover:bg-dark/5 transition-colors" aria-label="Italic"><FaItalic size={14} /></button>
          <button type="button" className="p-1.5 rounded hover:bg-dark/5 transition-colors" aria-label="Unordered list"><FaListUl size={14} /></button>
          <button type="button" className="p-1.5 rounded hover:bg-dark/5 transition-colors" aria-label="Ordered list"><FaListOl size={14} /></button>
          <button type="button" className="p-1.5 rounded hover:bg-dark/5 transition-colors" aria-label="Link"><FaLink size={14} /></button>
        </div>
        <textarea value={content} onChange={handleChange} className="w-full p-3 min-h-[120px] focus:outline-none" placeholder="Write your content here..." />
      </div>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  )
}`
};

for (const [relPath, content] of Object.entries(components)) {
    const fullPath = path.join(baseDir, relPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
}

console.log('Navigation and Inputs components updated.');
