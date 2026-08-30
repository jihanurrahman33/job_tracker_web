"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Interview,
  InterviewType,
  INTERVIEW_TYPE_LIST,
  Application,
} from "@/types/api";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { INTERVIEW_TYPE_CONFIG } from "@/lib/constants";
import { InterviewCard } from "@/components/interviews/InterviewCard";
import { InterviewFormModal } from "@/components/interviews/InterviewFormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  CalendarDays,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function InterviewsPage() {
  const { success, error } = useToast();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Record<string, Application>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [tab, setTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<Interview | null>(null);

  const fetchInterviews = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch applications first to correlate
      const appsRes = await api
        .listApplications({ limit: 100 })
        .catch(() => ({ data: [] }));
      const appsMap: Record<string, Application> = {};
      (appsRes.data || []).forEach((a) => {
        appsMap[a.id] = a;
      });
      setApplications(appsMap);

      // Fetch interviews for each application
      const interviewPromises = (appsRes.data || []).map((app) =>
        api
          .listInterviewsByApplication(app.id)
          .then((res) => {
            return (res.data || []).map((i) => ({
              ...i,
              application: app,
            }));
          })
          .catch(() => []),
      );

      const nested = await Promise.all(interviewPromises);
      const all = nested.flat();
      all.sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime(),
      );
      setInterviews(all);
    } catch (err: any) {
      error("Failed to load interviews", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteInterview(deleteTarget.id);
      success(
        "Interview deleted",
        "Interview round was removed from your schedule.",
      );
      setDeleteTarget(null);
      fetchInterviews();
    } catch (err: any) {
      error("Failed to delete interview", err.message);
    }
  };

  // Filtered interviews
  const now = Date.now();
  const filteredInterviews = interviews.filter((item) => {
    const interviewTime = new Date(item.scheduled_at).getTime();
    if (tab === "upcoming" && interviewTime < now) return false;
    if (tab === "past" && interviewTime >= now) return false;

    if (selectedType && item.type !== selectedType) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const companyMatch = item.application?.company.toLowerCase().includes(q);
      const roleMatch = item.application?.position.toLowerCase().includes(q);
      const notesMatch = item.notes?.toLowerCase().includes(q);
      const locationMatch = item.location?.toLowerCase().includes(q);
      if (!companyMatch && !roleMatch && !notesMatch && !locationMatch)
        return false;
    }

    return true;
  });

  const upcomingCount = interviews.filter(
    (i) => new Date(i.scheduled_at).getTime() >= now,
  ).length;
  const pastCount = interviews.filter(
    (i) => new Date(i.scheduled_at).getTime() < now,
  ).length;

  return (
    <AppLayout
      title="Interviews Calendar & Schedule"
      onRefreshData={fetchInterviews}
    >
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            Interview Rounds
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Manage coding rounds, recruiter screens, system designs, and final
            presentations
          </p>
        </div>

        <button
          onClick={() => {
            setEditingInterview(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Tabs & Search / Filter Toolbar */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold self-start">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                tab === "upcoming"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Upcoming</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px]">
                {upcomingCount}
              </span>
            </button>

            <button
              onClick={() => setTab("past")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                tab === "past"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Past / Completed</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-[10px]">
                {pastCount}
              </span>
            </button>

            <button
              onClick={() => setTab("all")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                tab === "all"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>All ({interviews.length})</span>
            </button>
          </div>

          {/* Search & Type filter */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Interview Types</option>
              {INTERVIEW_TYPE_LIST.map((t) => (
                <option key={t} value={t}>
                  {INTERVIEW_TYPE_CONFIG[t]?.label || t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Interview Cards */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">
            Loading scheduled interviews...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredInterviews.map((item) => (
            <InterviewCard
              key={item.id}
              interview={item}
              showApplicationContext={true}
              onEdit={(it) => {
                setEditingInterview(it);
                setIsModalOpen(true);
              }}
              onDelete={(it) => setDeleteTarget(it)}
            />
          ))}

          {filteredInterviews.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/40">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">
                No interviews found
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto mb-4">
                {tab === "upcoming"
                  ? "You have no upcoming interview rounds scheduled at the moment."
                  : "No interview rounds match your active search and filter criteria."}
              </p>
              <button
                onClick={() => {
                  setEditingInterview(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all"
              >
                + Schedule Interview Round
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <InterviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        interview={editingInterview}
        onSuccess={fetchInterviews}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Cancel Interview Round"
        message="Are you sure you want to cancel and delete this interview round?"
        isDestructive
        confirmText="Cancel Interview"
      />
    </AppLayout>
  );
}
