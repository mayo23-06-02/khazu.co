const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'components', 'ui');

const categories = {
  Layout: ["Container", "Grid", "Flex", "Stack", "Section", "Card", "CardHeader", "CardBody", "CardFooter", "Divider", "Spacer", "PageHeader"],
  Typography: ["Heading1", "Heading2", "Heading3", "Heading4", "Heading5", "Heading6", "Body", "Small", "Caption"],
  Navigation: ["Navbar", "NavLink", "Breadcrumb", "Pagination", "Tabs", "Sidebar", "MobileDrawer", "DropdownMenu", "Accordion", "Stepper"],
  Inputs: ["InputText", "InputNumber", "InputEmail", "InputPassword", "Textarea", "Select", "Checkbox", "RadioGroup", "ToggleSwitch", "Slider", "FileUpload", "ImageUpload", "DatePicker", "SearchBar", "Autocomplete", "FormGroup", "Fieldset", "InputPhone", "InputColor", "RichTextEditor"],
  Buttons: ["Button", "ButtonLink", "IconButton", "ButtonGroup", "FloatingActionButton", "CtaButton", "ShareButton", "CopyButton", "DeleteButton", "AddButton", "LoadMoreButton", "BackButton"],
  Cards: ["CarCard", "CarCardGrid", "CarCardSkeleton", "DealerCard", "ReviewCard", "MessageCard", "ListingCard", "StatsCard", "SubscriptionCard", "LeadCard", "AnalyticsCard", "FeatureCard"],
  Modals: ["Modal", "AlertModal", "FormModal", "ImageModal", "Toasts", "Tooltip", "Popover", "OffCanvas", "LoadingOverlay", "ConfirmDialog"],
  Badges: ["Badge", "StatusBadge", "PriceBadge", "RatingStars", "TagList", "ProgressBar", "Spinner", "Separator"],
  Tables: ["Table", "TableHead", "TableRow", "TableCell", "DataTable", "PaginationControls", "RowActions", "EmptyState"],
  Filters: ["FilterGroup", "PriceSlider", "CheckboxGroup", "SearchFilter", "ActiveFilterChips"],
  Finance: ["LoanCalculator", "AmortizationTable", "FinanceOfferBadge", "PreApprovalForm"],
  Messaging: ["ChatBubble", "ChatInput", "ContactForm", "WhatsAppButton", "InboxList"],
  Admin: ["FlaggedItem", "UserStatusToggle", "PaymentStatusBadge", "FraudAlert", "ReportTable", "BulkActionBar"],
  Shared: ["Avatar", "Logo", "Icon", "Skeleton", "ErrorBoundary", "Portal", "OutsideClickDetector", "VisuallyHidden"],
  Feedback: ["ToastContainer", "Toast", "AlertBanner", "InlineAlert"],
  CarMarket: ["VehicleSpecsTable", "ImageGallery", "ListingStatusProgress"]
};

const templates = {
  Container: `'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function Container({ children, className = '', maxWidth = 'lg' }: ContainerProps) {
  const widths = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-8xl',
    '2xl': 'max-w-9xl',
    full: 'max-w-full',
  }
  return (
    <div className={twMerge(clsx('mx-auto px-4 sm:px-6 lg:px-8', widths[maxWidth], className))}>
      {children}
    </div>
  )
}`,
  Button: `'use client'
import { ReactNode, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg[#CD2C58] text-gray-800 hover:bg[#CD2C58]/80 focus:ring[#CD2C58]/50',
    secondary: 'bg-dark text-white hover:bg-dark/90 focus:ring-dark/50',
    outline: 'border-2 border-black bg-transparent text-gray-800 hover:bg-dark/10',
    ghost: 'bg-transparent text-gray-800 hover:bg-dark/5',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger/50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  }

  return (
    <button
      className={twMerge(clsx(base, variants[variant], sizes[size], fullWidth && 'w-full', className))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4 mr-2" /> : null}
      {children}
    </button>
  )
}`,
  InputText: `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({
  label,
  error,
  icon,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={twMerge(clsx('flex flex-col gap-1', fullWidth && 'w-full'))}>
      {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800/40">{icon}</div>}
        <input
          ref={ref}
          className={twMerge(clsx(
            'w-full rounded-lg border bg-white px-4 py-2.5 text-gray-800 placeholder:text-gray-800/40 transition-colors focus:outline-none focus:ring-2',
            icon ? 'pl-10' : 'pl-4',
            error ? 'border-danger focus:ring-danger/30' : 'border-black/20 focus:border[#CD2C58] focus:ring[#CD2C58]/30',
            className
          ))}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  )
})
InputText.displayName = 'InputText'`,
  Card: `'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  }
  return (
    <div className={twMerge(clsx('bg-white rounded-lg shadow-sm border border-black/5', paddings[padding], hover && 'hover:shadow-md transition-shadow duration-200', className))}>
      {children}
    </div>
  )
}`,
  Checkbox: `'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { FaCheck } from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
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
  )
})
Checkbox.displayName = 'Checkbox'`
};

function getDefaultTemplate(name) {
  return `'use client'
import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface \${name}Props {
  children?: ReactNode
  className?: string
}

export function \${name}({ children, className = '' }: \${name}Props) {
  return (
    <div className={twMerge(clsx('w-full', className))}>
      {children || <span>\${name} Component</span>}
    </div>
  )
}`;
}

const barrelLines = [];

for (const [cat, comps] of Object.entries(categories)) {
  for (const comp of comps) {
    const compDir = path.join(baseDir, cat, comp);
    if (!fs.existsSync(compDir)) {
      fs.mkdirSync(compDir, { recursive: true });
    }
    const filePath = path.join(compDir, \`\${comp}.tsx\`);
    let code = templates[comp] || getDefaultTemplate(comp);
    
    // Replace ${name} in default template
    code = code.replace(/\\\${name}/g, comp);

    fs.writeFileSync(filePath, code, 'utf-8');
    barrelLines.push(\`export { \${comp} } from './\${cat}/\${comp}/\${comp}'\`);
  }
}

// Special case for Card related exports
barrelLines.push(\`export { CardHeader } from './Layout/CardHeader/CardHeader'\`);
barrelLines.push(\`export { CardBody } from './Layout/CardBody/CardBody'\`);
barrelLines.push(\`export { CardFooter } from './Layout/CardFooter/CardFooter'\`);

fs.writeFileSync(path.join(baseDir, 'index.ts'), barrelLines.join('\\n'), 'utf-8');

console.log('Successfully generated 100+ Khazu components!');
