"use client";

import React from "react";
import { Application } from "@/types/api";
import { StatusBadge } from "../common/StatusBadge";
import { formatSalary, formatDate } from "@/lib/utils";
import {
  Building2,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  CalendarPlus,
  ArrowUpDown,
  Eye,
} from "lucide-react";

interface ApplicationTableProps {
  applications: Application[];
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onScheduleInterview: (app: Application) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onView,
  onEdit,
  onDelete,
  onScheduleInterview,
  sortField,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => onSort && onSort("company")}
            >
              <div className="flex items-center gap-1.5">
                <span>Company & Role</span>
                <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
              </div>
            </th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 hidden md:table-cell">Location</th>
            <th className="py-3.5 px-4 hidden lg:table-cell">Salary Range</th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => onSort && onSort("applied_at")}
            >
              <div className="flex items-center gap-1.5">
                <span>Applied Date</span>
                <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
              </div>
            </th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-sm">
          {applications.map((app) => (
            <tr
              key={app.id}
              onClick={() => onView(app)}
              className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer group"
            >
              {/* Company & Role */}
              <td className="py-3.5 px-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {app.company.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {app.position}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <span>{app.company}</span>
                      {app.job_url && (
                        <a
                          href={app.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-indigo-600"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <StatusBadge status={app.status} size="sm" />
              </td>

              {/* Location */}
              <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-600 dark:text-zinc-400">
                {app.location ? (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.location}</span>
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>

              {/* Salary */}
              <td className="py-3.5 px-4 hidden lg:table-cell text-xs font-medium text-slate-700 dark:text-zinc-300">
                {formatSalary(
                  app.salary_min,
                  app.salary_max,
                  app.salary_currency || "USD",
                )}
              </td>

              {/* Date */}
              <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                {app.applied_at
                  ? formatDate(app.applied_at)
                  : formatDate(app.created_at)}
              </td>

              {/* Actions */}
              <td
                className="py-3.5 px-4 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(app)}
                    title="View Details"
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onScheduleInterview(app)}
                    title="Schedule Interview"
                    className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(app)}
                    title="Edit Application"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(app)}
                    title="Delete Application"
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {applications.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-12 text-center text-slate-400 dark:text-zinc-500 text-sm"
              >
                No job applications match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
