"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LIST,
} from "@/types/api";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { STATUS_CONFIG } from "@/lib/constants";
import { ApplicationKanban } from "@/components/applications/ApplicationKanban";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationFormModal } from "@/components/applications/ApplicationFormModal";
import { ApplicationDetailModal } from "@/components/applications/ApplicationDetailModal";
import { InterviewFormModal } from "@/components/interviews/InterviewFormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Kanban,
  Table as TableIcon,
  Search,
  Filter,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

export default function ApplicationsPage() {
  const { success, error } = useToast();

  // Data states
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Filters & Query
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortField, setSortField] = useState("-applied_at");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [quickAddStatus, setQuickAddStatus] =
    useState<ApplicationStatus>("APPLIED");
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [scheduleForAppId, setScheduleForAppId] = useState<string | undefined>(
    undefined,
  );

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const query: any = {
        page,
        limit,
        sort: sortField,
      };

      if (selectedStatus) query.status = selectedStatus;
      if (searchQuery.trim()) query.company = searchQuery.trim();
      if (locationQuery.trim()) query.location = locationQuery.trim();
      if (fromDate) query.from = fromDate;
      if (toDate) query.to = toDate;

      const res = await api.listApplications(query);
      setApplications(res.data || []);
      if (res.pagination) {
        setTotal(res.pagination.total || 0);
        setTotalPages(res.pagination.total_pages || 1);
      } else {
        setTotal((res.data || []).length);
        setTotalPages(1);
      }
    } catch (err: any) {
      error("Failed to load applications", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    sortField,
    selectedStatus,
    searchQuery,
    locationQuery,
    fromDate,
    toDate,
    error,
  ]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (app: Application, newStatus: string) => {
    try {
      // Optimistic update
      setApplications((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, status: newStatus as ApplicationStatus }
            : a,
        ),
      );

      const updated = await api.updateApplication(app.id, {
        status: newStatus as ApplicationStatus,
      });
      success(
        "Status updated",
        `${updated.company} is now ${STATUS_CONFIG[newStatus as ApplicationStatus]?.label || newStatus}`,
      );
      fetchApplications();
    } catch (err: any) {
      error("Failed to update status", err.message);
      fetchApplications();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteApplication(deleteTarget.id);
      success("Application deleted", `${deleteTarget.company} was removed.`);
      setDeleteTarget(null);
      fetchApplications();
    } catch (err: any) {
      error("Failed to delete", err.message);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setLocationQuery("");
    setFromDate("");
    setToDate("");
    setSortField("-applied_at");
    setPage(1);
  };

  const activeFiltersCount = [
    selectedStatus,
    locationQuery,
    fromDate,
    toDate,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <AppLayout title="Applications Pipeline" onRefreshData={fetchApplications}>
      {/* Top Toolbar */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company or position..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-zinc-100 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right actions: Filter button, View switcher, New Application */}
          <div className="flex items-center gap-2.5">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showFilters || activeFiltersCount > 0
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                  : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Switcher */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setViewMode("kanban")}
                title="Kanban Board View"
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
                }`}
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                title="Table View"
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* New Application Button */}
            <button
              onClick={() => {
                setEditingApp(null);
                setQuickAddStatus("APPLIED");
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Application</span>
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm animate-slide-up space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Status filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-medium text-slate-900 dark:text-zinc-100 outline-none"
                >
                  <option value="">All Statuses</option>
                  {APPLICATION_STATUS_LIST.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_CONFIG[st]?.label || st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote, NY"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>

              {/* Date From */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Applied From
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Applied To
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            {/* Filter Reset Button */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-zinc-800">
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main View Area */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">
            Loading applications pipeline...
          </span>
        </div>
      ) : viewMode === "kanban" ? (
        <ApplicationKanban
          applications={applications}
          onView={(app) => setViewingApp(app)}
          onEdit={(app) => {
            setEditingApp(app);
            setIsFormModalOpen(true);
          }}
          onDelete={(app) => setDeleteTarget(app)}
          onScheduleInterview={(app) => {
            setScheduleForAppId(app.id);
            setIsInterviewModalOpen(true);
          }}
          onQuickAdd={(st) => {
            setEditingApp(null);
            setQuickAddStatus(st);
            setIsFormModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="space-y-4">
          <ApplicationTable
            applications={applications}
            onView={(app) => setViewingApp(app)}
            onEdit={(app) => {
              setEditingApp(app);
              setIsFormModalOpen(true);
            }}
            onDelete={(app) => setDeleteTarget(app)}
            onScheduleInterview={(app) => {
              setScheduleForAppId(app.id);
              setIsInterviewModalOpen(true);
            }}
            sortField={sortField}
            onSort={(field) => {
              setSortField((current) =>
                current === field ? `-${field}` : field,
              );
            }}
          />

          {/* Pagination bar for table view */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-3">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages} ({total} applications)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ApplicationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        application={editingApp}
        defaultStatus={quickAddStatus}
        onSuccess={fetchApplications}
      />

      <ApplicationDetailModal
        isOpen={!!viewingApp}
        onClose={() => setViewingApp(null)}
        application={viewingApp}
        onEdit={(a) => {
          setViewingApp(null);
          setEditingApp(a);
          setIsFormModalOpen(true);
        }}
        onDelete={(a) => {
          setViewingApp(null);
          setDeleteTarget(a);
        }}
        onUpdate={(updated) => {
          setViewingApp(updated);
          fetchApplications();
        }}
      />

      <InterviewFormModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        applicationId={scheduleForAppId}
        onSuccess={fetchApplications}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Job Application"
        message={`Are you sure you want to permanently delete the application for ${deleteTarget?.position} at ${deleteTarget?.company}?`}
        isDestructive
        confirmText="Delete Application"
      />
    </AppLayout>
  );
}
