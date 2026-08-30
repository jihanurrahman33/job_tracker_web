"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LIST,
  Interview,
  Reminder,
} from "@/types/api";
import { StatusBadge } from "../common/StatusBadge";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatSalary, formatDate, formatDateTime } from "@/lib/utils";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { InterviewCard } from "../interviews/InterviewCard";
import { InterviewFormModal } from "../interviews/InterviewFormModal";
import { ReminderCard } from "../reminders/ReminderCard";
import { ReminderFormModal } from "../reminders/ReminderFormModal";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  Calendar,
  Clock,
  History,
  FileText,
  CalendarPlus,
  BellPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  Plus,
} from "lucide-react";

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onUpdate: (updated: Application) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  isOpen,
  onClose,
  application,
  onEdit,
  onDelete,
  onUpdate,
}) => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "interviews" | "reminders"
  >("overview");

  // Child data
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(false);
  const [isLoadingReminders, setIsLoadingReminders] = useState(false);

  // Modals inside details
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

  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0);

  // Fetch interviews & reminders for this application
  useEffect(() => {
    if (isOpen && application) {
      // Fetch interviews
      setIsLoadingInterviews(true);
      api
        .listInterviewsByApplication(application.id)
        .then((res) => setInterviews(res.data || []))
        .catch(console.error)
        .finally(() => setIsLoadingInterviews(false));

      // Fetch all reminders and filter by application_id
      setIsLoadingReminders(true);
      api
        .listReminders()
        .then((res) => {
          const matched = (res.data || []).filter(
            (r) => r.application_id === application.id,
          );
          setReminders(matched);
        })
        .catch(console.error)
        .finally(() => setIsLoadingReminders(false));
    }
  }, [isOpen, application]);

  if (!application) return null;

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    try {
      const updated = await api.updateApplication(application.id, {
        status: newStatus,
      });
      success(
        "Status updated",
        `${updated.company} is now marked as ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
      );
      onUpdate(updated);
      setTimelineRefreshKey((k) => k + 1);
    } catch (err: any) {
      error("Failed to change status", err.message);
    }
  };

  const handleDeleteInterview = async () => {
    if (!deleteInterviewTarget) return;
    try {
      await api.deleteInterview(deleteInterviewTarget.id);
      success("Interview deleted", "The interview round was removed.");
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
      success("Reminder deleted", "The reminder was removed.");
      setReminders((prev) =>
        prev.filter((r) => r.id !== deleteReminderTarget.id),
      );
      setDeleteReminderTarget(null);
    } catch (err: any) {
      error("Failed to delete reminder", err.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl">
        <div className="-mt-2 space-y-6">
          {/* Header section with Company, Position, Actions, Status */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  {application.position}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>{application.company}</span>
                </div>

                {application.job_url && (
                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
                  >
                    <span>View Job Posting</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Top Right: Status Selector & Edit/Delete */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  Status:
                </label>
                <select
                  value={application.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as ApplicationStatus)
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                >
                  {APPLICATION_STATUS_LIST.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_CONFIG[st]?.label || st}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => onEdit(application)}
                title="Edit Details"
                className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(application)}
                title="Delete Application"
                className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Location
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5 block truncate">
                {application.location || "Remote / Unspecified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Compensation
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5 block truncate">
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
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5 block truncate">
                {application.applied_at
                  ? formatDate(application.applied_at)
                  : "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Last Activity
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5 block truncate">
                {formatDate(application.updated_at)}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-6 text-sm font-medium">
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
              <span>Status Timeline</span>
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

          {/* Tab Content */}
          <div className="py-2">
            {/* Overview & Notes Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                    Application Notes & Log
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                    {application.notes
                      ? application.notes
                      : "No notes added for this job application yet."}
                  </div>
                </div>

                {/* Quick actions row inside Overview */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedInterview(null);
                      setIsInterviewModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800/60 transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Schedule Interview</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedReminder(null);
                      setIsReminderModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 transition-colors"
                  >
                    <BellPlus className="w-4 h-4" />
                    <span>Add Reminder</span>
                  </button>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === "timeline" && (
              <ApplicationTimeline
                applicationId={application.id}
                refreshTrigger={timelineRefreshKey}
              />
            )}

            {/* Interviews Tab */}
            {activeTab === "interviews" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Scheduled Rounds
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedInterview(null);
                      setIsInterviewModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Interview</span>
                  </button>
                </div>

                <div className="space-y-3">
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
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No interviews scheduled yet for {application.company}.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reminders Tab */}
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

                <div className="space-y-3">
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
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No reminders linked to this application.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Nested Modals */}
      <InterviewFormModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        applicationId={application.id}
        interview={selectedInterview}
        onSuccess={(saved) => {
          setInterviews((prev) => {
            const exists = prev.some((i) => i.id === saved.id);
            if (exists) {
              return prev.map((i) => (i.id === saved.id ? saved : i));
            }
            return [...prev, saved];
          });
        }}
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        applicationId={application.id}
        reminder={selectedReminder}
        onSuccess={(saved) => {
          setReminders((prev) => {
            const exists = prev.some((r) => r.id === saved.id);
            if (exists) {
              return prev.map((r) => (r.id === saved.id ? saved : r));
            }
            return [...prev, saved];
          });
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteInterviewTarget}
        onClose={() => setDeleteInterviewTarget(null)}
        onConfirm={handleDeleteInterview}
        title="Cancel Interview Round"
        message="Are you sure you want to remove this scheduled interview round?"
        isDestructive
        confirmText="Remove Interview"
      />

      <ConfirmDialog
        isOpen={!!deleteReminderTarget}
        onClose={() => setDeleteReminderTarget(null)}
        onConfirm={handleDeleteReminder}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder?"
        isDestructive
        confirmText="Delete Reminder"
      />
    </>
  );
};
