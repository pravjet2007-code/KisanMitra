// src/components/ReviewSection.tsx
// Drop-in component for ListingDetail.tsx  →  <ReviewSection productId={id} />

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProductReviews, createReview } from "../utils/api";
import type { Review } from "../types";

// ── Star helpers ──────────────────────────────────────────────────────────────

function averageRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  productId: number;
}

export default function ReviewSection({ productId }: Props) {
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── fetch reviews ──────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError("");
    getProductReviews(productId)
      .then(setReviews)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [productId]);

  // ── submit review ──────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const newReview = await createReview(
        {
          product_id: productId,
          rating,
          comment,
          reviewer_id: user.user_id,
          reviewer_name: user.full_name,
        },
        token ?? undefined
      );
      setReviews((prev) => [newReview, ...prev]);
      setComment("");
      setRating(5);
      setSubmitted(true);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  const avg = averageRating(reviews);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <section className="mt-10 py-6 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <h2 className="text-xl font-bold m-0 text-dark">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-amber-500">{avg.toFixed(1)}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-xl ${star <= Math.round(avg) ? 'text-amber-500' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-sm text-muted">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Write a review */}
      {user && !submitted && (
        <form onSubmit={handleSubmit} className="bg-offwhite border border-border rounded-2xl p-5 mb-7 flex flex-col gap-4 shadow-xs">
          <p className="font-bold text-base m-0 text-dark">Write a Review</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-amber-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder="Share your experience with this product..."
              className="border border-border rounded-xl px-4 py-3 text-sm font-sans resize-y outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage bg-white transition-all"
            />
          </div>
          {submitError && <p className="text-red-500 text-xs m-0">{submitError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className={`self-start bg-sage text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer transition-all hover:bg-sage-dark shadow-sm ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}

      {submitted && (
        <div className="bg-sage/10 text-sage-dark px-4 py-3 rounded-xl mb-5 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <span className="text-lg">✅</span> Thank you! Your review has been submitted.
        </div>
      )}

      {!user && (
        <p className="text-sm text-muted mb-5">
          <a href="/auth" className="text-sage font-semibold no-underline hover:underline">Sign in</a> to leave a review.
        </p>
      )}

      {/* Review list */}
      {loading && <p className="text-sm text-muted">Loading reviews…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-sm text-muted italic">No reviews yet. Be the first!</p>
      )}

      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r.review_id} className="border border-light rounded-2xl p-4 bg-white shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-sage/10 text-sage-dark flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                {r.reviewer?.full_name ? r.reviewer.full_name.charAt(0) : String(r.reviewer_id).slice(-2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold m-0 text-dark">
                  {r.reviewer?.full_name || `Farmer ${r.reviewer_id}`}
                </p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-sm ${star <= r.rating ? 'text-amber-500' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
                <p className="text-[11px] text-muted m-0">{timeAgo(r.created_at)}</p>
              </div>
            </div>
            <p className="m-0 text-sm text-dark leading-relaxed">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
