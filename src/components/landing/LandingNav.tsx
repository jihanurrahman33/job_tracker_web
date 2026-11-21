"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Wordmark } from "./Wordmark";

export function LandingNav() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="text-ink" aria-label="JobTracker home">
        <Wordmark />
      </Link>
      <nav className="flex items-center gap-1 text-[15px] sm:gap-3">
        <a
          href="#what-it-keeps"
          className="hidden rounded px-3 py-2 text-pencil hover:text-ink sm:inline"
        >
          What it keeps
        </a>
        <a
          href="#numbers"
          className="hidden rounded px-3 py-2 text-pencil hover:text-ink sm:inline"
        >
          Your numbers
        </a>
        {isLoading ? null : isAuthenticated ? (
          <Link
            href="/dashboard"
            className="rounded-md bg-ink px-4 py-2 font-semibold text-paper hover:bg-indigo-700"
          >
            Open dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded px-3 py-2 font-medium text-ink hover:underline"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-ink px-4 py-2 font-semibold text-paper hover:bg-indigo-700"
            >
              Create an account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
