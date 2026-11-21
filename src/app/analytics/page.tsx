"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Statistics } from "@/types/api";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { MetricCard } from "@/components/statistics/MetricCard";
import { StatusDistributionBar } from "@/components/statistics/StatusDistributionBar";
import { formatPercent } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Briefcase,
  Zap,
  Lightbulb,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const { error } = useToast();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getStatistics();
      setStats(res);
    } catch (err: any) {
      error("Failed to load statistics", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);


  return (
    <AppLayout title="Analytics" onRefreshData={fetchStats}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            Job Search Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            How far your applications get, and where they stop
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">
            Computing analytics metrics...
          </span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Rates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard
              title="Total Applications"
              value={stats?.total_applications ?? 0}
              subtitle="All opportunities in database"
              icon={Briefcase}
              color="indigo"
            />
            <MetricCard
              title="Response Rate"
              value={formatPercent(stats?.response_rate ?? 0)}
              ratePercent={stats?.response_rate ?? 0}
              subtitle="Applications reaching screening"
              icon={TrendingUp}
              color="cyan"
            />
            <MetricCard
              title="Interview Rate"
              value={formatPercent(stats?.interview_rate ?? 0)}
              ratePercent={stats?.interview_rate ?? 0}
              subtitle="Applications leading to interviews"
              icon={Calendar}
              color="purple"
            />
            <MetricCard
              title="Offer Rate"
              value={formatPercent(stats?.offer_rate ?? 0)}
              ratePercent={stats?.offer_rate ?? 0}
              subtitle="Applications resulting in offers"
              icon={Award}
              color="emerald"
            />
          </div>

          {/* Status Distribution */}
          {stats && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                    Status Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Proportion of applications across every pipeline stage
                  </p>
                </div>
              </div>

              <StatusDistributionBar
                byStatus={stats.by_status || {}}
                total={stats.total_applications}
              />
            </div>
          )}

          {/* Insights & Optimization Recommendations */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 rounded-3xl p-6 sm:p-8 border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center gap-2.5 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Pipeline Insights & Tips
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800 space-y-1.5">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                  Response Optimization
                </span>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Tailoring your resume keywords to match specific job
                  descriptions typically increases your response rate above 20%.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800 space-y-1.5">
                <span className="font-bold text-purple-600 dark:text-purple-400 block">
                  Interview Conversion
                </span>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Set follow-up reminders within 24-48 hours of each interview
                  round to thank interviewers and reiterate your top impact
                  areas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800 space-y-1.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                  Offer Negotiation
                </span>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Having multiple active pipeline opportunities simultaneously
                  provides stronger leverage during salary negotiations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
