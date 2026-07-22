"use client";
import {
  Heading4,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Body,
} from "@/components/ui";

interface Prop {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface PropsTableProps {
  props: Prop[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="mt-10">
      <Heading4 className="mb-6">API Reference</Heading4>
      <div className="border border-black/10 rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHead className="bg-cream/20">
            <TableRow>
              <TableCell className="font-bold text-gray-800/70 text-xs uppercase tracking-wider">
                Property
              </TableCell>
              <TableCell className="font-bold text-gray-800/70 text-xs uppercase tracking-wider">
                Type
              </TableCell>
              <TableCell className="font-bold text-gray-800/70 text-xs uppercase tracking-wider">
                Default
              </TableCell>
              <TableCell className="font-bold text-gray-800/70 text-xs uppercase tracking-wider">
                Description
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {props.map((prop) => (
              <TableRow
                key={prop.name}
                className="hover:bg-dark/5 transition-colors"
              >
                <TableCell className="font-mono text-sm text-gray-800 font-bold">
                  {prop.name}
                </TableCell>
                <TableCell className="font-mono text-xs text[#CD2C58]-dark">
                  {prop.type}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-800/40">
                  {prop.default}
                </TableCell>
                <TableCell className="text-sm text-gray-800/70">
                  {prop.description}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
