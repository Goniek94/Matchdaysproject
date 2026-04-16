"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gavel, Clock, Trophy, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";
import apiClient from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MyBidEntry {
  bidId: string;
  myBidAmount: number;
  currentBid: number;
  isWinning: boolean;
  isWon: boolean;
  auction: {
    id: string;
    title: string;
    status: string;
    endTime: string;
    image: string | null;
    listingType: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimeLeft(endTimeIso: string): string {
  const diff = new Date(endTimeIso).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const totalMinutes = Math.floor(diff / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

function StatusBadge({ entry }: { entry: MyBidEntry }) {
  const { status } = entry.auction;

  if (entry.isWon)
    return (
      <span className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
        <Trophy size={10} /> Won
      </span>
    );

  if (status === "sold" || status === "ended")
    return (
      <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
        Ended
      </span>
    );

  if (entry.isWinning)
    return (
      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        <TrendingUp size={10} /> Winning
      </span>
    );

  return (
    <span className="flex items-center gap-1 text-[11px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
      <AlertCircle size={10} /> Outbid
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardBids() {
  const [bids, setBids] = useState<MyBidEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: MyBidEntry[] }>("/bids/my")
      .then((res) => {
        if (res.data.success) setBids(res.data.data ?? []);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const active = bids.filter(
    (b) => b.auction.status === "active",
  );
  const past = bids.filter(
    (b) => b.auction.status !== "active",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Gavel size={13} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
            Bid Activity
          </span>
        </div>
        <h1 className="text-lg font-black text-gray-900">My Bids</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Auctions you&apos;re participating in
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 border-2 border-dashed border-red-100 rounded-2xl bg-red-50/50">
          <AlertCircle size={28} className="text-red-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-red-500 mb-1">Could not load bids</p>
          <p className="text-xs text-red-400">Make sure the backend is running, then reload.</p>
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Gavel size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-bold text-gray-600 mb-1">No bids yet</p>
          <p className="text-xs text-gray-400 mb-5">
            Find something worth bidding on in the marketplace.
          </p>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-black rounded-xl hover:bg-gray-800 transition-colors"
          >
            Browse Auctions
            <ArrowRight size={12} />
          </Link>
        </div>
      ) : (
        <>
          {/* Active auctions */}
          {active.length > 0 && (
            <section>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Active — {active.length}
              </p>
              <div className="space-y-3">
                {active.map((entry) => (
                  <BidCard key={entry.bidId} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {/* Past auctions */}
          {past.length > 0 && (
            <section>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Past — {past.length}
              </p>
              <div className="space-y-3">
                {past.map((entry) => (
                  <BidCard key={entry.bidId} entry={entry} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function BidCard({ entry }: { entry: MyBidEntry }) {
  const isActive = entry.auction.status === "active";

  return (
    <Link
      href={`/auction/${entry.auction.id}`}
      className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {entry.auction.image ? (
          <Image
            src={entry.auction.image}
            alt={entry.auction.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gavel size={20} className="text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-bold text-gray-900 truncate leading-tight">
            {entry.auction.title}
          </p>
          <StatusBadge entry={entry} />
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          {/* My bid */}
          <span>
            My bid:{" "}
            <span className="font-black text-gray-900">
              €{entry.myBidAmount.toLocaleString()}
            </span>
          </span>

          {/* Current bid (if outbid) */}
          {!entry.isWinning && isActive && (
            <span className="text-red-500 font-bold">
              Current: €{entry.currentBid.toLocaleString()}
            </span>
          )}

          {/* Time left */}
          {isActive && (
            <span className="flex items-center gap-1 text-gray-400">
              <Clock size={10} />
              {formatTimeLeft(entry.auction.endTime)}
            </span>
          )}
        </div>
      </div>

      <ArrowRight
        size={14}
        className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
      />
    </Link>
  );
}
