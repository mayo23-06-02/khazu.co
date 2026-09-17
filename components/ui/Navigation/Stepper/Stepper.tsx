"use client";
import { ReactNode } from "react";
import { MdCheck } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Step {
  id: string;
  label: ReactNode;
  status?: "pending" | "active" | "completed" | "error";
}

interface StepperProps {
  steps: Step[];
  currentStep?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Stepper({
  steps,
  currentStep,
  className = "",
  orientation = "horizontal",
}: StepperProps) {
  const getStatus = (step: Step) => {
    if (step.status) return step.status;
    if (!currentStep) return "pending";
    const idx = steps.findIndex((s) => s.id === step.id);
    const cur = steps.findIndex((s) => s.id === currentStep);
    if (idx < cur) return "completed";
    if (idx === cur) return "active";
    return "pending";
  };
  return (
    <div
      className={twMerge(
        clsx(
          "flex",
          orientation === "horizontal"
            ? "flex-row items-center overflow-x-auto"
            : "flex-col gap-2",
          className,
        ),
      )}
    >
      {steps.map((step, index) => {
        const status = getStatus(step);
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={twMerge(
                clsx(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  status === "completed" && "bg-[#CD2C58] text-gray-800",
                  status === "active" &&
                    "bg-[#CD2C58]/20 text-[#CD2C58] border-2 border-[#CD2C58]",
                  status === "error" && "bg-danger text-white",
                  status === "pending" && "bg-dark/10 text-gray-800/40",
                ),
              )}
            >
              {status === "completed" ? <MdCheck size={14} /> : index + 1}
            </div>
            <span
              className={twMerge(
                clsx(
                  "text-sm",
                  status === "active" && "font-medium text-gray-800",
                  status === "completed" && "text-gray-800/70",
                  status === "pending" && "text-gray-800/40",
                ),
              )}
            >
              {step.label}
            </span>
            {orientation === "horizontal" && index < steps.length - 1 && (
              <div
                className={twMerge(
                  clsx(
                    "h-px w-8",
                    status === "completed" ||
                      getStatus(steps[index + 1]) === "completed"
                      ? "bg-[#CD2C58]"
                      : "bg-dark/10",
                  ),
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
