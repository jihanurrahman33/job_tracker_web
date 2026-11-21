"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { AdminShell } from "@/components/admin/AdminShell";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { AdminUser, Pagination as PaginationInfo } from "@/types/api";

export default function AdminUsersPage() {
  const { success, error } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [info, setInfo] = useState<PaginationInfo | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [target, setTarget] = useState<AdminUser | null>(null);

  // Wait for a pause in typing before searching.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setLoading(true);
    setFailed(false);
    api
      .adminUsers({ search: query, page, limit: 20 })
      .then((res) => {
        setUsers(res.data || []);
        setInfo(res.pagination);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [query, page]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async () => {
    if (!target) return;
    const disable = !target.disabled;
    try {
      await api.adminSetUserDisabled(target.id, disable);
      success(
        disable ? "Account disabled" : "Account restored",
        disable ? `${target.email} is signed out and can't sign in.` : `${target.email} can sign in again.`,
      );
      setTarget(null);
      load();
    } catch (err: any) {
      error("Couldn't update the account", err.message);
      setTarget(null);
    }
  };

  return (
    <AdminShell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">Users</h2>
        <div>
          <label htmlFor="user-search" className="mb-1 block text-sm text-pencil">
            Search by name or email
          </label>
          <input
            id="user-search"
            type="search"
            value={search}
            maxLength={100}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-md border border-ink/25 bg-white px-3 py-2 text-[15px] outline-none focus:border-ink"
          />
        </div>
      </div>

      {failed && (
        <div className="border-l-[3px] border-stamp bg-white px-5 py-4">
          <p className="font-semibold text-ink">The user list didn&rsquo;t load.</p>
          <button onClick={load} className="mt-2 text-sm font-medium underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!failed && (
        <div className={`overflow-x-auto border-y border-ink/25 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead className="text-pencil">
              <tr className="border-b border-rule">
                <th className="py-2 pr-4 font-normal">User</th>
                <th className="py-2 pr-4 font-normal">Applications</th>
                <th className="py-2 pr-4 font-normal">Last signed in</th>
                <th className="py-2 pr-4 font-normal">Joined</th>
                <th className="py-2 pr-4 font-normal">Status</th>
                <th className="py-2 text-right font-normal">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {users.map((u) => (
                <tr key={u.id} className="align-middle">
                  <td className="py-3 pr-4">
                    <span className="block font-semibold text-ink">{u.name || "No name"}</span>
                    <span className="block text-pencil">{u.email}</span>
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{u.applications}</td>
                  <td className="whitespace-nowrap py-3 pr-4 text-pencil">
                    {u.last_login_at ? formatDistanceToNow(new Date(u.last_login_at), { addSuffix: true }) : "Never"}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-pencil">
                    {format(new Date(u.created_at), "d MMM yyyy")}
                  </td>
                  <td className="py-3 pr-4">
                    {u.role === "admin" ? (
                      <span className="bg-marker px-1.5 font-semibold text-ink">Admin</span>
                    ) : u.disabled ? (
                      <span className="font-semibold text-stamp">Disabled</span>
                    ) : (
                      <span className="text-offer">Active</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 text-right">
                    <Link
                      href={`/admin/activity?user_id=${u.id}`}
                      className="mr-4 text-pencil underline underline-offset-4 hover:text-ink"
                    >
                      Activity
                    </Link>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => setTarget(u)}
                        className={`font-medium underline underline-offset-4 ${
                          u.disabled ? "text-ink" : "text-stamp"
                        }`}
                      >
                        {u.disabled ? "Restore" : "Disable"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-[15px] text-pencil">
                    {query ? "No one matches that search." : "No users yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination info={info} onPage={setPage} />

      <ConfirmDialog
        isOpen={!!target}
        onClose={() => setTarget(null)}
        onConfirm={toggle}
        title={target?.disabled ? "Restore account" : "Disable account"}
        message={
          target?.disabled
            ? `Let ${target?.email} sign in again?`
            : `Disable ${target?.email}? They are signed out straight away and can't sign in until you restore the account. Their data is kept.`
        }
        isDestructive={!target?.disabled}
        confirmText={target?.disabled ? "Restore account" : "Disable account"}
      />
    </AdminShell>
  );
}
