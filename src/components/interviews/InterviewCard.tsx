"use client";

import React from "react";
import { Interview } from "@/types/api";
import { InterviewBadge } from "../common/InterviewBadge";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  Building2,
} from "lucide-react";

interface InterviewCardProps {
  interview: Interview;
  onEdit?: (interview: Interview) => void;
  onDelete?: (interview: Interview) => void;
  showApplicationContext?: boolean;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onEdit,
  onDelete,
  showApplicationContext = false,
}) => {
  const isUpcoming = new Date(interview.scheduled_at).getTime() > Date.now();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <InterviewBadge type={interview.type} size="md" />
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isUpcoming
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {isUpcoming ? "Upcoming" : "Completed"}
            </span>
          </div>

          {showApplicationContext && interview.application && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-200 pt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{interview.application.company}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-normal">
                {interview.application.position}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(interview)}
              title="Edit Interview"
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(interview)}
              title="Cancel Interview"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Date & Time info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-zinc-300 my-3 bg-slate-50/80 dark:bg-zinc-950/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="font-semibold">
            {formatDateTime(interview.scheduled_at)}
          </span>
        </div>

        {interview.duration_minutes && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500 shrink-0" />
            <span>{interview.duration_minutes} minutes duration</span>
          </div>
        )}

        {interview.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">{interview.location}</span>
          </div>
        )}

        <div className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1">
          <span>{formatRelativeTime(interview.scheduled_at)}</span>
        </div>
      </div>

      {/* Notes */}
      {interview.notes && (
        <div className="mt-2 text-xs text-slate-600 dark:text-zinc-400 flex items-start gap-2 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-slate-100 dark:border-zinc-800/80">
          <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span className="line-clamp-2">{interview.notes}</span>
        </div>
      )}

      {/* Bottom meeting launcher */}
      {interview.meeting_url && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Meeting Link</span>
          <a
            href={interview.meeting_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-indigo-500/20 transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Meeting</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      )}
    </div>
  );
};
