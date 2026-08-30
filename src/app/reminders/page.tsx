"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Reminder, Application } from "@/types/api";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Bell,
  Clock,
  CheckCircle2,
  ListTodo,
  Search,
  Plus,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";

export default function RemindersPage() {
  const { success, error } = useToast();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [applications, setApplications] = useState<Record<string, Application>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [tab, setTab] = useState<"pending" | "completed" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setIsLoading(true);
      const [remRes, appsRes] = await Promise.all([
        api.listReminders().catch(() => ({ data: [] })),
        api.listApplications({ limit: 100 }).catch(() => ({ data: [] })),
      ]);

      const appsMap: Record<string, Application> = {};
      (appsRes.data || []).forEach((app) => {
        appsMap[app.id] = app;
      });
      setApplications(appsMap);

      const items = (remRes.data || []).map((r) => ({
        ...r,
        application: r.application_id ? appsMap[r.application_id] : undefined,
      }));

      // Sort by remind_at
      items.sort(
        (a, b) =>
          new Date(a.remind_at).getTime() - new Date(b.remind_at).getTime(),
      );
      setReminders(items);
    } catch (err: any) {
      error("Failed to load reminders", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteReminder(deleteTarget.id);
      success("Reminder deleted", "The reminder has been removed.");
      setDeleteTarget(null);
      fetchReminders();
    } catch (err: any) {
      error("Failed to delete reminder", err.message);
    }
  };

  const handleToggle = (updated: Reminder) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === updated.id ? { ...updated, application: r.application } : r,
      ),
    );
  };

  // Filtered
  const filteredReminders = reminders.filter((item) => {
    if (tab === "pending" && item.completed) return false;
    if (tab === "completed" && !item.completed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description?.toLowerCase().includes(q);
      const appMatch = item.application?.company.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !appMatch) return false;
    }

    return true;
  });

  const pendingCount = reminders.filter((r) => !r.completed).length;
  const completedCount = reminders.filter((r) => r.completed).length;
  const overdueCount = reminders.filter(
    (r) => !r.completed && new Date(r.remind_at).getTime() < Date.now(),
  ).length;

  return (
    <AppLayout
      title="Reminders & Follow-up Tasks"
      onRefreshData={fetchReminders}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            Follow-up Reminders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Never miss a recruiter email, portfolio follow-up, or take-home
            deadline
          </p>
        </div>

        <button
          onClick={() => {
            setEditingReminder(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Toolbar: Tabs & Search */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold self-start">
            <button
              onClick={() => setTab("pending")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                tab === "pending"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px]">
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setTab("completed")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                tab === "completed"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px]">
                {completedCount}
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
              <ListTodo className="w-3.5 h-3.5" />
              <span>All ({reminders.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reminder title, notes..."
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
        </div>
      </div>

      {/* Overdue alert banner if any */}
      {overdueCount > 0 && tab !== "completed" && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              You have{" "}
              <strong className="font-bold">
                {overdueCount} overdue follow-up item(s)
              </strong>{" "}
              that need attention!
            </span>
          </div>
        </div>
      )}

      {/* Grid of Reminder Cards */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">
            Loading reminders & follow-ups...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredReminders.map((item) => (
            <ReminderCard
              key={item.id}
              reminder={item}
              showApplicationContext={true}
              onEdit={(r) => {
                setEditingReminder(r);
                setIsModalOpen(true);
              }}
              onDelete={(r) => setDeleteTarget(r)}
              onToggleStatus={handleToggle}
            />
          ))}

          {filteredReminders.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/40">
              <Bell className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">
                No reminders found
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto mb-4">
                {tab === "pending"
                  ? "Awesome! You have completed all your pending reminders."
                  : "No reminders match your current view and search filter."}
              </p>
              <button
                onClick={() => {
                  setEditingReminder(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all"
              >
                + Add New Reminder
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ReminderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reminder={editingReminder}
        onSuccess={fetchReminders}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Reminder"
        message="Are you sure you want to permanently delete this reminder?"
        isDestructive
        confirmText="Delete Reminder"
      />
    </AppLayout>
  );
}
