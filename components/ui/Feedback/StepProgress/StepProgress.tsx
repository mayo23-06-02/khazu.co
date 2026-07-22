"use client";
import { MdSchedule } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface StepProgressStep {
  id: string;
  label: string;
}

interface StepProgressProps {
  steps: StepProgressStep[];
  currentIndex: number;
  /** Minutes attributed to each remaining step, used for the ETA chip. */
  minutesPerStep?: number;
  className?: string;
}

export function StepProgress({
  steps,
  currentIndex,
  minutesPerStep = 1,
  className = "",
}: StepProgressProps) {
  const total = steps.length;
  const percent =
    total > 1 ? Math.round(((currentIndex + 1) / total) * 100) : 100;
  const remaining = Math.max(total - (currentIndex + 1), 0);
  const etaLabel =
    remaining === 0 ? "Almost done" : `~${remaining * minutesPerStep} min left`;

  return (
    <div className={twMerge(clsx("w-full", className))}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-normal text-gray-400">Your progress</p>
          <p className="text-2xl font-semibold text-gray-900">
            {percent}%{" "}
            <span className="text-base font-normal  text-gray-500">
              to complete
            </span>
          </p>
        </div>
        
      </div>

      <div className="relative h-1 mt-5 mb-6">
        <div className="absolute inset-0 rounded-full bg-gray-100" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#a72346] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between">
          {steps.map((step, idx) => {
            const done = idx < currentIndex;
            const active = idx === currentIndex;
            // Keep the tooltip centered under middle dots, but pin it to
            // the near edge at the ends so it can't overflow the card.
            const isFirst = idx === 0;
            const isLast = idx === total - 1;
            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center"
              >
                <span
                  className={twMerge(
                    clsx(
                      "block rounded-full border-2 transition-all",
                      active
                        ? "w-4 h-4 bg-white border-[#a72346] shadow"
                        : done
                          ? "w-2.5 h-2.5 bg-[#a72346] border-[#a72346]"
                          : "w-2.5 h-2.5 bg-white border-gray-200",
                    ),
                  )}
                />
                {active && (
                  <span
                    className={twMerge(
                      clsx(
                        "absolute top-5 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white shadow",
                        isFirst
                          ? "left-0"
                          : isLast
                            ? "right-0"
                            : "left-1/2 -translate-x-1/2",
                      ),
                    )}
                  >
                    {step.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
