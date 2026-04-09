"use client";

import { useState } from "react";
import {
  submitReview,
  type ReviewSentiment,
  type PendingReviewDto,
} from "@/lib/api/reviews";
import { ThumbsUp, Minus, ThumbsDown, Star, CheckCircle, X } from "lucide-react";
import Image from "next/image";

interface ReviewFormProps {
  pending: PendingReviewDto;
  onSubmitted: (auctionId: string) => void;
  onCancel?: () => void;
}

const SENTIMENTS: {
  value: ReviewSentiment;
  label: string;
  icon: React.ReactNode;
  active: string;
  inactive: string;
}[] = [
  {
    value: "positive",
    label: "Positive",
    icon: <ThumbsUp size={18} />,
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive: "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600",
  },
  {
    value: "neutral",
    label: "Neutral",
    icon: <Minus size={18} />,
    active: "bg-gray-500 text-white border-gray-500",
    inactive: "border-gray-200 text-gray-500 hover:border-gray-400",
  },
  {
    value: "negative",
    label: "Negative",
    icon: <ThumbsDown size={18} />,
    active: "bg-red-500 text-white border-red-500",
    inactive: "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600",
  },
];

export function ReviewForm({ pending, onSubmitted, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [sentiment, setSentiment] = useState<ReviewSentiment>("positive");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) { setError("Select a star rating"); return; }
    try {
      setSubmitting(true);
      setError("");
      const res = await submitReview(pending.auctionId, { rating, sentiment, comment: comment.trim() || undefined });
      if (res.success) {
        setDone(true);
        setTimeout(() => onSubmitted(pending.auctionId), 1200);
      } else {
        setError(res.message ?? "Failed to submit");
      }
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-6 gap-2">
        <CheckCircle size={36} className="text-emerald-500" />
        <p className="font-semibold text-gray-800">Review submitted!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {pending.image ? (
            <Image src={pending.image} alt={pending.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{pending.title}</p>
          <p className="text-xs text-gray-400">
            {pending.isBuyer ? "You bought from" : "Sold to"}{" "}
            <span className="font-medium text-gray-600">
              {pending.counterparty?.username ?? "Unknown"}
            </span>
            {" · "}€{pending.price.toLocaleString()}
          </p>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={15} className="text-gray-400" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Sentiment */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Overall experience
          </p>
          <div className="flex gap-2">
            {SENTIMENTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSentiment(s.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  sentiment === s.value ? s.active : s.inactive
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stars */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Star rating
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`transition-colors ${
                    (hovered || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-400 self-center">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Comment <span className="font-normal normal-case">(optional)</span>
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              pending.isBuyer
                ? "Fast shipping, item exactly as described…"
                : "Great buyer, quick payment…"
            }
            maxLength={1000}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          />
          <p className="text-right text-xs text-gray-300 mt-1">{comment.length}/1000</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
