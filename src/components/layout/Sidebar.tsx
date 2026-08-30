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
  LogOut,
  Sparkles,
  Server,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useServer } from "@/context/ServerContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isOnline, isChecking } = useServer();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
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
      name: "Settings & API",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800/80 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-zinc-800/80">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={onClose}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight text-base flex items-center gap-1.5">
                JobTracker
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                  PRO
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    item.active
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 dark:text-zinc-500"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Server Status Badge & User Info Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-3">
          {/* Server status pill */}
          <Link
            href="/settings"
            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 hover:border-indigo-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>Server API</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  isChecking
                    ? "bg-amber-400 animate-ping"
                    : isOnline
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                }`}
              />
              <span
                className={`text-[11px] ${
                  isChecking
                    ? "text-amber-500"
                    : isOnline
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {isChecking ? "Checking..." : isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </Link>

          {/* User profile widget */}
          {user && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-zinc-200 truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
