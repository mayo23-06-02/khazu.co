"use client";
import { useState } from "react";
import { InputText, Select, Button } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface LoanCalculatorProps {
  price?: number;
  className?: string;
}

export function LoanCalculator({
  price = 0,
  className = "",
}: LoanCalculatorProps) {
  const [amount, setAmount] = useState(price);
  const [deposit, setDeposit] = useState(price * 0.1);
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(10);
  const loanAmount = amount - deposit;
  const monthly =
    loanAmount > 0
      ? (loanAmount * (rate / 100 / 12) * Math.pow(1 + rate / 100 / 12, term)) /
        (Math.pow(1 + rate / 100 / 12, term) - 1)
      : 0;
  const totalPayment = monthly * term;
  const totalInterest = totalPayment - loanAmount;
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
        Loan Calculator
      </h3>
      <div className="space-y-3">
        <InputText
          label="Car Price (SZL)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          fullWidth
        />
        <InputText
          label="Deposit (SZL)"
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
          fullWidth
        />
        <Select
          label="Term (months)"
          options={[
            { value: "12", label: "12 months" },
            { value: "24", label: "24 months" },
            { value: "36", label: "36 months" },
            { value: "48", label: "48 months" },
            { value: "60", label: "60 months" },
            { value: "72", label: "72 months" },
          ]}
          value={String(term)}
          onChange={(e) => setTerm(parseInt(e.target.value))}
          fullWidth
        />
        <InputText
          label="Interest Rate (%)"
          type="number"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
          fullWidth
        />
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5">
          <div>
            <span className="text-xs text-gray-800/60">Monthly Payment</span>
            <div className="font-display font-bold text-gray-800">
              SZL {Math.round(monthly).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-800/60">Total Interest</span>
            <div className="text-sm text-gray-800/60">
              SZL {Math.round(totalInterest).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
