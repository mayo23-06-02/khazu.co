"use client";

import React from "react";
import { Card, CardBody, Heading6, Body } from "@/components/ui";
import { FaHeart, FaComment, FaBell, FaInfoCircle } from "react-icons/fa";
import type { DashboardActivityItem } from "@/types/dashboard";

interface RecentActivityProps {
  userType?: "personal" | "dealer";
  activities?: DashboardActivityItem[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const getIcon = (type: DashboardActivityItem["type"]) => {
    switch (type) {
      case "like":
        return <FaHeart className="text-red-500 text-sm" />;
      case "comment":
        return <FaComment className="text-[#3b82f6] text-sm" />;
      case "notification":
        return <FaBell className="text-green-500 text-sm" />;
      case "reminder":
        return (
          <FaInfoCircle className="text-orange-500 text-sm animate-pulse" />
        );
    }
  };

  const getIconBg = (type: DashboardActivityItem["type"]) => {
    switch (type) {
      case "like":
        return "bg-red-50 border-red-100";
      case "comment":
        return "bg-blue-50 border-blue-100";
      case "notification":
        return "bg-green-50 border-green-100";
      case "reminder":
        return "bg-orange-50 border-orange-100";
    }
  };

  return (
    <Card padding="lg" className="border-gray-200 h-full">
      <CardBody className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
          <Heading6 className="mb-0 text-lg uppercase font-bold text-gray-700">
            Recent Activity
          </Heading6>
        </div>

        <div className="grow space-y-3 overflow-y-auto pr-1 max-h-[350px] custom-scrollbar scrollbar-thin scrollbar-thumb-gray-200">
          {activities.length === 0 ? (
            <div className="py-10 text-center">
              <Body muted className="text-sm">
                No activity yet — list a car to get started.
              </Body>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-sm ${
                  activity.isUpcoming
                    ? "bg-linear-to-r from-orange-50/70 to-yellow-50/30 border-orange-200/80 "
                    : "bg-white border-gray-200 hover:border-gray-200"
                }`}
              >
                <div
                  className={`p-2 rounded-lg border flex items-center justify-center shrink-0 ${getIconBg(
                    activity.type,
                  )}`}
                >
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-snug break-words">
                    {activity.text}
                  </p>
                  <span className="text-[11px] font-medium text-gray-400 mt-1 block">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
}
