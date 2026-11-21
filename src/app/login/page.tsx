'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Wordmark } from '@/components/landing/Wordmark';

export default function LoginPage() {
  const { login } = useAuth();

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
    const ok = await login({ email, password });
    if (!ok) {
      setLoginError('That email and password don’t match. Check them and try again, or create an account.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-paper px-5 py-8 text-ink">
      <Link href="/" aria-label="JobTracker home" className="inline-block">
        <Wordmark />
      </Link>

      <div className="mx-auto mt-12 w-full max-w-sm sm:mt-20">
        <h1 className="font-display text-3xl">Sign in</h1>
        <p className="mt-2 text-[15px] text-pencil">
          New here?{' '}
          <Link href="/register" className="font-semibold text-ink underline underline-offset-4">
            Create an account
          </Link>
        </p>

        {loginError && (
          <p role="alert" className="mt-6 border-l-[3px] border-stamp bg-white px-4 py-3 text-[15px]">
            {loginError}
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-ink/25 bg-white px-3.5 py-2.5 text-base outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-ink/25 bg-white px-3.5 py-2.5 pr-11 text-base outline-none focus:border-ink"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-pencil hover:text-ink"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-ink px-4 py-3 text-base font-semibold text-paper hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
