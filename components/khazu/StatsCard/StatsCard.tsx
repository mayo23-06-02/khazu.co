import React from "react";
import { Card, CardBody } from "@/components/ui";
import {
  FaChevronRight,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgClass?: string;
  trendValue?: string;
  trendUp?: boolean;
  slug?: string;
}

export function StatsCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  iconBgClass = "bg-primary",
  trendValue,
  trendUp = true,
  slug,
}: StatsCardProps) {
  return (
    <Card
      padding="none"
      elevated="sm"
      hover
      className="h-full flex flex-col overflow-hidden bg-white"
    >
      <CardBody className="p-0 flex-1 flex flex-col">
        {/* Top Section */}
        <div className="flex items-start justify-between p-4 ">
          <div
            className={`w-10 p-2 h-10 text-sm rounded-md flex items-center justify-center text-white ${iconBgClass}`}
          >
            {icon}
          </div>
          {trendValue && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold ${trendUp ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}
            >
              {trendUp ? (
                <FaArrowTrendUp size={10} />
              ) : (
                <FaArrowTrendDown size={10} />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Middle Section */}
        <div className="px-4 pb-4">
          <div className="flex items-baseline gap-1">
            <span className=" leading-none text-2xl font-semibold text-ink tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xl font-semibold text-muted">
                {unit}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs font-medium text-muted mt-2">{subtitle}</p>
          )}
        </div>

        {/* Bottom Section */}
        {slug ? (
          <Link href={`/dashboard/${slug}`}>
            <div className="mt-auto border-t border-line p-4 px-5 flex items-center justify-between hover:bg-surface-alt transition-colors cursor-pointer group">
              <span className="text-[13px] font-semibold text-dark-light group-hover:text-ink transition-colors">
                {title}
              </span>
              <FaChevronRight className="text-muted text-[10px] group-hover:text-dark-light transition-colors" />
            </div>
          </Link>
        ) : (
          <div className="mt-auto border-t border-line p-4 px-5 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-dark-light">
              {title}
            </span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
