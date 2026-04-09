"use client";

import { useEffect, useState } from "react";
import {
  getReviewsByUser,
  getReviewStats,
  type ReviewDto,
  type ReviewStatsDto,
} from "@/lib/api/reviews";
import { Star, ThumbsUp, Minus, ThumbsDown, Package } from "lucide-react";
import Image from "next/image";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

function SentimentIcon({ s }: { s: string }) {
  if (s === "positive") return <ThumbsUp size={14} className="text-emerald-500" />;
  if (s === "negative") return <ThumbsDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso),
  );

interface Props {
  userId: string;
}

export function UserReviews({ userId }: Props) {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [stats, setStats] = useState<ReviewStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReviewsByUser(userId), getReviewStats(userId)])
      .then(([r, s]) => {
        if (r.success && r.data) setReviews(r.data);
        if (s.success && s.data) setStats(s.data);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">Loading reviews…</div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package size={36} className="mx-auto text-gray-200 mb-2" />
        <p className="text-gray-400 text-sm">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      {stats && (
        <div className="bg-gray-50 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Average */}
          <div className="text-center pr-0 sm:pr-6 sm:border-r border-gray-200">
            <div className="text-4xl font-black text-gray-900">
              {stats.average.toFixed(1)}
            </div>
            <StarRow rating={Math.round(stats.average)} />
            <p className="text-xs text-gray-400 mt-1">{stats.total} reviews</p>
          </div>

          {/* Sentiment breakdown */}
          <div className="flex gap-6 flex-1">
            {[
              { label: "Positive", count: stats.positive, color: "text-emerald-600 bg-emerald-50", icon: <ThumbsUp size={14} /> },
              { label: "Neutral", count: stats.neutral, color: "text-gray-600 bg-gray-100", icon: <Minus size={14} /> },
              { label: "Negative", count: stats.negative, color: "text-red-600 bg-red-50", icon: <ThumbsDown size={14} /> },
            ].map(({ label, count, color, icon }) => (
              <div key={label} className="text-center">
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
                  {icon} {count}
                </div>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Positive % */}
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-600">
              {stats.positivePercentage}%
            </div>
            <p className="text-xs text-gray-400">positive</p>
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-sm font-bold text-gray-500">
                {r.reviewer.avatar ? (
                  <Image src={r.reviewer.avatar} alt={r.reviewer.username} width={36} height={36} className="object-cover" />
                ) : (
                  r.reviewer.username[0].toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {r.reviewer.username}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">{r.role}</span>
                  <SentimentIcon s={r.sentiment} />
                  <StarRow rating={r.rating} />
                  <span className="text-xs text-gray-300 ml-auto">{formatDate(r.createdAt)}</span>
                </div>

                {r.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                )}

                <p className="text-xs text-gray-300 mt-1 truncate">
                  Re: {r.auction.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
