'use client'
import { Table, TableHead, TableRow, TableCell } from '@/components/ui'

interface ReportTableProps {
  data: Array<Record<string, string | number>>
  columns: Array<{ key: string; label: string }>
}

export function ReportTable({ data, columns }: ReportTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>{columns.map(col => <TableCell key={col.key} as="th">{col.label}</TableCell>)}</TableRow>
      </TableHead>
      <tbody>
        {data.map((row, i) => (
          <TableRow key={i}>{columns.map(col => <TableCell key={col.key}>${row[col.key]}</TableCell>)}</TableRow>
        ))}
      </tbody>
    </Table>
  )
}