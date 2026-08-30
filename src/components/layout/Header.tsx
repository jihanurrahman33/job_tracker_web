"use client";

import React, { useState } from "react";
import {
  Menu,
  Plus,
  Briefcase,
  Calendar,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApplicationFormModal } from "../applications/ApplicationFormModal";
import { ReminderFormModal } from "../reminders/ReminderFormModal";
import { InterviewFormModal } from "../interviews/InterviewFormModal";

interface HeaderProps {
  onOpenSidebar: () => void;
  title?: string;
  onRefreshData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  title,
  onRefreshData,
}) => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const handleModalSuccess = () => {
    if (onRefreshData) {
      onRefreshData();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
              {title || "Dashboard"}
            </h1>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create New</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 py-2 z-50 animate-slide-up">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Quick Actions
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsAppModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">
                        New Application
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                        Track a new job opportunity
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsInterviewModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-400 text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">
                        Schedule Interview
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                        Add an interview round
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsReminderModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">New Reminder</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                        Add task or follow-up
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Global Action Modals */}
      <ApplicationFormModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <InterviewFormModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};
