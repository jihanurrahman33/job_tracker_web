import React from "react";
import { APPLICATION_STATUS_LIST, ApplicationStatus } from "@/types/api";
import { STATUS_CONFIG } from "@/lib/constants";

interface StatusDistributionBarProps {
  byStatus: Record<string, number>;
  total: number;
}

export const StatusDistributionBar: React.FC<StatusDistributionBarProps> = ({
  byStatus,
  total,
}) => {
  if (total === 0) {
    return (
      <div className="py-4 text-center text-xs text-slate-400">
        No application data to display yet.
      </div>
    );
  }

  const statusColors: Record<ApplicationStatus, string> = {
    APPLIED: "bg-blue-500",
    SCREENING: "bg-amber-500",
    INTERVIEW: "bg-purple-500",
    TECHNICAL_INTERVIEW: "bg-indigo-500",
    OFFER: "bg-emerald-500",
    ACCEPTED: "bg-teal-500",
    REJECTED: "bg-rose-500",
    WITHDRAWN: "bg-slate-400",
  };

  return (
    <div className="space-y-4">
      {/* Progress Multi-Bar */}
      <div className="h-3.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full flex overflow-hidden shadow-inner gap-0.5 p-0.5">
        {APPLICATION_STATUS_LIST.map((status) => {
          const count = byStatus[status] || 0;
          if (count === 0) return null;
          const percentage = (count / total) * 100;

          return (
            <div
              key={status}
              title={`${STATUS_CONFIG[status]?.label || status}: ${count} (${Math.round(percentage)}%)`}
              className={`h-full rounded-sm transition-all hover:opacity-85 cursor-pointer ${statusColors[status]}`}
              style={{ width: `${percentage}%` }}
            />
          );
        })}
      </div>

      {/* Legend & Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {APPLICATION_STATUS_LIST.map((status) => {
          const count = byStatus[status] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          const config = STATUS_CONFIG[status];

          return (
            <div
              key={status}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800/80"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dot}`}
                />
                <span className="text-slate-700 dark:text-zinc-300 font-medium truncate">
                  {config.label}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  {count}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
