"use client";

import React, { useState } from "react";
import { Reminder } from "@/types/api";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Building2,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";

interface ReminderCardProps {
  reminder: Reminder;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (reminder: Reminder) => void;
  onToggleStatus?: (updated: Reminder) => void;
  showApplicationContext?: boolean;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onDelete,
  onToggleStatus,
  showApplicationContext = true,
}) => {
  const { success, error } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  const isOverdue =
    !reminder.completed && new Date(reminder.remind_at).getTime() < Date.now();

  const handleToggleCompleted = async () => {
    try {
      setIsToggling(true);
      const updated = await api.updateReminder(reminder.id, {
        completed: !reminder.completed,
      });
      success(
        updated.completed ? "Reminder completed!" : "Reminder reopened",
        updated.title,
      );
      if (onToggleStatus) {
        onToggleStatus(updated);
      }
    } catch (err: any) {
      error("Failed to update status", err.message);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs flex items-start gap-3.5 ${
        reminder.completed
          ? "bg-slate-50/70 dark:bg-zinc-900/40 border-slate-200/60 dark:border-zinc-800/60 opacity-75"
          : isOverdue
            ? "bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
            : "bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:shadow-md"
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggleCompleted}
        disabled={isToggling}
        className={`mt-0.5 shrink-0 transition-transform hover:scale-110 ${
          reminder.completed
            ? "text-emerald-600 dark:text-emerald-400"
            : isOverdue
              ? "text-rose-500 dark:text-rose-400 hover:text-emerald-600"
              : "text-slate-400 dark:text-zinc-500 hover:text-indigo-600"
        }`}
      >
        {reminder.completed ? (
          <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-sm font-bold tracking-tight ${
              reminder.completed
                ? "line-through text-slate-400 dark:text-zinc-500"
                : "text-slate-900 dark:text-zinc-100"
            }`}
          >
            {reminder.title}
          </h4>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(reminder)}
                title="Edit Reminder"
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(reminder)}
                title="Delete Reminder"
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {reminder.description && (
          <p
            className={`text-xs mt-1 leading-relaxed ${
              reminder.completed
                ? "text-slate-400 dark:text-zinc-500 line-through"
                : "text-slate-600 dark:text-zinc-400"
            }`}
          >
            {reminder.description}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {/* Due date */}
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border font-medium ${
              isOverdue
                ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700"
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
            ) : (
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            )}
            <span>{formatDateTime(reminder.remind_at)}</span>
            <span className="text-[10px] opacity-75">
              ({formatRelativeTime(reminder.remind_at)})
            </span>
          </div>

          {/* Linked Application */}
          {showApplicationContext && reminder.application && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-900/50 font-medium">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[140px]">
                {reminder.application.company}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
