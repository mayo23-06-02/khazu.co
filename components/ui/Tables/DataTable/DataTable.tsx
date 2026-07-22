'use client'
import { Table, TableHead, TableRow, TableCell } from '@/components/ui'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({ data, columns, className = '', onRowClick }: DataTableProps<T>) {
  return (
    <Table className={className}>
      <TableHead>
        <TableRow>
          {columns.map((col, i) => <TableCell key={i} as="th">{col.label}</TableCell>)}
        </TableRow>
      </TableHead>
      <tbody>
        {data.map(item => (
          <TableRow key={item.id} hover={!!onRowClick} onClick={() => onRowClick?.(item)}>
            {columns.map((col, i) => <TableCell key={i}>{col.render ? col.render(item) : String(item[col.key as keyof T] || '')}</TableCell>)}
          </TableRow>
        ))}
      </tbody>
    </Table>
  )
}