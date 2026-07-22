"use client";
import { Table, TableHead, TableRow, TableCell } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface VehicleSpecsTableProps {
  specs: Record<string, string | number>;
  className?: string;
}

export function VehicleSpecsTable({
  specs,
  className = "",
}: VehicleSpecsTableProps) {
  return (
    <Table className={className}>
      <TableHead>
        <TableRow>
          <TableCell as="th">Specification</TableCell>
          <TableCell as="th">Value</TableCell>
        </TableRow>
      </TableHead>
      <tbody>
        {Object.entries(specs).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="font-medium text-gray-800/70">
              {key}
            </TableCell>
            <TableCell className="text-gray-800 font-semibold">
              {value}
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
