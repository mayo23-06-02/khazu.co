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
        return <FaHeart className="text-danger text-sm" />;
      case "comment":
        return <FaComment className="text-info text-sm" />;
      case "notification":
        return <FaBell className="text-success text-sm" />;
      case "reminder":
        return (
          <FaInfoCircle className="text-warning text-sm animate-pulse" />
        );
    }
  };

  const getIconBg = (type: DashboardActivityItem["type"]) => {
    switch (type) {
      case "like":
        return "bg-danger-light border-danger-light";
      case "comment":
        return "bg-info-light border-info-light";
      case "notification":
        return "bg-success-light border-success-light";
      case "reminder":
        return "bg-warning-light border-warning-light";
    }
  };

  return (
    <Card padding="lg" elevated="sm" className="h-full">
      <CardBody className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4 border-b border-line pb-2">
          <Heading6 className="mb-0 text-lg uppercase font-bold text-dark-light">
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
                    ? "bg-linear-to-r from-warning-light/70 to-warning-light/20 border-warning/30"
                    : "bg-white border-line hover:border-line-strong"
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
                  <p className="text-sm font-semibold text-ink leading-snug break-words">
                    {activity.text}
                  </p>
                  <span className="text-[11px] font-medium text-muted mt-1 block">
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
