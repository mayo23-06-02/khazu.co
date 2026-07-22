"use client";
import { useState } from "react";
import { InputText, Select, Button } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PreApprovalFormProps {
  onSubmit?: (data: any) => void;
  className?: string;
}

export function PreApprovalForm({
  onSubmit,
  className = "",
}: PreApprovalFormProps) {
  const [formData, setFormData] = useState({
    income: "",
    employment: "employed",
    creditScore: "good",
  });
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-4",
          className,
        ),
      )}
    >
      <h3 className="font-display font-semibold text-lg text-gray-800 mb-3">
        Pre-Approval
      </h3>
      <div className="space-y-3">
        <InputText
          label="Monthly Income (SZL)"
          type="number"
          value={formData.income}
          onChange={(e) => setFormData({ ...formData, income: e.target.value })}
          fullWidth
        />
        <Select
          label="Employment Status"
          options={[
            { value: "employed", label: "Employed" },
            { value: "self", label: "Self-Employed" },
            { value: "retired", label: "Retired" },
          ]}
          value={formData.employment}
          onChange={(e) =>
            setFormData({ ...formData, employment: e.target.value })
          }
          fullWidth
        />
        <Select
          label="Credit Score"
          options={[
            { value: "excellent", label: "Excellent (750+)" },
            { value: "good", label: "Good (700-749)" },
            { value: "fair", label: "Fair (650-699)" },
            { value: "poor", label: "Poor (<650)" },
          ]}
          value={formData.creditScore}
          onChange={(e) =>
            setFormData({ ...formData, creditScore: e.target.value })
          }
          fullWidth
        />
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => onSubmit?.(formData)}
        >
          Check Pre-Approval
        </Button>
      </div>
    </div>
  );
}
