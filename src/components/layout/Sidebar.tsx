"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Wordmark } from "@/components/landing/Wordmark";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Applications",
      href: "/applications",
      icon: Briefcase,
      active: pathname.startsWith("/applications"),
    },
    {
      name: "Interviews",
      href: "/interviews",
      icon: Calendar,
      active: pathname.startsWith("/interviews"),
    },
    {
      name: "Reminders",
      href: "/reminders",
      icon: Bell,
      active: pathname.startsWith("/reminders"),
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/analytics"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
    // Only shown to admins. The API checks the role on every admin request.
    ...(user?.role === "admin"
      ? [
          {
            name: "Admin",
            href: "/admin",
            icon: ShieldCheck,
            active: pathname.startsWith("/admin"),
          },
        ]
      : []),
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 flex w-64 flex-col bg-ink text-paper transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center px-6">
          <Link href="/" onClick={onClose} aria-label="JobTracker home">
            <Wordmark className="text-paper" />
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={item.active ? "page" : undefined}
                className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] transition-colors ${
                  item.active
                    ? "bg-paper/10 font-semibold text-white"
                    : "text-paper/70 hover:bg-paper/5 hover:text-white"
                }`}
              >
                {item.active && (
                  <span className="absolute -left-3 top-1.5 bottom-1.5 w-1 rounded-r bg-marker" />
                )}
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-paper/10 p-4">
          {user && (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-paper/60">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
                className="rounded-md p-2 text-paper/70 hover:bg-paper/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
