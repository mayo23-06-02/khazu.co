"use client";
import {
  MdSpeed,
  MdCalendarToday,
  MdAccessTime,
  MdRadioButtonChecked,
  MdWarning,
  MdCheckCircle,
  MdArrowUpward,
  MdArrowDownward,
  MdCompareArrows,
} from "react-icons/md";
import { FaRoad } from "react-icons/fa";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface MileageInfographicProps {
  mileage: number;
  year: number;
  fuelType: string;
  annualDistance: number;
  remainingLifespan: number;
  majorServiceDue: "Soon" | "Due" | "Overdue" | "None";
  tireWear: number;
  brakeWear: number;
  batteryHealth?: number;
  className?: string;
}

export function MileageInfographic({
  mileage,
  year,
  fuelType,
  annualDistance,
  remainingLifespan,
  majorServiceDue,
  tireWear,
  brakeWear,
  batteryHealth,
  className = "",
}: MileageInfographicProps) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const avgMileagePerYear = Math.round(mileage / Math.max(age, 1));

  // Assuming 20000km is the average per year for Eswatini context
  const mileagePercentile = Math.min(
    100,
    Math.round((avgMileagePerYear / 25000) * 100),
  );

  const getMileageStatus = () => {
    if (avgMileagePerYear < 10000)
      return {
        label: "Low Usage",
        color: "text-green-600",
        icon: <MdArrowDownward />,
      };
    if (avgMileagePerYear < 20000)
      return {
        label: "Optimal",
        color: "text[#CD2C58]",
        icon: <MdCompareArrows />,
      };
    if (avgMileagePerYear < 30000)
      return {
        label: "High Usage",
        color: "text-yellow-600",
        icon: <MdArrowUpward />,
      };
    return {
      label: "Extreme Usage",
      color: "text-danger",
      icon: <MdArrowUpward />,
    };
  };

  const status = getMileageStatus();

  const serviceStatusConfig = {
    None: {
      icon: <MdCheckCircle />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    Soon: {
      icon: <MdAccessTime />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    Due: { icon: <MdWarning />, color: "text-orange-600", bg: "bg-orange-50" },
    Overdue: { icon: <MdWarning />, color: "text-danger", bg: "bg-red-50" },
  };

  const serviceConfig =
    serviceStatusConfig[majorServiceDue] || serviceStatusConfig["None"];

  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-6 lg:p-8",
          className,
        ),
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display font-bold text-xl text-gray-800">
            Vehicle Health Analytics
          </h3>
          <p className="text-sm text-gray-800/50 mt-1">
            Real-time mileage and maintenance forecasting
          </p>
        </div>
        <div
          className={twMerge(
            clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
              status.color,
              "bg-dark/5",
            ),
          )}
        >
          {status.icon} {status.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Speedometer-style Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            {/* Background Track */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform -rotate-90"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-dark/5 fill-none stroke-[8]"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke[#CD2C58] fill-none stroke-[8] transition-all duration-1000 ease-out"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - mileagePercentile / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <MdSpeed size={32} className="text[#CD2C58] mb-2" />
              <span className="text-3xl sm:text-4xl font-display font-black text-gray-800 tracking-tight">
                {mileage > 99999
                  ? (mileage / 1000).toFixed(1) + "k"
                  : mileage.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-gray-800/40 uppercase tracking-widest mt-1">
                Total Kilometers
              </span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-gray-800/70">
              Average {avgMileagePerYear.toLocaleString()} km / year
            </span>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-cream/30 rounded-lg border border-black/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm text[#CD2C58]">
                <FaRoad size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800/60 uppercase tracking-wider">
                Annual Distance
              </span>
            </div>
            <div className="text-xl font-display font-bold text-gray-800">
              {annualDistance.toLocaleString()}{" "}
              <span className="text-sm font-normal text-gray-800/40">km</span>
            </div>
          </div>

          <div className="p-4 bg-cream/30 rounded-lg border border-black/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm text[#CD2C58]">
                <MdCalendarToday size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800/60 uppercase tracking-wider">
                Remaining Life
              </span>
            </div>
            <div className="text-xl font-display font-bold text-gray-800">
              {remainingLifespan}{" "}
              <span className="text-sm font-normal text-gray-800/40">
                years
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 p-4 bg-cream/30 rounded-lg border border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text[#CD2C58]">
                <MdAccessTime size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800/60 uppercase tracking-wider">
                Major Service Due
              </span>
            </div>
            <div
              className={twMerge(
                clsx(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                  serviceConfig.color,
                  serviceConfig.bg,
                ),
              )}
            >
              {serviceConfig.icon} {majorServiceDue}
            </div>
          </div>
        </div>
      </div>

      {/* Component Health Bars */}
      <div className="mt-10 pt-8 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <HealthBar
          label="Tire Tread"
          value={100 - tireWear}
          icon={<MdRadioButtonChecked />}
        />
        <HealthBar
          label="Brake Pads"
          value={100 - brakeWear}
          icon={<MdRadioButtonChecked />}
        />
        {(fuelType === "Electric" || fuelType === "Hybrid") && (
          <HealthBar
            label="Battery Health"
            value={batteryHealth || 0}
            icon={<MdRadioButtonChecked />}
          />
        )}
      </div>
    </div>
  );
}

function HealthBar({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  const getStatusColor = (v: number) => {
    if (v > 70) return "bg[#CD2C58]";
    if (v > 30) return "bg-yellow-500";
    return "bg-danger";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text[#CD2C58]">{icon}</span>
          <span className="text-sm font-bold text-gray-800/80">{label}</span>
        </div>
        <span className="text-sm font-display font-bold text-gray-800">
          {value}%
        </span>
      </div>
      <div className="h-2.5 bg-dark/5 rounded-full overflow-hidden p-0.5">
        <div
          className={twMerge(
            clsx(
              "h-full rounded-full transition-all duration-1000 ease-out",
              getStatusColor(value),
            ),
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
