"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaShieldAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { UserRole } from "@/types/user";
import { twMerge } from "tailwind-merge";
import {
  BiCar,
  BiCreditCard,
  BiEnvelope,
  BiHome,
  BiUser,
} from "react-icons/bi";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface DashboardSidebarProps {
  role: UserRole;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role,
  mobileOpen = false,
  onMobileClose,
}) => {
  const pathname = usePathname();

  const navItems: Record<UserRole, NavItem[]> = {
    [UserRole.PERSONAL]: [
      { label: "Overview", href: "/dashboard/personal", icon: BiHome },
      {
        label: "My Listings",
        href: "/dashboard/personal/listings",
        icon: BiCar,
      },
      {
        label: "Enquiries",
        href: "/dashboard/personal/messages",
        icon: BiEnvelope,
      },
      {
        label: "Subscription",
        href: "/dashboard/personal/subscription",
        icon: BiCreditCard,
      },
      { label: "Profile", href: "/dashboard/personal/profile", icon: BiUser },
    ],
    [UserRole.DEALER]: [
      { label: "Overview", href: "/dashboard/dealer", icon: BiHome },
      { label: "Inventory", href: "/dashboard/dealer/listings", icon: BiCar },
      {
        label: "Enquiries",
        href: "/dashboard/dealer/leads",
        icon: BiEnvelope,
      },
      {
        label: "Subscription",
        href: "/dashboard/dealer/subscription",
        icon: BiCreditCard,
      },
      { label: "Profile", href: "/dashboard/dealer/profile", icon: BiUser },
    ],
    [UserRole.ADMIN]: [
      { label: "Overview", href: "/dashboard/admin", icon: BiHome },
      { label: "Users", href: "/dashboard/admin/users", icon: BiUser },
      {
        label: "All Listings",
        href: "/dashboard/admin/listings",
        icon: BiCar,
      },
      {
        label: "Payments",
        href: "/dashboard/admin/payments",
        icon: BiCreditCard,
      },
      {
        label: "Fraud Detection",
        href: "/dashboard/admin/fraud",
        icon: FaShieldAlt,
      },
      { label: "Reports", href: "/dashboard/admin/reports", icon: FaFileAlt },
    ],
  };

  const items = navItems[role] || [];

  const handleLogout = async () => {
    const { logoutUser } = await import("@/lib/auth/actions");
    await logoutUser();
  };

  return (
    <aside
      className={twMerge(
        "bg-white border-r border-gray-200 flex flex-col z-50",
        // Mobile: fixed drawer
        "fixed inset-y-0 left-0 w-[min(18rem,85vw)] h-[100dvh] transform transition-transform duration-300 ease-out",
        mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        // Desktop: static column
        "lg:static lg:translate-x-0 lg:w-64 lg:h-dvh lg:sticky lg:top-0 lg:shadow-none lg:shrink-0",
      )}
    >
      <div className="p-4 sm:p-6 flex items-start justify-between gap-2">
        <Link
          href={`/dashboard/${role}`}
          className="block min-w-0 flex-1"
          onClick={onMobileClose}
        >
          <Image
            src="/logo.svg"
            alt="Khazu.co Logo"
            width={140}
            height={40}
            className="w-auto h-8 sm:h-9 object-contain object-left"
            priority
          />
        </Link>
        <button
          type="button"
          onClick={onMobileClose}
          className="lg:hidden p-2 -mr-1 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Close navigation"
        >
          <FaTimes size={18} />
        </button>
      </div>

      <div className="px-4 sm:px-6 -mt-2 mb-3">
        <span className="inline-flex text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#CD2C58] text-white">
          {role} Portal
        </span>
      </div>

      <nav className="flex-1 px-3 sm:px-4 space-y-0.5 overflow-y-auto custom-scrollbar pb-4">
        {items.map((item) => {
          const isRoot =
            item.href === "/dashboard/personal" ||
            item.href === "/dashboard/dealer" ||
            item.href === "/dashboard/admin";
          const isActive = isRoot
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={twMerge(
                "flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all text-sm sm:text-base",
                isActive
                  ? "bg-[#1a1a1a] text-white font-bold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium",
              )}
            >
              <item.icon size={20} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t border-gray-100 safe-area-pb">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 w-full transition-all"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
