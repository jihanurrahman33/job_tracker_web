"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/reviews", label: "Reviews" },
];

/**
 * Wraps every admin page. The check here only decides what to show; the API
 * enforces admin access on every request regardless.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <AppLayout title="Admin">
      {user?.role !== "admin" ? (
        <div className="mx-auto max-w-xl pt-8">
          <h2 className="font-display text-2xl text-ink">This area is for admins.</h2>
          <p className="mt-2 text-[15px] text-pencil">
            Your account doesn&rsquo;t have admin access.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-indigo-700"
          >
            Back to your dashboard
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl pb-12">
          <nav aria-label="Admin sections" className="mb-8 flex gap-1 border-b border-rule">
            {TABS.map((t) => {
              const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`-mb-px border-b-[3px] px-4 py-2.5 text-[15px] ${
                    active
                      ? "border-marker font-semibold text-ink"
                      : "border-transparent text-pencil hover:text-ink"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
          {children}
        </div>
      )}
    </AppLayout>
  );
}
