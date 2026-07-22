'use client'
import { Table, TableHead, TableRow, TableCell } from '@/components/ui'

interface AmortizationTableProps {
  loanAmount: number
  monthlyPayment: number
  rate: number
  term: number
}

export function AmortizationTable({ loanAmount, monthlyPayment, rate, term }: AmortizationTableProps) {
  const rows = []
  let balance = loanAmount
  const monthlyRate = rate / 100 / 12
  for (let i = 1; i <= Math.min(term, 12); i++) {
    const interest = balance * monthlyRate
    const principal = monthlyPayment - interest
    balance -= principal
    rows.push({ month: i, principal, interest, balance })
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell as="th">Month</TableCell>
          <TableCell as="th">Principal</TableCell>
          <TableCell as="th">Interest</TableCell>
          <TableCell as="th">Balance</TableCell>
        </TableRow>
      </TableHead>
      <tbody>
        {rows.map(row => (
          <TableRow key={row.month}>
            <TableCell>{row.month}</TableCell>
            <TableCell>SZL {Math.round(row.principal).toLocaleString()}</TableCell>
            <TableCell>SZL {Math.round(row.interest).toLocaleString()}</TableCell>
            <TableCell>SZL {Math.round(row.balance).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  )
}