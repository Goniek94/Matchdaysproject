"use client";

import { Star, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

type ReviewType = "positive" | "neutral" | "negative";

// Mock reviews — replace with real API when reviews backend is ready
const MOCK_REVIEWS: Array<{ id: string; reviewer: string; rating: number; type: ReviewType; comment: string; item: string; date: string }> = [
  {
    id: "1",
    reviewer: "piotr_k",
    rating: 5,
    type: "positive",
    comment: "Great seller! Item exactly as described, fast shipping. Highly recommended.",
    item: "Ajax 2019/20 Home Kit",
    date: "2025-03-14",
  },
  {
    id: "2",
    reviewer: "marek88",
    rating: 5,
    type: "positive",
    comment: "Packed perfectly, arrived in 3 days. Jersey is in mint condition. Will buy again.",
    item: "Barcelona 2010/11 Messi #10",
    date: "2025-02-28",
  },
  {
    id: "3",
    reviewer: "tomek_fc",
    rating: 3,
    type: "neutral",
    comment: "Item was OK but shipping took longer than expected.",
    item: "Real Madrid Training Jacket",
    date: "2025-01-10",
  },
];

const TYPE_STYLE = {
  positive: { icon: <ThumbsUp size={13}/>, color: "text-emerald-600 bg-emerald-50", label: "Positive" },
  neutral:  { icon: <Minus size={13}/>,    color: "text-amber-600 bg-amber-50",     label: "Neutral" },
  negative: { icon: <ThumbsDown size={13}/>, color: "text-red-600 bg-red-50",       label: "Negative" },
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}/>
      ))}
    </div>
  );
}

export function DashboardReviews() {
  const positive = MOCK_REVIEWS.filter(r => r.type === "positive").length;
  const neutral  = MOCK_REVIEWS.filter(r => r.type === "neutral").length;
  const negative = MOCK_REVIEWS.filter(r => r.type === "negative").length;
  const total    = MOCK_REVIEWS.length;
  const score    = total > 0 ? Math.round((positive / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-gray-900">Reviews</h2>
        <p className="text-xs text-gray-400 mt-0.5">Opinions left after transactions</p>
      </div>

      {/* Summary bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-black text-gray-900">{score}%</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Positive</p>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <RatingBar label="Positive" count={positive} total={total} color="bg-emerald-500"/>
          <RatingBar label="Neutral"  count={neutral}  total={total} color="bg-amber-400"/>
          <RatingBar label="Negative" count={negative} total={total} color="bg-red-400"/>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-gray-900">{total}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Total</p>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {MOCK_REVIEWS.map(review => {
          const cfg = TYPE_STYLE[review.type];
          return (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0">
                    {review.reviewer[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{review.reviewer}</p>
                    <StarRow rating={review.rating}/>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(review.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              <p className="text-[11px] text-gray-400 font-medium">Re: {review.item}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RatingBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-14 text-right">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }}/>
      </div>
      <span className="text-xs font-bold text-gray-500 w-4">{count}</span>
    </div>
  );
}
