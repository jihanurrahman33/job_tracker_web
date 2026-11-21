"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ActivityTable } from "@/components/admin/ActivityTable";
import { Pagination } from "@/components/admin/Pagination";
import { api } from "@/lib/api";
import { ActivityItem, Pagination as PaginationInfo } from "@/types/api";

const GROUPS = [
  { value: "", label: "Everything" },
  { value: "auth.", label: "Sign-ins and sign-ups" },
  { value: "security.", label: "Security events" },
  { value: "admin.", label: "Admin actions" },
  { value: "application.", label: "Applications" },
  { value: "interview.", label: "Interviews" },
  { value: "reminder.", label: "Reminders" },
  { value: "review.", label: "Reviews" },
];

const UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export default function AdminActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [info, setInfo] = useState<PaginationInfo | null>(null);
  const [action, setAction] = useState("");
  const [errorsOnly, setErrorsOnly] = useState(false);
  const [ip, setIp] = useState("");
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  // A link from the Users page or a table row can pre-filter to one person.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("user_id") || "";
    if (UUID.test(id)) setUserId(id);
    setReady(true);
  }, []);

  const load = useCallback(() => {
    if (!ready) return;
    setLoading(true);
    setFailed(false);
    api
      .adminActivity({
        action: action || undefined,
        user_id: userId || undefined,
        ip: ip.trim() || undefined,
        min_status: errorsOnly ? 400 : undefined,
        page,
        limit: 25,
      })
      .then((res) => {
        setItems(res.data || []);
        setInfo(res.pagination);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [ready, action, userId, ip, errorsOnly, page]);

  useEffect(() => {
    load();
  }, [load]);

  const field =
    "rounded-md border border-ink/25 bg-white px-3 py-2 text-[15px] outline-none focus:border-ink";

  return (
    <AdminShell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Activity</h2>
          <p className="mt-1 max-w-xl text-sm text-pencil">
            Changes, sign-ins, admin actions and failed requests. Ordinary page views aren&rsquo;t
            recorded. Entries are kept for 90 days, and passwords and message bodies are never stored.
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-md border border-ink/25 px-3.5 py-2 text-sm font-medium text-ink hover:bg-white"
        >
          Refresh
        </button>
      </div>

      <div className="mb-5 flex flex-wrap items-end gap-x-5 gap-y-3">
        <div>
          <label htmlFor="group" className="mb-1 block text-sm text-pencil">
            Show
          </label>
          <select
            id="group"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            className={field}
          >
            {GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ip" className="mb-1 block text-sm text-pencil">
            Address
          </label>
          <input
            id="ip"
            value={ip}
            maxLength={64}
            placeholder="e.g. 203.0.113.9"
            onChange={(e) => {
              setIp(e.target.value);
              setPage(1);
            }}
            className={`${field} w-44`}
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-[15px] text-ink">
          <input
            type="checkbox"
            checked={errorsOnly}
            onChange={(e) => {
              setErrorsOnly(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 accent-[#12263A]"
          />
          Only failed requests
        </label>
        {userId && (
          <p className="pb-2 text-[15px] text-ink">
            One user only.{" "}
            <button
              onClick={() => {
                setUserId("");
                setPage(1);
                window.history.replaceState(null, "", "/admin/activity");
              }}
              className="font-medium underline underline-offset-4"
            >
              Show everyone
            </button>
          </p>
        )}
      </div>

      {failed ? (
        <div className="border-l-[3px] border-stamp bg-white px-5 py-4">
          <p className="font-semibold text-ink">The activity log didn&rsquo;t load.</p>
          <button onClick={load} className="mt-2 text-sm font-medium underline underline-offset-4">
            Try again
          </button>
        </div>
      ) : (
        <div className={loading ? "opacity-60" : ""} aria-busy={loading}>
          <ActivityTable items={items} />
        </div>
      )}

      <Pagination info={info} onPage={setPage} />

      <p className="mt-8 text-sm text-pencil">
        Need the people behind an address? <Link href="/admin/users" className="underline underline-offset-4">Go to Users</Link>.
      </p>
    </AdminShell>
  );
}
