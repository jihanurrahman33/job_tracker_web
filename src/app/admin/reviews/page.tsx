"use client";

import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { AdminShell } from "@/components/admin/AdminShell";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Stars } from "@/components/reviews/Stars";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { AdminReview, Pagination as PaginationInfo } from "@/types/api";

export default function AdminReviewsPage() {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [info, setInfo] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [target, setTarget] = useState<AdminReview | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setFailed(false);
    api
      .adminReviews({ page, limit: 20 })
      .then((res) => {
        setReviews(res.data || []);
        setInfo(res.pagination);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async () => {
    if (!target) return;
    try {
      await api.adminDeleteReview(target.id);
      success("Review removed", "It no longer appears on the home page.");
    } catch (err: any) {
      error("Couldn't remove the review", err.message);
    }
    setTarget(null);
    load();
  };

  return (
    <AdminShell>
      <h2 className="mb-1 font-display text-2xl text-ink">Reviews</h2>
      <p className="mb-5 max-w-xl text-sm text-pencil">
        Every rating people have left. Removing one takes it off the home page and out of the average.
      </p>

      {failed && (
        <div className="border-l-[3px] border-stamp bg-white px-5 py-4">
          <p className="font-semibold text-ink">The reviews didn&rsquo;t load.</p>
          <button onClick={load} className="mt-2 text-sm font-medium underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!failed && (
        <ul className={`divide-y divide-rule border-y border-ink/25 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          {reviews.map((r) => (
            <li key={r.id} className="flex flex-wrap items-start justify-between gap-4 py-5">
              <div className="min-w-0 max-w-2xl">
                <Stars value={r.rating} size={16} className="text-ink" />
                {r.comment ? (
                  <p className="mt-2 text-[16px] leading-relaxed text-ink">{r.comment}</p>
                ) : (
                  <p className="mt-2 text-[15px] text-pencil">Rating only, no comment.</p>
                )}
                <p className="mt-2 text-sm text-pencil">
                  {r.author || "No name"}, {r.email}, {format(new Date(r.created_at), "d MMM yyyy")}
                </p>
              </div>
              <button
                onClick={() => setTarget(r)}
                className="text-sm font-medium text-stamp underline underline-offset-4"
              >
                Remove
              </button>
            </li>
          ))}
          {!loading && reviews.length === 0 && (
            <li className="py-6 text-[15px] text-pencil">No reviews yet.</li>
          )}
        </ul>
      )}

      <Pagination info={info} onPage={setPage} />

      <ConfirmDialog
        isOpen={!!target}
        onClose={() => setTarget(null)}
        onConfirm={remove}
        title="Remove review"
        message={`Remove this ${target?.rating}-star review by ${target?.email}? The author can write a new one.`}
        isDestructive
        confirmText="Remove review"
      />
    </AdminShell>
  );
}
