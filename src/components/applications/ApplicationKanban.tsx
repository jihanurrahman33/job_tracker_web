"use client";

import React from "react";
import {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LIST,
} from "@/types/api";
import { STATUS_CONFIG } from "@/lib/constants";
import { ApplicationCard } from "./ApplicationCard";
import { Plus } from "lucide-react";

interface ApplicationKanbanProps {
  applications: Application[];
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onScheduleInterview: (app: Application) => void;
  onQuickAdd: (status: ApplicationStatus) => void;
  onStatusChange: (app: Application, newStatus: string) => void;
}

export const ApplicationKanban: React.FC<ApplicationKanbanProps> = ({
  applications,
  onView,
  onEdit,
  onDelete,
  onScheduleInterview,
  onQuickAdd,
  onStatusChange,
}) => {
  // Group applications by status
  const groupedApps: Record<ApplicationStatus, Application[]> = {
    APPLIED: [],
    SCREENING: [],
    INTERVIEW: [],
    TECHNICAL_INTERVIEW: [],
    OFFER: [],
    ACCEPTED: [],
    REJECTED: [],
    WITHDRAWN: [],
  };

  applications.forEach((app) => {
    if (groupedApps[app.status]) {
      groupedApps[app.status].push(app);
    } else {
      groupedApps["APPLIED"].push(app);
    }
  });

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start min-h-[600px] scrollbar-thin">
      {APPLICATION_STATUS_LIST.map((status) => {
        const config = STATUS_CONFIG[status];
        const columnApps = groupedApps[status] || [];

        return (
          <div
            key={status}
            className="flex-shrink-0 w-72 sm:w-80 bg-slate-100/70 dark:bg-zinc-900/50 rounded-2xl p-3 border border-slate-200/60 dark:border-zinc-800/60 flex flex-col max-h-[calc(100vh-210px)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-zinc-200">
                  {config.label}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                  {columnApps.length}
                </span>
              </div>

              <button
                onClick={() => onQuickAdd(status)}
                title={`Add application to ${config.label}`}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Applications Cards Stack */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {columnApps.map((app) => (
                <div key={app.id} className="relative">
                  <ApplicationCard
                    application={app}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onScheduleInterview={onScheduleInterview}
                    onStatusChange={onStatusChange}
                  />

                  {/* Quick move dropdown selector */}
                  <div className="mt-1.5 px-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Move to:</span>
                    <select
                      value={app.status}
                      onChange={(e) => onStatusChange(app, e.target.value)}
                      className="text-[11px] font-medium bg-transparent text-slate-600 dark:text-zinc-300 border-none outline-none cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 py-0 pr-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {APPLICATION_STATUS_LIST.map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-white dark:bg-zinc-900"
                        >
                          {STATUS_CONFIG[s]?.label || s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {columnApps.length === 0 && (
                <div className="p-6 text-center border-2 border-dashed border-slate-200/60 dark:border-zinc-800/60 rounded-xl">
                  <p className="text-xs text-slate-400 dark:text-zinc-500">
                    No applications
                  </p>
                  <button
                    onClick={() => onQuickAdd(status)}
                    className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add New
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
