import { Bid } from "@/types";

interface BidHistoryProps {
  bids: Bid[];
}

export default function BidHistory({ bids }: BidHistoryProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-light mb-6 pb-3 border-b border-gray-200">
        Bid History
      </h2>

      <div className="space-y-3">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className={`flex justify-between items-center p-5 rounded-[2px] border transition-all ${
              bid.isWinning
                ? "bg-gradient-to-br from-gold-50 to-gold-100 border-2 border-gold-500 shadow-md shadow-gold-500/20 relative overflow-hidden"
                : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            {/* Winning bid left border accent */}
            {bid.isWinning && (
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-gold-400 to-gold-500"></div>
            )}

            {/* Winning Badge */}
            {bid.isWinning && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-gold-400 to-gold-500 text-black px-3 py-1 rounded-[2px] text-xs font-bold uppercase tracking-widest shadow-md">
                Winning
              </div>
            )}

            {/* Left: User Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full flex-shrink-0 ${
                  bid.isWinning
                    ? "bg-gradient-to-br from-gold-400 to-gold-500 shadow-md shadow-gold-500/40"
                    : "bg-gradient-to-br from-gray-300 to-gray-200"
                }`}
              ></div>

              {/* User Details */}
              <div>
                <p
                  className={`text-base font-medium ${
                    bid.isWinning ? "text-black" : "text-black"
                  }`}
                >
                  {bid.username}
                </p>
                <p className="text-sm text-gray-600">{bid.time}</p>
              </div>
            </div>

            {/* Right: Bid Amount */}
            <div
              className={`text-2xl font-semibold ${
                bid.isWinning ? "text-gold-600" : "text-black"
              }`}
            >
              {bid.amount.toLocaleString("pl-PL")} zł
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
