'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Wordmark } from '@/components/landing/Wordmark';

export default function RegisterPage() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!name || !email || !password) return;
    setIsSubmitting(true);
    const ok = await register({ name, email, password });
    if (!ok) {
      setRegError('We couldn’t create the account. That email may already be registered, or a field is invalid.');
    }
    setIsSubmitting(false);
  };

  const field =
    'w-full rounded-md border border-ink/25 bg-white px-3.5 py-2.5 text-base outline-none focus:border-ink';

  return (
    <div className="min-h-screen bg-paper px-5 py-8 text-ink">
      <Link href="/" aria-label="JobTracker home" className="inline-block">
        <Wordmark />
      </Link>

      <div className="mx-auto mt-12 w-full max-w-sm sm:mt-20">
        <h1 className="font-display text-3xl">Create an account</h1>
        <p className="mt-2 text-[15px] text-pencil">
          Already have one?{' '}
          <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
            Sign in
          </Link>
        </p>

        {regError && (
          <p role="alert" className="mt-6 border-l-[3px] border-stamp bg-white px-4 py-3 text-[15px]">
            {regError}
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
            />
          </div>

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
              className={field}
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
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${field} pr-11`}
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
            <p className="mt-1.5 text-sm text-pencil">At least 8 characters.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-ink px-4 py-3 text-base font-semibold text-paper hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
