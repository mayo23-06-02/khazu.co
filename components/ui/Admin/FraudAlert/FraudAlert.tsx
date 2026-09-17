"use client";
import { MdWarning } from "react-icons/md";
import { Card, Button } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FraudAlertProps {
  pattern: string;
  count: number;
  actions: Array<{ label: string; onClick: () => void }>;
  className?: string;
}

export function FraudAlert({
  pattern,
  count,
  actions,
  className = "",
}: FraudAlertProps) {
  return (
    <Card className={twMerge(clsx("border-danger/20 p-4", className))}>
      <div className="flex items-center gap-3">
        <MdWarning className="text-danger" size={24} />
        <div>
          <h3 className="font-medium text-gray-800">{pattern}</h3>
          <p className="text-sm text-gray-800/60">
            Detected in {count} listings
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {actions.map((a, i) => (
          <Button key={i} variant="outline" size="sm" onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
