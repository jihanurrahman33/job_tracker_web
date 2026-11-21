"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Application,
  ApplicationStatus,
  Interview,
  Reminder,
  Statistics,
} from "@/types/api";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { INTERVIEW_TYPE_CONFIG, STATUS_CONFIG } from "@/lib/constants";
import { formatPercent } from "@/lib/utils";
import { PipelineRuler } from "@/components/dashboard/PipelineRuler";
import { AgendaItem, AgendaList } from "@/components/dashboard/AgendaList";
import { ApplicationLedger } from "@/components/dashboard/ApplicationLedger";
import { ApplicationFormModal } from "@/components/applications/ApplicationFormModal";
import { ApplicationDetailModal } from "@/components/applications/ApplicationDetailModal";
import { InterviewFormModal } from "@/components/interviews/InterviewFormModal";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const ACTIVE_FOR_INTERVIEWS: ApplicationStatus[] = [
  "SCREENING",
  "INTERVIEW",
  "TECHNICAL_INTERVIEW",
  "OFFER",
];
const FOLLOW_UP_AFTER_DAYS = 7;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

const sentOn = (a: Application) => new Date(a.applied_at || a.created_at);

export default function DashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<Statistics | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [deleteAppTarget, setDeleteAppTarget] = useState<Application | null>(null);

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadFailed(false);

    const [statsRes, appsRes, remindersRes] = await Promise.allSettled([
      api.getStatistics(),
      api.listApplications({ limit: 50, sort: "-applied_at" }),
      api.listReminders(),
    ]);

    if (
      statsRes.status === "rejected" &&
      appsRes.status === "rejected" &&
      remindersRes.status === "rejected"
    ) {
      setLoadFailed(true);
      setIsLoading(false);
      return;
    }

    setStats(statsRes.status === "fulfilled" ? statsRes.value : null);
    const apps = appsRes.status === "fulfilled" ? appsRes.value.data || [] : [];
    setApplications(apps);
    setReminders(
      remindersRes.status === "fulfilled" ? remindersRes.value.data || [] : [],
    );

    // Interviews are listed per application, so only ask for the ones that
    // can plausibly have a round booked.
    const interviewLookups = apps
      .filter((a) => ACTIVE_FOR_INTERVIEWS.includes(a.status))
      .slice(0, 15)
      .map((app) =>
        api
          .listInterviewsByApplication(app.id)
          .then((res) => (res.data || []).map((i) => ({ ...i, application: app })))
          .catch(() => [] as Interview[]),
      );
    setInterviews((await Promise.all(interviewLookups)).flat());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refreshStats = () => {
    api.getStatistics().then(setStats).catch(() => {});
  };

  const handleChangeStatus = async (app: Application, status: ApplicationStatus) => {
    if (status === app.status) return;
    const before = applications;
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status } : a)),
    );
    try {
      await api.updateApplication(app.id, { status });
      success("Stage updated", `${app.company} is now ${STATUS_CONFIG[status].label}.`);
      refreshStats();
    } catch (err: any) {
      setApplications(before);
      error("Couldn't update the stage", err.message);
    }
  };

  const handleCompleteReminder = async (reminder: Reminder) => {
    const before = reminders;
    setReminders((prev) =>
      prev.map((r) => (r.id === reminder.id ? { ...r, completed: true } : r)),
    );
    try {
      await api.updateReminder(reminder.id, { completed: true });
      success("Reminder done", reminder.title);
    } catch (err: any) {
      setReminders(before);
      error("Couldn't update the reminder", err.message);
    }
  };

  const handleDeleteApplication = async () => {
    if (!deleteAppTarget) return;
    try {
      await api.deleteApplication(deleteAppTarget.id);
      success("Application deleted", `${deleteAppTarget.company} was removed.`);
      setDeleteAppTarget(null);
      load();
    } catch (err: any) {
      error("Couldn't delete the application", err.message);
    }
  };

  const openNewApplication = () => {
    setEditingApp(null);
    setIsAppModalOpen(true);
  };

  const { agenda, upcomingCount, overdueCount } = useMemo(() => {
    const now = Date.now();
    const byId = new Map(applications.map((a) => [a.id, a]));
    const items: AgendaItem[] = [];

    for (const i of interviews) {
      const at = new Date(i.scheduled_at);
      if (at.getTime() <= now) continue;
      const type = INTERVIEW_TYPE_CONFIG[i.type]?.label ?? "Interview";
      items.push({
        key: `i-${i.id}`,
        at,
        title: `${type} with ${i.application?.company ?? "a company"}`,
        detail: [i.application?.position, i.duration_minutes ? `${i.duration_minutes} min` : null]
          .filter(Boolean)
          .join(", "),
        overdue: false,
        interview: i,
      });
    }

    for (const r of reminders) {
      if (r.completed) continue;
      const at = new Date(r.remind_at);
      const app = r.application_id ? byId.get(r.application_id) : undefined;
      items.push({
        key: `r-${r.id}`,
        at,
        title: r.title,
        detail: app ? `${app.company}, ${app.position}` : r.description || "Reminder",
        overdue: at.getTime() < now,
        reminder: r,
      });
    }

    items.sort((a, b) => a.at.getTime() - b.at.getTime());
    return {
      agenda: items.slice(0, 8),
      upcomingCount: items.filter((i) => i.interview).length,
      overdueCount: items.filter((i) => i.overdue).length,
    };
  }, [applications, interviews, reminders]);

  const followUps = useMemo(() => {
    const now = new Date();
    return applications
      .filter((a) => a.status === "APPLIED" || a.status === "SCREENING")
      .map((a) => ({ app: a, days: differenceInCalendarDays(now, sentOn(a)) }))
      .filter((x) => x.days >= FOLLOW_UP_AFTER_DAYS)
      .sort((a, b) => b.days - a.days)
      .slice(0, 5);
  }, [applications]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const total = stats?.total_applications ?? applications.length;

  const summary =
    upcomingCount === 0 && overdueCount === 0
      ? "Nothing is booked or overdue right now."
      : [
          upcomingCount > 0 && `${plural(upcomingCount, "interview", "interviews")} coming up`,
          overdueCount > 0 && `${plural(overdueCount, "follow-up", "follow-ups")} overdue`,
        ]
          .filter(Boolean)
          .join(" and ") + ".";

  return (
    <AppLayout title="Dashboard" onRefreshData={load}>
      <div className="mx-auto max-w-5xl pb-12">
        {/* Greeting */}
        <section className="flex flex-wrap items-end justify-between gap-4 pb-8 pt-2">
          <div>
            <p className="text-sm text-pencil">{format(new Date(), "EEEE d MMMM")}</p>
            <h2 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
              {greeting()}, {firstName}.
            </h2>
            {!isLoading && !loadFailed && applications.length > 0 && (
              <p className="mt-2 text-[17px] text-pencil">{summary}</p>
            )}
          </div>
          <button
            onClick={openNewApplication}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add application
          </button>
        </section>

        {isLoading && (
          <div className="space-y-6" aria-busy="true" aria-label="Loading your dashboard">
            <div className="h-24 animate-pulse bg-rule/60" />
            <div className="h-48 animate-pulse bg-rule/40" />
          </div>
        )}

        {!isLoading && loadFailed && (
          <section className="border-l-[3px] border-stamp bg-white px-6 py-6">
            <h3 className="font-display text-xl text-ink">
              The server isn&rsquo;t responding.
            </h3>
            <p className="mt-2 max-w-xl text-[15px] text-pencil">
              Your dashboard couldn&rsquo;t load because the API didn&rsquo;t answer.
              Check your connection, then try again. If it keeps failing, check
              the server address in settings.
            </p>
            <div className="mt-4 flex items-center gap-5">
              <button
                onClick={load}
                className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-indigo-700"
              >
                Try again
              </button>
              <Link
                href="/settings"
                className="text-sm font-medium underline underline-offset-4"
              >
                Open settings
              </Link>
            </div>
          </section>
        )}

        {!isLoading && !loadFailed && applications.length === 0 && (
          <section className="border-t border-ink/25 pt-8">
            <h3 className="font-display text-2xl text-ink">
              Start with the last job you applied for.
            </h3>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-pencil">
              Add the company, the role and the date. Then set a reminder to
              follow up. Interview times and your response rate build up from
              there.
            </p>
            <button
              onClick={openNewApplication}
              className="mt-6 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-indigo-700"
            >
              Add your first application
            </button>
          </section>
        )}

        {!isLoading && !loadFailed && applications.length > 0 && (
          <div className="space-y-12">
            {/* Pipeline */}
            <section className="border-t border-ink/25 pt-6">
              <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-rule">
                {[
                  { label: "Applications", value: String(total), note: "tracked so far" },
                  { label: "Heard back", value: formatPercent(stats?.response_rate ?? 0), note: "got any reply" },
                  { label: "Reached interview", value: formatPercent(stats?.interview_rate ?? 0), note: "of applications" },
                  { label: "Offers", value: formatPercent(stats?.offer_rate ?? 0), note: "of applications" },
                ].map((m, i) => (
                  <div key={m.label} className={i > 0 ? "sm:pl-6" : ""}>
                    <dd className="font-display text-4xl leading-none text-ink">{m.value}</dd>
                    <dt className="mt-2 text-[15px] font-semibold text-ink">{m.label}</dt>
                    <p className="text-sm text-pencil">{m.note}</p>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <PipelineRuler byStatus={stats?.by_status || {}} total={total} />
              </div>
            </section>

            {/* Coming up + follow-ups */}
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
              <section>
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="font-display text-2xl text-ink">Coming up</h3>
                  <Link href="/interviews" className="text-sm font-medium text-pencil underline underline-offset-4 hover:text-ink">
                    All interviews
                  </Link>
                </div>
                <AgendaList
                  items={agenda}
                  onOpenInterview={(i) => {
                    setEditingInterview(i);
                    setIsInterviewModalOpen(true);
                  }}
                  onOpenReminder={(r) => {
                    setEditingReminder(r);
                    setIsReminderModalOpen(true);
                  }}
                  onCompleteReminder={handleCompleteReminder}
                  onAdd={() => {
                    setEditingReminder(null);
                    setIsReminderModalOpen(true);
                  }}
                />
              </section>

              <section>
                <h3 className="mb-1 font-display text-2xl text-ink">Worth a follow-up</h3>
                <p className="mb-4 text-sm text-pencil">
                  Applied or screening, with no change for {FOLLOW_UP_AFTER_DAYS} days or more.
                </p>
                {followUps.length === 0 ? (
                  <p className="border-y border-rule py-5 text-[15px] text-pencil">
                    Nothing has gone quiet. Good.
                  </p>
                ) : (
                  <ul className="divide-y divide-rule border-y border-rule">
                    {followUps.map(({ app, days }) => (
                      <li key={app.id}>
                        <button
                          onClick={() => setViewingApp(app)}
                          className="flex w-full items-baseline justify-between gap-4 py-3 text-left hover:bg-white"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-semibold text-ink">
                              {app.company}
                            </span>
                            <span className="block truncate text-sm text-pencil">
                              {app.position}
                            </span>
                          </span>
                          <span className="shrink-0 bg-marker/70 px-1.5 text-sm font-semibold text-ink">
                            {days} days
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Ledger */}
            <section>
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="font-display text-2xl text-ink">Recent applications</h3>
                <Link href="/applications" className="text-sm font-medium text-pencil underline underline-offset-4 hover:text-ink">
                  See all {applications.length}
                </Link>
              </div>
              <ApplicationLedger
                applications={applications.slice(0, 8)}
                onOpen={setViewingApp}
                onChangeStatus={handleChangeStatus}
              />
            </section>
          </div>
        )}
      </div>

      <ApplicationFormModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        application={editingApp}
        onSuccess={load}
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
          load();
        }}
      />

      <InterviewFormModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        interview={editingInterview}
        onSuccess={load}
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        reminder={editingReminder}
        onSuccess={load}
      />

      <ConfirmDialog
        isOpen={!!deleteAppTarget}
        onClose={() => setDeleteAppTarget(null)}
        onConfirm={handleDeleteApplication}
        title="Delete application"
        message={`Delete the application for ${deleteAppTarget?.position} at ${deleteAppTarget?.company}? This can't be undone.`}
        isDestructive
        confirmText="Delete application"
      />
    </AppLayout>
  );
}
