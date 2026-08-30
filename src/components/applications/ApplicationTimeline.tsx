"use client";

import React, { useEffect, useState } from "react";
import { ApplicationEvent } from "@/types/api";
import { api } from "@/lib/api";
import { StatusBadge } from "../common/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { History, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface ApplicationTimelineProps {
  applicationId: string;
  refreshTrigger?: number;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  applicationId,
  refreshTrigger,
}) => {
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.getApplicationEvents(applicationId);
        if (mounted) {
          setEvents(res.data || []);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load timeline events");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEvents();
    return () => {
      mounted = false;
    };
  }, [applicationId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        <span className="text-xs">Loading activity timeline...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs">
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-6 text-center text-slate-400 dark:text-zinc-500 text-xs">
        No activity events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800">
      {events.map((event, idx) => {
        return (
          <div key={event.id || idx} className="relative group">
            {/* Timeline bullet dot */}
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-600 ring-4 ring-slate-50 dark:ring-zinc-950 shrink-0" />

            <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-xl p-3.5 border border-slate-200/60 dark:border-zinc-800 transition-all">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {event.old_status ? (
                  <>
                    <StatusBadge
                      status={event.old_status}
                      size="sm"
                      showDot={false}
                    />
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400">
                    Created as
                  </span>
                )}
                <StatusBadge status={event.new_status} size="sm" />
              </div>

              {event.note && (
                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 font-normal">
                  {event.note}
                </p>
              )}

              <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2">
                {formatDateTime(event.created_at)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
