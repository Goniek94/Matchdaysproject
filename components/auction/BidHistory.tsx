import { Crown } from "lucide-react";
import { Bid } from "@/types";

interface BidHistoryProps {
  bids: Bid[];
}

export default function BidHistory({ bids }: BidHistoryProps) {
  if (!bids || bids.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        No bids placed yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {bids.map((bid, _index) => (
        <div
          key={bid.id}
          className={`relative flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
            bid.isWinning
              ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-sm shadow-amber-100"
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          {/* Left accent bar for winning bid */}
          {bid.isWinning && (
            <div className="absolute left-0 top-0 w-[3px] h-full bg-gradient-to-b from-amber-400 to-yellow-500 rounded-l-xl" />
          )}

          {/* Left: Avatar + User info */}
          <div className="flex items-center gap-3 pl-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                bid.isWinning
                  ? "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-200"
                  : "bg-gray-100"
              }`}
            >
              {bid.isWinning ? (
                <Crown size={15} className="text-white" />
              ) : (
                <span className="text-xs font-bold text-gray-500 uppercase">
                  {bid.username?.[0] ?? "?"}
                </span>
              )}
            </div>

            <div>
              <p
                className={`text-sm font-semibold leading-tight ${
                  bid.isWinning ? "text-amber-800" : "text-gray-800"
                }`}
              >
                {bid.username}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {bid.time}
              </p>
            </div>
          </div>

          {/* Right: Amount + Winning badge */}
          <div className="flex items-center gap-2 shrink-0">
            {bid.isWinning && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded-full">
                Winning
              </span>
            )}
            <span
              className={`text-base font-black ${
                bid.isWinning ? "text-amber-600" : "text-gray-900"
              }`}
            >
              €{bid.amount.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
