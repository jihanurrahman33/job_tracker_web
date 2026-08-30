"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useServer } from "@/context/ServerContext";
import { useToast } from "@/context/ToastContext";
import { SERVER_PRESETS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import {
  Server,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Shield,
  Radio,
  ExternalLink,
  Activity,
  Globe,
  Database,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const {
    serverUrl,
    setServerUrl,
    resetServerUrl,
    isOnline,
    isReady,
    isChecking,
    checkServerHealth,
  } = useServer();
  const { success, info } = useToast();

  const [customInputUrl, setCustomInputUrl] = useState(serverUrl);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthResults, setHealthResults] = useState<{
    online: boolean;
    ready: boolean;
  } | null>(null);

  useEffect(() => {
    setCustomInputUrl(serverUrl);
  }, [serverUrl]);

  const handleSelectPreset = (url: string) => {
    setServerUrl(url);
    setCustomInputUrl(url);
    success("Server URL updated", `Switched to ${url}`);
  };

  const handleSaveCustomUrl = () => {
    if (!customInputUrl.trim()) return;
    setServerUrl(customInputUrl.trim());
    success("Server URL updated", `Switched to ${customInputUrl.trim()}`);
  };

  const handleRunHealthCheck = async () => {
    setTestingHealth(true);
    const res = await checkServerHealth(customInputUrl);
    setHealthResults(res);
    setTestingHealth(false);
    info(
      "Diagnostic Completed",
      `Health (/health): ${res.online ? "PASSED" : "FAILED"} | Readiness (/ready): ${res.ready ? "PASSED" : "FAILED"}`,
    );
  };

  return (
    <AppLayout title="Settings & API Configuration">
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            System & Account Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Manage your authenticated profile and configure the backend server
            endpoint
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                User Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Authenticated session details from{" "}
                <code className="text-indigo-600 dark:text-indigo-400">
                  /api/v1/me
                </code>
              </p>
            </div>
          </div>

          {user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-400 block font-medium">
                  Full Name
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-1 block">
                  {user.name}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-400 block font-medium">
                  Email Address
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-1 block">
                  {user.email}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-400 block font-medium">
                  User Identifier
                </span>
                <span className="font-mono text-slate-700 dark:text-zinc-300 mt-1 block">
                  {user.id}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-400 block font-medium">
                  Account Created
                </span>
                <span className="font-medium text-slate-700 dark:text-zinc-300 mt-1 block">
                  {formatDateTime(user.created_at)}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => refreshUser()}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Profile Info</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* API Server Endpoint Config */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  Backend API Server Endpoint
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Switch between live cloud deployments or your local
                  development daemon
                </p>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isChecking
                    ? "bg-amber-400 animate-ping"
                    : isOnline
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                }`}
              />
              <span
                className={
                  isOnline
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }
              >
                {isChecking
                  ? "Checking..."
                  : isOnline
                    ? "Connected"
                    : "Offline"}
              </span>
            </div>
          </div>

          {/* Preset Server Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Deployment Presets
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SERVER_PRESETS.map((preset) => {
                const isSelected = serverUrl === preset.url;
                return (
                  <div
                    key={preset.url}
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                        : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                          {preset.name}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600"
                              : "border-slate-300 dark:border-zinc-700"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800/80 font-mono text-[10px] text-slate-400 truncate">
                      {preset.url}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Server URL Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Custom API Base URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="https://..."
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <button
                onClick={handleSaveCustomUrl}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Apply URL
              </button>
            </div>
          </div>

          {/* Diagnostic Health Check Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Backend Liveness & Readiness Tests</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Pings <code className="text-indigo-600">/health</code> and{" "}
                <code className="text-indigo-600">/ready</code> to test database
                & API connectivity
              </p>
            </div>

            <div className="flex items-center gap-3">
              {healthResults && (
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span
                    className={
                      healthResults.online
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }
                  >
                    Liveness: {healthResults.online ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span
                    className={
                      healthResults.ready ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    Readiness: {healthResults.ready ? "✓" : "✗"}
                  </span>
                </div>
              )}

              <button
                onClick={handleRunHealthCheck}
                disabled={testingHealth}
                className="px-3.5 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {testingHealth ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                )}
                <span>Run Diagnostics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
