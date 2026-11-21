"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { ReviewsResponse } from "@/types/api";
import { Stars } from "./Stars";

export function LandingReviews() {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let live = true;
    api
      .getReviews()
      .then((res) => {
        if (!live) return;
        setData(res);
        setStatus("ready");
      })
      .catch(() => live && setStatus("failed"));
    return () => {
      live = false;
    };
  }, []);

  const count = data?.summary.count ?? 0;

  return (
    <section id="reviews" className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="max-w-[22ch] font-display text-3xl leading-tight sm:text-4xl">
          What people who use it think.
        </h2>

        {status === "loading" && (
          <div className="mt-10 h-32 animate-pulse bg-paper/10" aria-busy="true" />
        )}

        {status !== "loading" && count === 0 && (
          <div className="mt-8 max-w-xl">
            <p className="text-[17px] leading-relaxed text-paper/80">
              No reviews yet. Ratings and comments come from signed-in users
              only, and every one appears here as written. Use JobTracker for a
              while, then leave yours from your dashboard.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-md bg-marker px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white"
            >
              Create an account
            </Link>
          </div>
        )}

        {status === "ready" && data && count > 0 && (
          <div className="mt-10 grid gap-12 lg:grid-cols-[17rem_1fr] lg:gap-16">
            <div>
              <p className="font-display text-6xl leading-none">
                {data.summary.average.toFixed(1)}
              </p>
              <Stars value={data.summary.average} className="mt-3 text-marker" size={22} />
              <p className="mt-2 text-sm text-paper/70">
                from {count} {count === 1 ? "review" : "reviews"}
              </p>

              <ul className="mt-6 space-y-1.5" aria-label="Ratings breakdown">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = data.summary.distribution[String(star)] ?? 0;
                  return (
                    <li key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-10 text-paper/70">{star} star</span>
                      <span className="h-2 flex-1 bg-paper/15">
                        <span
                          className="block h-2 bg-marker"
                          style={{ width: `${(n / count) * 100}%` }}
                        />
                      </span>
                      <span className="w-5 text-right tabular-nums text-paper/70">{n}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <ul className="divide-y divide-paper/15 border-y border-paper/15">
              {data.data.length === 0 && (
                <li className="py-6 text-[15px] text-paper/70">
                  People have rated JobTracker but none has written a comment yet.
                </li>
              )}
              {data.data.map((r) => (
                <li key={r.id} className="py-6">
                  <Stars value={r.rating} className="text-marker" size={16} />
                  <p className="mt-3 max-w-[40rem] text-[17px] leading-relaxed">{r.comment}</p>
                  <p className="mt-3 text-sm text-paper/65">
                    {r.author}, {format(new Date(r.created_at), "MMMM yyyy")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
