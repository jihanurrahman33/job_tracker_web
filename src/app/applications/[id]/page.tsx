"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LIST,
  Interview,
  Reminder,
} from "@/types/api";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatSalary, formatDate } from "@/lib/utils";
import { ApplicationTimeline } from "@/components/applications/ApplicationTimeline";
import { ApplicationFormModal } from "@/components/applications/ApplicationFormModal";
import { InterviewCard } from "@/components/interviews/InterviewCard";
import { InterviewFormModal } from "@/components/interviews/InterviewFormModal";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Building2,
  MapPin,
  ExternalLink,
  Calendar,
  Clock,
  History,
  Edit2,
  Trash2,
  ArrowLeft,
  CalendarPlus,
  BellPlus,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { success, error } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "interviews" | "reminders"
  >("overview");

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );
  const [deleteInterviewTarget, setDeleteInterviewTarget] =
    useState<Interview | null>(null);

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null,
  );
  const [deleteReminderTarget, setDeleteReminderTarget] =
    useState<Reminder | null>(null);

  const [timelineKey, setTimelineKey] = useState(0);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [appData, interviewsRes, remindersRes] = await Promise.all([
        api.getApplication(id),
        api.listInterviewsByApplication(id).catch(() => ({ data: [] })),
        api.listReminders().catch(() => ({ data: [] })),
      ]);

      setApplication(appData);
      setInterviews(interviewsRes.data || []);
      const matched = (remindersRes.data || []).filter(
        (r) => r.application_id === id,
      );
      setReminders(matched);
    } catch (err: any) {
      error("Failed to load application", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;
    try {
      const updated = await api.updateApplication(application.id, {
        status: newStatus,
      });
      setApplication(updated);
      setTimelineKey((k) => k + 1);
      success(
        "Status updated",
        `${updated.company} is now ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
      );
    } catch (err: any) {
      error("Failed to change status", err.message);
    }
  };

  const handleDeleteApplication = async () => {
    if (!application) return;
    try {
      await api.deleteApplication(application.id);
      success("Application deleted", "Application has been removed.");
      router.push("/applications");
    } catch (err: any) {
      error("Failed to delete", err.message);
    }
  };

  const handleDeleteInterview = async () => {
    if (!deleteInterviewTarget) return;
    try {
      await api.deleteInterview(deleteInterviewTarget.id);
      success("Interview deleted", "Interview removed from schedule.");
      setInterviews((prev) =>
        prev.filter((i) => i.id !== deleteInterviewTarget.id),
      );
      setDeleteInterviewTarget(null);
    } catch (err: any) {
      error("Failed to delete interview", err.message);
    }
  };

  const handleDeleteReminder = async () => {
    if (!deleteReminderTarget) return;
    try {
      await api.deleteReminder(deleteReminderTarget.id);
      success("Reminder deleted", "Reminder was removed.");
      setReminders((prev) =>
        prev.filter((r) => r.id !== deleteReminderTarget.id),
      );
      setDeleteReminderTarget(null);
    } catch (err: any) {
      error("Failed to delete reminder", err.message);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Application Details">
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">
            Loading application data...
          </span>
        </div>
      </AppLayout>
    );
  }

  if (!application) {
    return (
      <AppLayout title="Application Not Found">
        <div className="py-20 text-center space-y-4">
          <h3 className="text-lg font-bold">Application not found</h3>
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applications</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`${application.position} at ${application.company}`}
      onRefreshData={loadData}
    >
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/applications"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all applications</span>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                {application.position}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-base text-slate-600 dark:text-zinc-400 font-medium mt-1">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {application.company}
                </span>
                {application.job_url && (
                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 underline"
                  >
                    <span>Job Posting</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Actions & Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Status:
                </span>
                <select
                  value={application.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as ApplicationStatus)
                  }
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 outline-none"
                >
                  {APPLICATION_STATUS_LIST.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_CONFIG[st]?.label || st}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                title="Edit Details"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Delete Application"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Location
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-1 block">
                {application.location || "Remote / Unspecified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Compensation
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-1 block">
                {formatSalary(
                  application.salary_min,
                  application.salary_max,
                  application.salary_currency || "USD",
                )}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Date Applied
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-1 block">
                {application.applied_at
                  ? formatDate(application.applied_at)
                  : "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Last Modified
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-1 block">
                {formatDate(application.updated_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 relative transition-colors ${
              activeTab === "overview"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
            }`}
          >
            Overview & Notes
            {activeTab === "overview" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`pb-3 relative transition-colors flex items-center gap-1.5 ${
              activeTab === "timeline"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Timeline Events</span>
            {activeTab === "timeline" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("interviews")}
            className={`pb-3 relative transition-colors flex items-center gap-1.5 ${
              activeTab === "interviews"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Interviews ({interviews.length})</span>
            {activeTab === "interviews" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("reminders")}
            className={`pb-3 relative transition-colors flex items-center gap-1.5 ${
              activeTab === "reminders"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Reminders ({reminders.length})</span>
            {activeTab === "reminders" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Views */}
        <div className="pt-2">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Notes & Details
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                  {application.notes ||
                    "No notes added for this job application yet."}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedInterview(null);
                    setIsInterviewModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800/60 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Schedule Interview Round</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedReminder(null);
                    setIsReminderModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 transition-colors"
                >
                  <BellPlus className="w-4 h-4" />
                  <span>Set Follow-up Reminder</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Application Status Audit Trail
              </h4>
              <ApplicationTimeline
                applicationId={application.id}
                refreshTrigger={timelineKey}
              />
            </div>
          )}

          {activeTab === "interviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Scheduled Interview Rounds
                </h4>
                <button
                  onClick={() => {
                    setSelectedInterview(null);
                    setIsInterviewModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Round</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviews.map((item) => (
                  <InterviewCard
                    key={item.id}
                    interview={item}
                    onEdit={(it) => {
                      setSelectedInterview(it);
                      setIsInterviewModalOpen(true);
                    }}
                    onDelete={(it) => setDeleteInterviewTarget(it)}
                  />
                ))}

                {interviews.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/40">
                    <Calendar className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      No interviews scheduled for this role yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "reminders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Follow-ups & Tasks
                </h4>
                <button
                  onClick={() => {
                    setSelectedReminder(null);
                    setIsReminderModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Reminder</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reminders.map((rem) => (
                  <ReminderCard
                    key={rem.id}
                    reminder={rem}
                    onEdit={(r) => {
                      setSelectedReminder(r);
                      setIsReminderModalOpen(true);
                    }}
                    onDelete={(r) => setDeleteReminderTarget(r)}
                    onToggleStatus={(updated) => {
                      setReminders((prev) =>
                        prev.map((item) =>
                          item.id === updated.id ? updated : item,
                        ),
                      );
                    }}
                    showApplicationContext={false}
                  />
                ))}

                {reminders.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/40">
                    <Clock className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      No reminders linked to this application.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Application Modal */}
      <ApplicationFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        application={application}
        onSuccess={(updated) => {
          setApplication(updated);
          loadData();
        }}
      />

      {/* Delete Application Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteApplication}
        title="Delete Application"
        message={`Are you sure you want to permanently delete the application for ${application.position} at ${application.company}?`}
        isDestructive
        confirmText="Delete Application"
      />

      {/* Nested Interview Modals */}
      <InterviewFormModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        applicationId={application.id}
        interview={selectedInterview}
        onSuccess={loadData}
      />

      <ConfirmDialog
        isOpen={!!deleteInterviewTarget}
        onClose={() => setDeleteInterviewTarget(null)}
        onConfirm={handleDeleteInterview}
        title="Cancel Interview Round"
        message="Are you sure you want to remove this interview round from your schedule?"
        isDestructive
        confirmText="Remove Interview"
      />

      {/* Nested Reminder Modals */}
      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        applicationId={application.id}
        reminder={selectedReminder}
        onSuccess={loadData}
      />

      <ConfirmDialog
        isOpen={!!deleteReminderTarget}
        onClose={() => setDeleteReminderTarget(null)}
        onConfirm={handleDeleteReminder}
        title="Delete Reminder"
        message="Are you sure you want to remove this reminder?"
        isDestructive
        confirmText="Delete Reminder"
      />
    </AppLayout>
  );
}
