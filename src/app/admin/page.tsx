"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { BarChart } from "@/components/admin/BarChart";
import { ActivityTable } from "@/components/admin/ActivityTable";
import { PipelineRuler } from "@/components/dashboard/PipelineRuler";
import { Stars } from "@/components/reviews/Stars";
import { api } from "@/lib/api";
import { AdminOverview } from "@/types/api";

function Figure({
  label,
  value,
  note,
  alert = false,
}: {
  label: string;
  value: string | number;
  note?: string;
  alert?: boolean;
}) {
  return (
    <div>
      <dd className={`font-display text-4xl leading-none ${alert ? "text-stamp" : "text-ink"}`}>{value}</dd>
      <dt className="mt-2 text-[15px] font-semibold text-ink">{label}</dt>
      {note && <p className="text-sm text-pencil">{note}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    api
      .adminOverview()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminShell>
      {failed && (
        <div className="border-l-[3px] border-stamp bg-white px-5 py-4">
          <p className="font-semibold text-ink">The overview didn&rsquo;t load.</p>
          <button onClick={load} className="mt-2 text-sm font-medium underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!data && !failed && <div className="h-64 animate-pulse bg-rule/50" aria-busy="true" />}

      {data && (
        <div className="space-y-12">
          <section>
            <h2 className="mb-5 font-display text-2xl text-ink">Everyone</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
              <Figure label="Users" value={data.totals.users} note={`${data.users.new_7d} new this week`} />
              <Figure label="Applications" value={data.totals.applications} />
              <Figure label="Interviews" value={data.totals.interviews} />
              <Figure label="Reminders" value={data.totals.reminders} />
              <Figure
                label="Active users"
                value={data.users.active_24h}
                note={`${data.users.active_7d} in 7 days`}
              />
              <div>
                <dd className="font-display text-4xl leading-none text-ink">
                  {data.totals.reviews > 0 ? data.totals.average_rating.toFixed(1) : "None"}
                </dd>
                <dt className="mt-2 text-[15px] font-semibold text-ink">Rating</dt>
                {data.totals.reviews > 0 ? (
                  <Stars value={data.totals.average_rating} size={14} className="text-ink" />
                ) : (
                  <p className="text-sm text-pencil">No reviews yet</p>
                )}
              </div>
            </dl>
          </section>

          <section className="border-t border-ink/25 pt-6">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-ink">Last 24 hours</h2>
              <p className="text-sm text-pencil">Counts changes, sign-ins and failures</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
              <Figure label="Events" value={data.last_24h.events} />
              <Figure label="Sign-ins" value={data.last_24h.logins} />
              <Figure label="Failed sign-ins" value={data.last_24h.failed_logins} alert={data.last_24h.failed_logins > 0} />
              <Figure label="Blocked" value={data.last_24h.blocked} note="Lockouts and rate limits" alert={data.last_24h.blocked > 0} />
              <Figure label="Client errors" value={data.last_24h.client_errors} note="4xx responses" />
              <Figure label="Server errors" value={data.last_24h.server_errors} note="5xx responses" alert={data.last_24h.server_errors > 0} />
            </dl>
          </section>

          <section className="grid gap-10 border-t border-ink/25 pt-6 lg:grid-cols-2">
            <BarChart data={data.signups_by_day} title="New users per day" noun="sign-up" />
            <BarChart data={data.events_by_day} title="Events per day" noun="event" barClass="bg-indigo-500" />
          </section>

          <section className="border-t border-ink/25 pt-6">
            <h2 className="mb-5 font-display text-2xl text-ink">Applications across all users</h2>
            <PipelineRuler
              byStatus={data.applications_by_status}
              total={data.totals.applications}
            />
          </section>

          <section className="border-t border-ink/25 pt-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-ink">Latest activity</h2>
              <Link href="/admin/activity" className="text-sm font-medium text-pencil underline underline-offset-4 hover:text-ink">
                Full activity log
              </Link>
            </div>
            <ActivityTable items={data.recent_events} compact />
          </section>
        </div>
      )}
    </AdminShell>
  );
}
