// src/components/ReviewSection.tsx
// Drop-in component for ListingDetail.tsx  →  <ReviewSection productId={id} />

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProductReviews, createReview } from "../utils/api";
import type { Review } from "../types";

// ── Star helpers ──────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: onChange ? "pointer" : "default",
            fontSize: 22,
            color:
              star <= (hovered || value) ? "#f59e0b" : "#d1d5db",
            padding: "0 1px",
            lineHeight: 1,
          }}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

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
    <section style={styles.section}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Customer Reviews</h2>
        {reviews.length > 0 && (
          <div style={styles.summary}>
            <span style={styles.avgNum}>{avg.toFixed(1)}</span>
            <StarRating value={Math.round(avg)} />
            <span style={styles.count}>({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Write a review */}
      {user && !submitted && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <p style={styles.formTitle}>Write a Review</p>
          <div style={styles.formRow}>
            <label style={styles.label}>Your Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder="Share your experience with this product..."
              style={styles.textarea}
            />
          </div>
          {submitError && <p style={styles.errorText}>{submitError}</p>}
          <button
            type="submit"
            disabled={submitting}
            style={submitting ? { ...styles.btn, opacity: 0.6 } : styles.btn}
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}

      {submitted && (
        <div style={styles.successBanner}>
          ✅ Thank you! Your review has been submitted.
        </div>
      )}

      {!user && (
        <p style={styles.loginPrompt}>
          <a href="/auth" style={styles.link}>Sign in</a> to leave a review.
        </p>
      )}

      {/* Review list */}
      {loading && <p style={styles.muted}>Loading reviews…</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p style={styles.muted}>No reviews yet. Be the first!</p>
      )}

      <div style={styles.list}>
        {reviews.map((r) => (
          <div key={r.review_id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.avatar}>
                {String(r.reviewer_id).slice(-2)}
              </div>
              <div>
                <StarRating value={r.rating} />
                <span style={styles.muted}>{timeAgo(r.created_at)}</span>
              </div>
            </div>
            <p style={styles.commentText}>{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Styles (inline so it works without extra CSS) ─────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginTop: 40,
    padding: "24px 0",
    borderTop: "1px solid #e5e7eb",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: "#111827",
  },
  summary: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  avgNum: {
    fontSize: 22,
    fontWeight: 800,
    color: "#f59e0b",
  },
  count: {
    fontSize: 14,
    color: "#6b7280",
  },
  form: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 28,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  formTitle: {
    fontWeight: 700,
    fontSize: 16,
    margin: 0,
    color: "#374151",
  },
  formRow: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  textarea: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    background: "#fff",
  },
  btn: {
    alignSelf: "flex-start",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  successBanner: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 500,
  },
  loginPrompt: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  link: {
    color: "#16a34a",
    fontWeight: 600,
    textDecoration: "none",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  card: {
    border: "1px solid #f3f4f6",
    borderRadius: 10,
    padding: 16,
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#d1fae5",
    color: "#065f46",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },
  commentText: {
    margin: 0,
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.6,
  },
  muted: {
    fontSize: 13,
    color: "#9ca3af",
    margin: "4px 0 0",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    margin: 0,
  },
};
