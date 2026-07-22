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
  iconBgClass = "bg-[#4085aa]",
  trendValue,
  trendUp = true,
  slug,
}: StatsCardProps) {
  return (
    <Card
      padding="none"
      className="h-full border border-gray-200  flex flex-col overflow-hidden bg-white"
    >
      <CardBody className="p-0 flex-1 flex flex-col">
        {/* Top Section */}
        <div className="flex items-start justify-between p-4 ">
          <div
            className={`w-10 p-2 h-10 text-sm rounded-md flex items-center justify-center text-white bg-[#1a1a1a]`}
          >
            {icon}
          </div>
          {trendValue && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold ${trendUp ? "bg-[#e2f8eb] text-[#00a859]" : "bg-red-50 text-red-600"}`}
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
            <span className=" leading-none text-2xl font-semibold text-gray-900 tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xl font-semibold text-gray-500">
                {unit}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs font-medium text-gray-400 mt-2">{subtitle}</p>
          )}
        </div>

        {/* Bottom Section */}
        {slug ? (
          <Link href={`/dashboard/${slug}`}>
            <div className="mt-auto border-t border-gray-50 p-4 px-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
              <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                {title}
              </span>
              <FaChevronRight className="text-gray-400 text-[10px] group-hover:text-gray-600 transition-colors" />
            </div>
          </Link>
        ) : (
          <div className="mt-auto border-t border-gray-50 p-4 px-5 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-600">
              {title}
            </span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
