"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const STAR =
  "M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z";
const MAX_COMMENT = 600;
const LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

/** Lets the signed-in user rate JobTracker. One review per user. */
export function ReviewPrompt() {
  const { success, error } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let live = true;
    api
      .getMyReview()
      .then((res) => {
        if (!live) return;
        if (res.data) {
          setRating(res.data.rating);
          setComment(res.data.comment);
          setHasReview(true);
        }
      })
      .catch(() => {})
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    setSaving(true);
    try {
      await api.saveMyReview({ rating, comment: comment.trim() });
      setHasReview(true);
      success(
        hasReview ? "Review updated" : "Review saved",
        "It now appears on the home page.",
      );
    } catch (err: any) {
      error("Couldn't save your review", err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.deleteMyReview();
      setRating(0);
      setComment("");
      setHasReview(false);
      success("Review removed", "It no longer appears on the home page.");
    } catch (err: any) {
      error("Couldn't remove your review", err.message);
    }
  };

  if (!loaded) return null;

  const shown = hover || rating;

  return (
    <section className="border-t border-ink/25 pt-8" aria-labelledby="review-heading">
      <h3 id="review-heading" className="font-display text-2xl text-ink">
        {hasReview ? "Your review" : "Rate JobTracker"}
      </h3>
      <p className="mt-1 max-w-xl text-sm text-pencil">
        Your rating and comment appear on the home page under your first name and last
        initial. You can change or remove them at any time.
      </p>

      <form onSubmit={save} className="mt-5 max-w-xl space-y-4">
        <div>
          <div
            role="radiogroup"
            aria-label="Your rating"
            className="flex items-center gap-1"
            onMouseLeave={() => setHover(0)}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={rating === i}
                aria-label={`${i} ${i === 1 ? "star" : "stars"}, ${LABELS[i - 1]}`}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                className="rounded p-0.5 text-ink"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d={STAR}
                    fill="currentColor"
                    fillOpacity={i <= shown ? 1 : 0.18}
                    stroke="currentColor"
                    strokeOpacity={0.5}
                    strokeWidth="0.8"
                  />
                </svg>
              </button>
            ))}
            <span className="ml-3 text-sm text-pencil" aria-live="polite">
              {shown > 0 ? LABELS[shown - 1] : "Choose a rating"}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="review-comment" className="mb-1.5 block text-sm font-semibold text-ink">
            What has it helped with? <span className="font-normal text-pencil">(optional)</span>
          </label>
          <textarea
            id="review-comment"
            rows={3}
            maxLength={MAX_COMMENT}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-md border border-ink/25 bg-white px-3.5 py-2.5 text-base outline-none focus:border-ink"
          />
          <p className="mt-1 text-right text-xs tabular-nums text-pencil">
            {comment.length}/{MAX_COMMENT}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="submit"
            disabled={rating < 1 || saving}
            className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : hasReview ? "Update review" : "Save review"}
          </button>
          {hasReview && (
            <button
              type="button"
              onClick={remove}
              className="text-sm font-medium text-pencil underline underline-offset-4 hover:text-stamp"
            >
              Remove my review
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
