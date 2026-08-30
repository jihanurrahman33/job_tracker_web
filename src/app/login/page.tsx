'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useServer } from '@/context/ServerContext';
import {
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { isOnline, isChecking, serverUrl } = useServer();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!email || !password) return;
    setIsSubmitting(true);
    const success = await login({ email, password });
    if (!success) {
      setLoginError('Invalid email or password. Please verify your credentials or register an account.');
    }
    setIsSubmitting(false);
  };

  const handleFillDemo = () => {
    setEmail('john@example.com');
    setPassword('password123');
    setLoginError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            JobTracker
          </span>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-zinc-400">
          Or{' '}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 underline"
          >
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 sm:px-10 shadow-xl sm:rounded-3xl border border-slate-200/80 dark:border-zinc-800 animate-slide-up">
          {/* Quick Demo Fill Helper */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Need test credentials?</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Fill Demo User
            </button>
          </div>

          {/* In-Form Login Error Alert */}
          {loginError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 animate-slide-up">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-bold block">Sign In Failed</strong>
                <span>{loginError}</span>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Server Connection Info */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 truncate max-w-[220px]">
              <Server className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{serverUrl}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isChecking
                    ? 'bg-amber-400 animate-ping'
                    : isOnline
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-medium">
                {isChecking ? 'Checking...' : isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
