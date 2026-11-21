"use client";

import React from "react";
import { RefreshCw, LogOut } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/lib/utils";

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();

  const details = user
    ? [
        { label: "Name", value: user.name },
        { label: "Email", value: user.email },
        { label: "Account created", value: formatDateTime(user.created_at) },
      ]
    : [];

  return (
    <AppLayout title="Settings">
      <div className="mx-auto max-w-2xl pb-12">
        <h2 className="font-display text-3xl text-ink">Your account</h2>

        <dl className="mt-6 divide-y divide-rule border-y border-ink/25">
          {details.map((d) => (
            <div
              key={d.label}
              className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4"
            >
              <dt className="text-sm text-pencil">{d.label}</dt>
              <dd className="text-[17px] text-ink">{d.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-indigo-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <button
            onClick={() => refreshUser()}
            className="inline-flex items-center gap-2 text-sm font-medium text-pencil underline underline-offset-4 hover:text-ink"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload profile
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
