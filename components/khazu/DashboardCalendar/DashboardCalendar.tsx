"use client";

import React, { useState } from "react";
import { Card, CardBody, Heading6, Portal } from "@/components/ui";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaInfoCircle,
  FaHeart,
  FaComment,
  FaEye,
} from "react-icons/fa";
import type {
  CalendarEngagementDay,
  CalendarReminder,
} from "@/types/dashboard";
import type { ListingBoost } from "@/types/listing";
import { toDateKey } from "@/lib/dashboard/format";

interface DashboardCalendarProps {
  userType?: "personal" | "dealer";
  boosts?: ListingBoost[];
  dailyEngagement?: Record<string, CalendarEngagementDay>;
  reminders?: CalendarReminder[];
}

export function DashboardCalendar({
  boosts = [],
  dailyEngagement = {},
  reminders = [],
}: DashboardCalendarProps) {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [tooltip, setTooltip] = useState<{
    day: number;
    top: number;
    left: number;
    placement: "top" | "bottom";
  } | null>(null);

  const TOOLTIP_WIDTH = 208; // w-52
  const TOOLTIP_EST_HEIGHT = 180;
  const EDGE_PADDING = 8;

  const showTooltipFor = (day: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const placement: "top" | "bottom" =
      rect.top - TOOLTIP_EST_HEIGHT - EDGE_PADDING < 0 ? "bottom" : "top";
    const left = Math.min(
      Math.max(
        rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2,
        EDGE_PADDING,
      ),
      window.innerWidth - TOOLTIP_WIDTH - EDGE_PADDING,
    );
    const top =
      placement === "top" ? rect.top - EDGE_PADDING : rect.bottom + EDGE_PADDING;
    setTooltip({ day, top, left, placement });
  };

  const hideTooltip = () => setTooltip(null);

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();
  const todayKey = toDateKey(today);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (y: number, m: number) =>
    new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const dayKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isToday = (day: number) => dayKey(day) === todayKey;

  const getBoostInfo = (day: number) => {
    const key = dayKey(day);
    const active = boosts.filter(
      (b) =>
        b.status === "active" &&
        key >= b.starts_at &&
        key <= b.ends_at,
    );
    if (active.length === 0) return null;

    const starts = active.some((b) => b.starts_at === key);
    const ends = active.some((b) => b.ends_at === key);
    const amount = active[0]?.amount_szl ?? 25;

    if (starts) {
      return {
        type: "start" as const,
        label: "Boost Start",
        desc: `SZL ${amount} featured placement started`,
      };
    }
    if (ends) {
      return {
        type: "end" as const,
        label: "Boost Ends",
        desc: `SZL ${amount} boost expires`,
      };
    }
    return {
      type: "range" as const,
      label: "Boost Active",
      desc: "Featured placement active",
    };
  };

  const getEngagementStats = (day: number) => {
    const key = dayKey(day);
    if (key > todayKey) return null;
    return dailyEngagement[key] ?? null;
  };

  const getRemindersForDay = (day: number) => {
    const key = dayKey(day);
    return reminders.filter((r) => r.date === key);
  };

  const paymentReminder = (day: number) =>
    getRemindersForDay(day).find(
      (r) => r.type === "payment" || r.type === "trial_end",
    );

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

  return (
    <Card padding="lg" elevated="sm" className="h-full relative min-w-0">
      <CardBody className="flex flex-col h-full justify-between overflow-x-auto">
        <div className="flex items-center justify-between mb-4 border-b border-line pb-2 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Heading6 className="mb-0 text-base sm:text-lg font-bold text-dark-light">
              Calendar
            </Heading6>
            <FaChevronDown className="text-muted text-xs mt-0.5 shrink-0" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-[10px] sm:text-xs font-bold text-dark-light">
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-[10px] font-bold text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center flex-grow select-none">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="p-2" />;
            }

            const todayFlag = isToday(day);
            const sub = getBoostInfo(day);
            const key = dayKey(day);
            const isPast = key < todayKey;
            const engagement = getEngagementStats(day);
            const dayReminders = getRemindersForDay(day);
            const pay = paymentReminder(day);

            let dayClass =
              "w-7 h-7 sm:w-9 sm:h-9 mx-auto flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ";
            let highlightBg = "";

            if (todayFlag) {
              dayClass +=
                "bg-primary text-white shadow-brand z-10";
            } else if (pay) {
              dayClass += "bg-amber-500 text-white z-10";
            } else if (sub) {
              if (sub.type === "start" || sub.type === "end") {
                dayClass += "bg-blue-600 text-white z-10";
              } else if (sub.type === "range") {
                dayClass += "text-blue-800 z-10";
                highlightBg =
                  "bg-blue-50 border-y border-blue-100/50 scale-y-90";
              }
            } else if (isPast) {
              dayClass += "text-gray-700 hover:bg-gray-100 hover:scale-105";
            } else {
              dayClass += "text-gray-400 hover:bg-gray-50";
            }

            const showTooltip =
              engagement || sub || dayReminders.length > 0;

            return (
              <div
                key={`day-${day}`}
                className="relative py-0.5 flex items-center justify-center"
                onMouseEnter={(e) => {
                  if (showTooltip) showTooltipFor(day, e.currentTarget);
                }}
                onMouseLeave={hideTooltip}
              >
                {highlightBg && (
                  <div className={`absolute inset-0 z-0 ${highlightBg}`} />
                )}

                <div className={dayClass}>
                  {day}
                  {!todayFlag && pay && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                  )}
                  {!todayFlag &&
                    !pay &&
                    sub &&
                    (sub.type === "start" || sub.type === "end") && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                    )}
                  {!todayFlag && !pay && !sub && isPast && engagement && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-success/70" />
                  )}
                </div>

                {tooltip?.day === day && showTooltip && (
                  <Portal>
                    <div
                      style={{
                        position: "fixed",
                        top: tooltip.top,
                        left: tooltip.left,
                        transform:
                          tooltip.placement === "top"
                            ? "translateY(-100%)"
                            : undefined,
                      }}
                      className="w-52 bg-white border border-gray-100 rounded-lg shadow-xl p-3 z-50 pointer-events-none text-left"
                    >
                    <div className="border-b border-gray-100 pb-1.5 mb-1.5">
                      <span className="text-xs font-bold text-gray-800">
                        {monthNames[month]} {day}, {year}
                      </span>
                    </div>

                    {dayReminders.map((r, i) => (
                      <div
                        key={`${r.type}-${i}`}
                        className="flex items-start gap-1.5 mb-1.5 last:mb-0"
                      >
                        <FaInfoCircle
                          className={
                            r.type === "payment" || r.type === "trial_end"
                              ? "text-amber-500 text-sm mt-0.5 shrink-0"
                              : r.type === "visitor"
                                ? "text-emerald-500 text-sm mt-0.5 shrink-0"
                                : "text-blue-500 text-sm mt-0.5 shrink-0"
                          }
                        />
                        <div>
                          <p className="text-[10px] font-bold uppercase text-gray-400">
                            {r.label}
                          </p>
                          <p className="text-xs font-semibold text-gray-800 leading-tight">
                            {r.desc}
                          </p>
                        </div>
                      </div>
                    ))}

                    {engagement && (
                      <div className="space-y-1 mt-1 pt-1 border-t border-gray-50">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <FaEye className="text-primary text-[10px]" />{" "}
                            Visitors
                          </span>
                          <span className="font-bold text-gray-700">
                            {engagement.visitors}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <FaHeart className="text-blue-500 text-[10px]" />{" "}
                            Likes
                          </span>
                          <span className="font-bold text-gray-700">
                            {engagement.likes}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <FaComment className="text-success text-[10px]" />{" "}
                            Comments
                          </span>
                          <span className="font-bold text-gray-700">
                            {engagement.comments}
                          </span>
                        </div>
                      </div>
                    )}

                    {sub && !dayReminders.some((r) => r.type === "boost") && (
                      <div className="space-y-1 flex items-start gap-1.5 mt-1">
                        <FaInfoCircle className="text-blue-500 text-sm mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-gray-800 leading-tight">
                            {sub.desc}
                          </p>
                        </div>
                      </div>
                    )}
                    </div>
                  </Portal>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-x-3 gap-y-1 items-center text-[10px] text-gray-500 font-semibold px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Payment / trial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
            <span>Boost</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success shrink-0" />
            <span>Visitors</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
