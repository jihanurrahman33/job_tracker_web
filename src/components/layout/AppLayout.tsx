"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  onRefreshData?: () => void;
}

const PUBLIC_PATHS = ["/login", "/register"];

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  onRefreshData,
}) => {
  const { isLoading, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Connecting to Job Tracker...</p>
      </div>
    );
  }

  if (isPublic) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!isAuthenticated) {
    return null; // Route protection handled in AuthContext
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex text-slate-900 dark:text-zinc-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title={title}
          onRefreshData={onRefreshData}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
