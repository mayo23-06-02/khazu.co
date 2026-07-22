"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaBell,
  FaBars,
  FaSearch,
  FaUserCircle,
  FaHeart,
  FaComment,
  FaInfoCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Body, Modal, Popover, DropdownMenu } from "@/components/ui";
import { clsx } from "clsx";
import { UserRole } from "@/types/user";

type NotificationType = "like" | "comment" | "notification" | "reminder";

interface NotificationCta {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  summary: string;
  message: string;
  time: string;
  read: boolean;
  ctas?: NotificationCta[];
}

const INITIAL_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: "1",
    type: "comment",
    title: "New enquiry on your listing",
    summary: "Thabo asked about the service history of your BMW 3 Series.",
    message:
      "Thabo Mokoena sent an enquiry on your listing \"2019 BMW 3 Series 320d\": \"Hi, is the full service history available and would you consider a trade-in?\" Reply soon to keep your response rate up.",
    time: "5m ago",
    read: false,
    ctas: [
      { label: "Reply to enquiry", href: "/dashboard/personal/messages", variant: "primary" },
      { label: "View listing", href: "/dashboard/personal/listings" },
    ],
  },
  {
    id: "2",
    type: "like",
    title: "Your listing is getting attention",
    summary: "12 people liked your Toyota Hilux listing today.",
    message:
      "Your listing \"2021 Toyota Hilux 2.8 GD-6\" received 12 new likes in the last 24 hours. Listings with high engagement sell faster — consider boosting it to reach even more buyers.",
    time: "1h ago",
    read: false,
    ctas: [{ label: "Boost this listing", href: "/dashboard/personal/listings", variant: "primary" }],
  },
  {
    id: "3",
    type: "reminder",
    title: "Subscription renews soon",
    summary: "Your plan renews in 3 days.",
    message:
      "Your Khazu subscription is set to renew in 3 days. Make sure your payment details are up to date to avoid any interruption to your active listings.",
    time: "3h ago",
    read: true,
    ctas: [{ label: "Manage subscription", href: "/dashboard/personal/subscription", variant: "primary" }],
  },
  {
    id: "4",
    type: "notification",
    title: "Listing approved",
    summary: "Your Ford Ranger listing is now live.",
    message:
      "Good news — your listing \"2020 Ford Ranger Wildtrak\" has passed review and is now live on Khazu. Share it on social media to get more views.",
    time: "1d ago",
    read: true,
  },
];

const NOTIFICATION_ICON_STYLES: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string }
> = {
  like: { icon: <FaHeart className="text-red-500 text-sm" />, bg: "bg-red-50 border-red-100" },
  comment: { icon: <FaComment className="text-[#3b82f6] text-sm" />, bg: "bg-blue-50 border-blue-100" },
  notification: { icon: <FaBell className="text-green-500 text-sm" />, bg: "bg-green-50 border-green-100" },
  reminder: { icon: <FaInfoCircle className="text-orange-500 text-sm" />, bg: "bg-orange-50 border-orange-100" },
};

const PROFILE_HREF: Record<UserRole, string> = {
  [UserRole.PERSONAL]: "/dashboard/personal/profile",
  [UserRole.DEALER]: "/dashboard/dealer/profile",
  [UserRole.ADMIN]: "/dashboard/admin",
};

interface DashboardTopbarProps {
  userName?: string;
  role?: UserRole;
  onMenuClick?: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({
  userName,
  role = UserRole.PERSONAL,
  onMenuClick,
}) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeNotification, setActiveNotification] =
    useState<DashboardNotification | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openNotification = (notification: DashboardNotification) => {
    setActiveNotification(notification);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
  };

  const handleLogout = async () => {
    const { logoutUser } = await import("@/lib/auth/actions");
    await logoutUser();
  };

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 shrink-0"
          aria-label="Open navigation menu"
        >
          <FaBars size={20} />
        </button>

        <div className="flex-1 max-w-md min-w-0">
          <div className="relative group hidden sm:block">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CD2C58] transition-colors" />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-[#CD2C58]/20 transition-all"
            />
          </div>
          {/* Mobile: icon-only search affordance */}
          <button
            type="button"
            className="sm:hidden p-2.5 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Search"
          >
            <FaSearch size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Popover
          position="bottom-end"
          trigger={
            <button
              type="button"
              className="relative text-gray-500 hover:text-[#CD2C58] transition-colors p-2"
              aria-label="Notifications"
            >
              <FaBell size={18} className="sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#CD2C58] rounded-full border-2 border-white" />
              )}
            </button>
          }
        >
          <div className="w-[min(22rem,90vw)] -m-3">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <Body className="font-bold">Notifications</Body>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold text-[#CD2C58]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="max-h-[360px] overflow-y-auto custom-scrollbar divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="py-8 text-center px-4">
                  <Body muted className="text-sm">
                    You&apos;re all caught up.
                  </Body>
                </div>
              ) : (
                notifications.map((notification) => {
                  const style = NOTIFICATION_ICON_STYLES[notification.type];
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => openNotification(notification)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-[#CD2C58]/5" : ""
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg border flex items-center justify-center shrink-0 ${style.bg}`}
                      >
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-snug truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notification.summary}
                        </p>
                        <span className="text-[11px] font-medium text-gray-400 mt-1 block">
                          {notification.time}
                        </span>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-[#CD2C58] mt-1.5 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </Popover>

        <div className="hidden sm:block h-8 w-px bg-gray-200" />

        <DropdownMenu
          align="right"
          trigger={
            <div className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="text-right hidden md:block min-w-0">
                <Body size="sm" className="font-bold leading-none truncate max-w-[10rem]">
                  {userName || "Guest User"}
                </Body>
                <Body size="sm" muted className="leading-none mt-1 text-xs">
                  Verified Account
                </Body>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#CD2C58]/10 group-hover:text-[#CD2C58] transition-all shrink-0">
                <FaUserCircle size={22} />
              </div>
            </div>
          }
          items={[
            {
              label: "Profile",
              href: PROFILE_HREF[role],
              icon: <FaUser size={14} />,
            },
            {
              label: "Logout",
              onClick: handleLogout,
              icon: <FaSignOutAlt size={14} />,
              variant: "danger",
            },
          ]}
        />
      </div>

      <Modal
        isOpen={!!activeNotification}
        onClose={() => setActiveNotification(null)}
        title={activeNotification?.title}
        size="sm"
        footer={
          activeNotification?.ctas && activeNotification.ctas.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              {activeNotification.ctas.map((cta) => (
                <Link
                  key={cta.href + cta.label}
                  href={cta.href}
                  onClick={() => setActiveNotification(null)}
                  className={clsx(
                    "inline-flex items-center justify-center rounded-sm px-6 py-2.5 text-sm font-medium transition-colors text-center",
                    cta.variant === "secondary"
                      ? "border border-black bg-transparent text-gray-800 hover:bg-dark/10"
                      : "bg-[#1a1a1a] text-white hover:bg-[#CD2C58]",
                  )}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          ) : undefined
        }
      >
        {activeNotification && (
          <div className="space-y-2">
            <Body className="text-sm leading-relaxed">
              {activeNotification.message}
            </Body>
            <Body muted className="text-xs">
              {activeNotification.time}
            </Body>
          </div>
        )}
      </Modal>
    </header>
  );
};
