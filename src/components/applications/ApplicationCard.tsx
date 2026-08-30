"use client";

import React from "react";
import { Application } from "@/types/api";
import { StatusBadge } from "../common/StatusBadge";
import { formatSalary, formatDate } from "@/lib/utils";
import {
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  CalendarPlus,
  ArrowRight,
} from "lucide-react";

interface ApplicationCardProps {
  application: Application;
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onScheduleInterview?: (app: Application) => void;
  onStatusChange?: (app: Application, newStatus: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onView,
  onEdit,
  onDelete,
  onScheduleInterview,
}) => {
  return (
    <div
      onClick={() => onView(application)}
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top: Status Badge + Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={application.status} size="sm" />

          <div
            className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {onScheduleInterview && (
              <button
                onClick={() => onScheduleInterview(application)}
                title="Schedule Interview"
                className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onEdit(application)}
              title="Edit Application"
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(application)}
              title="Delete Application"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Position & Company */}
        <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {application.position}
        </h4>
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-zinc-400 mt-1">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{application.company}</span>
          {application.job_url && (
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 ml-1 inline-flex items-center"
              title="Open job posting"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Metadata Details */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
          {application.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{application.location}</span>
            </div>
          )}

          {(application.salary_min || application.salary_max) && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span>
                {formatSalary(
                  application.salary_min,
                  application.salary_max,
                  application.salary_currency || "USD",
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Applied Date */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {application.applied_at
              ? `Applied ${formatDate(application.applied_at)}`
              : `Added ${formatDate(application.created_at)}`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
