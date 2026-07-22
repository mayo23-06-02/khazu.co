"use client";

import React, { useMemo, useState } from "react";
import { Card, CardBody, Body, Heading6 } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { EngagementPoint, ListingOption } from "@/types/dashboard";

interface VisitorGraphProps {
  data?: EngagementPoint[];
  listingOptions?: ListingOption[];
  engagementByListing?: Record<string, EngagementPoint[]>;
}

export function VisitorGraph({
  data = [],
  listingOptions = [],
  engagementByListing = {},
}: VisitorGraphProps) {
  const [filter, setFilter] = useState("all");

  const chartData = useMemo(() => {
    if (filter === "all") return data;
    return engagementByListing[filter] ?? data;
  }, [filter, data, engagementByListing]);

  const selectedLabel =
    filter === "all"
      ? "Engagement Overview"
      : listingOptions.find((l) => l.id === filter)?.label ?? "Listing";

  const hasData = chartData.some(
    (d) => d.views > 0 || d.likes > 0 || d.comments > 0,
  );

  return (
    <Card padding="lg" className="border-gray-200 h-full">
      <CardBody className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4 gap-2">
          <Heading6 className="mb-0 text-lg uppercase font-bold text-gray-700 truncate">
            {selectedLabel}
          </Heading6>
          <select
            className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-3 py-1.5 text-gray-700 outline-none focus:border-[#CD2C58] focus:ring-1 focus:ring-[#CD2C58] max-w-[50%]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Listings</option>
            {listingOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {!hasData ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <Body muted className="text-center text-sm px-4">
              No engagement yet. Views, likes, and comments will appear here
              once buyers interact with your listings.
            </Body>
          </div>
        ) : (
          <div className="h-[350px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 0, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "4px",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
                />
                <Bar
                  dataKey="views"
                  name="Visitors"
                  fill="#CD2C58"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="likes"
                  name="Likes"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="comments"
                  name="Comments"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
