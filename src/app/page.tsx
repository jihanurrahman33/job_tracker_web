"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Application, Statistics, Interview, Reminder } from "@/types/api";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MetricCard } from "@/components/statistics/MetricCard";
import { StatusDistributionBar } from "@/components/statistics/StatusDistributionBar";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationFormModal } from "@/components/applications/ApplicationFormModal";
import { ApplicationDetailModal } from "@/components/applications/ApplicationDetailModal";
import { InterviewCard } from "@/components/interviews/InterviewCard";
import { InterviewFormModal } from "@/components/interviews/InterviewFormModal";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatPercent } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Bell,
  ArrowRight,
  Plus,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<Statistics | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [deleteAppTarget, setDeleteAppTarget] = useState<Application | null>(
    null,
  );

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(
    null,
  );
  const [scheduleForAppId, setScheduleForAppId] = useState<string | undefined>(
    undefined,
  );

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsRes, appsRes, remindersRes] = await Promise.all([
        api.getStatistics().catch(() => null),
        api
          .listApplications({ limit: 10, sort: "-applied_at" })
          .catch(() => ({ data: [] })),
        api.listReminders().catch(() => ({ data: [] })),
      ]);

      if (statsRes) setStats(statsRes);
      const loadedApps = (appsRes as any)?.data || [];
      setApplications(loadedApps);

      const loadedReminders = (remindersRes as any)?.data || [];
      setReminders(loadedReminders);

      // Fetch interviews for top applications
      const interviewPromises = loadedApps.slice(0, 5).map((app: Application) =>
        api
          .listInterviewsByApplication(app.id)
          .then((res) => {
            return (res.data || []).map((i) => ({ ...i, application: app }));
          })
          .catch(() => []),
      );
      const allInterviewsNested = await Promise.all(interviewPromises);
      const flatInterviews = allInterviewsNested.flat();
      // Sort upcoming first
      flatInterviews.sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime(),
      );
      setInterviews(flatInterviews);
    } catch (err: any) {
      console.error("Failed to load dashboard", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleDeleteApplication = async () => {
    if (!deleteAppTarget) return;
    try {
      await api.deleteApplication(deleteAppTarget.id);
      success("Application deleted", `${deleteAppTarget.company} was removed.`);
      setDeleteAppTarget(null);
      loadDashboardData();
    } catch (err: any) {
      error("Failed to delete application", err.message);
    }
  };

  const pendingReminders = reminders.filter((r) => !r.completed);
  const upcomingInterviews = interviews.filter(
    (i) => new Date(i.scheduled_at).getTime() > Date.now(),
  );

  return (
    <AppLayout title="Dashboard" onRefreshData={loadDashboardData}>
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Job Search Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Explorer"}!
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
            You have{" "}
            <span className="font-bold text-white">
              {applications.length} tracked applications
            </span>{" "}
            and{" "}
            <span className="font-bold text-amber-300">
              {upcomingInterviews.length} upcoming interview rounds
            </span>
            .
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingApp(null);
              setIsAppModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Track Application</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">
            Gathering metrics & pipeline...
          </span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard
              title="Total Applications"
              value={stats?.total_applications ?? applications.length}
              subtitle="Total jobs in pipeline"
              icon={Briefcase}
              color="indigo"
            />
            <MetricCard
              title="Response Rate"
              value={formatPercent(stats?.response_rate ?? 0)}
              ratePercent={stats?.response_rate ?? 0}
              subtitle="Recruiter replies & screenings"
              icon={TrendingUp}
              color="cyan"
            />
            <MetricCard
              title="Interview Rate"
              value={formatPercent(stats?.interview_rate ?? 0)}
              ratePercent={stats?.interview_rate ?? 0}
              subtitle="Interviews scheduled"
              icon={Calendar}
              color="purple"
            />
            <MetricCard
              title="Offer Rate"
              value={formatPercent(stats?.offer_rate ?? 0)}
              ratePercent={stats?.offer_rate ?? 0}
              subtitle="Offers received"
              icon={Award}
              color="emerald"
            />
          </div>

          {/* Status Breakdown Bar */}
          {stats && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                    Application Status Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Real-time breakdown of all active and historical
                    applications
                  </p>
                </div>
                <Link
                  href="/applications"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Kanban Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <StatusDistributionBar
                byStatus={stats.by_status || {}}
                total={stats.total_applications || applications.length}
              />
            </div>
          )}

          {/* Two Columns: Upcoming Interviews & Action Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Upcoming Interviews Widget */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                        Upcoming Interviews
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {upcomingInterviews.length} rounds scheduled
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setScheduleForAppId(undefined);
                      setEditingInterview(null);
                      setIsInterviewModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                    title="Schedule Interview"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {upcomingInterviews.slice(0, 3).map((item) => (
                    <InterviewCard
                      key={item.id}
                      interview={item}
                      showApplicationContext={true}
                      onEdit={(it) => {
                        setEditingInterview(it);
                        setIsInterviewModalOpen(true);
                      }}
                    />
                  ))}

                  {upcomingInterviews.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-2xl">
                      <Calendar className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        No upcoming interviews right now.
                      </p>
                      <button
                        onClick={() => {
                          setScheduleForAppId(undefined);
                          setEditingInterview(null);
                          setIsInterviewModalOpen(true);
                        }}
                        className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        + Schedule an Interview
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {upcomingInterviews.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-right">
                  <Link
                    href="/interviews"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View all interview schedules</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Pending Reminders Widget */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                        Follow-ups & Tasks
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {pendingReminders.length} pending items
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingReminder(null);
                      setIsReminderModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                    title="Add Reminder"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingReminders.slice(0, 3).map((item) => (
                    <ReminderCard
                      key={item.id}
                      reminder={item}
                      onEdit={(rem) => {
                        setEditingReminder(rem);
                        setIsReminderModalOpen(true);
                      }}
                      onToggleStatus={(updated) => {
                        setReminders((prev) =>
                          prev.map((r) => (r.id === updated.id ? updated : r)),
                        );
                      }}
                    />
                  ))}

                  {pendingReminders.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-2xl">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 dark:text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        All caught up! No pending reminders.
                      </p>
                      <button
                        onClick={() => {
                          setEditingReminder(null);
                          setIsReminderModalOpen(true);
                        }}
                        className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        + Add a Reminder
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {pendingReminders.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-right">
                  <Link
                    href="/reminders"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View all reminders & tasks</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Recent Applications
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Latest job opportunities added to your tracker
                </p>
              </div>
              <Link
                href="/applications"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({applications.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.slice(0, 6).map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onView={(a) => setViewingApp(a)}
                  onEdit={(a) => {
                    setEditingApp(a);
                    setIsAppModalOpen(true);
                  }}
                  onDelete={(a) => setDeleteAppTarget(a)}
                  onScheduleInterview={(a) => {
                    setScheduleForAppId(a.id);
                    setEditingInterview(null);
                    setIsInterviewModalOpen(true);
                  }}
                />
              ))}

              {applications.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50">
                  <Briefcase className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    No applications tracked yet
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 max-w-sm mx-auto mb-4">
                    Start tracking your applications to view analytics, timeline
                    milestones, and interview schedules.
                  </p>
                  <button
                    onClick={() => {
                      setEditingApp(null);
                      setIsAppModalOpen(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all"
                  >
                    + Track First Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reusable Modals */}
      <ApplicationFormModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        application={editingApp}
        onSuccess={loadDashboardData}
      />

      <ApplicationDetailModal
        isOpen={!!viewingApp}
        onClose={() => setViewingApp(null)}
        application={viewingApp}
        onEdit={(a) => {
          setViewingApp(null);
          setEditingApp(a);
          setIsAppModalOpen(true);
        }}
        onDelete={(a) => {
          setViewingApp(null);
          setDeleteAppTarget(a);
        }}
        onUpdate={(updated) => {
          setViewingApp(updated);
          loadDashboardData();
        }}
      />

      <InterviewFormModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        applicationId={scheduleForAppId}
        interview={editingInterview}
        onSuccess={loadDashboardData}
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        reminder={editingReminder}
        onSuccess={loadDashboardData}
      />

      <ConfirmDialog
        isOpen={!!deleteAppTarget}
        onClose={() => setDeleteAppTarget(null)}
        onConfirm={handleDeleteApplication}
        title="Delete Application"
        message={`Are you sure you want to delete the application for ${deleteAppTarget?.position} at ${deleteAppTarget?.company}?`}
        isDestructive
        confirmText="Delete Application"
      />
    </AppLayout>
  );
}
