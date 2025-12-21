import { MyActiveBid } from "@/types";
import Link from "next/link";

interface MyActiveBidsSectionProps {
  bids: MyActiveBid[];
}

export default function MyActiveBidsSection({
  bids,
}: MyActiveBidsSectionProps) {
  return (
    <div className="mb-20 p-10 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-[2px]">
      <div className="mb-8">
        <h2 className="text-4xl font-light mb-3">My Active Bids</h2>
        <p className="text-gray-600">
          Track your ongoing auctions in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className="bg-white border border-gray-200 rounded-[2px] overflow-hidden hover:shadow-lg hover:translate-y-[-4px] transition-all"
          >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
              <img
                src={bid.image}
                alt={bid.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-base font-medium mb-3">{bid.title}</h3>

              {/* Status badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 mb-4 rounded-[2px] text-xs font-medium uppercase tracking-wide ${
                  bid.status === "winning"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {bid.status === "winning" ? "Winning" : "Outbid"}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                    Your Bid
                  </p>
                  <p className="text-base font-medium">
                    {bid.myBid.toLocaleString("pl-PL")} zł
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                    {bid.status === "winning" ? "Time Left" : "Current Bid"}
                  </p>
                  <p className="text-base font-medium">
                    {bid.status === "winning"
                      ? bid.timeLeft
                      : bid.currentBid.toLocaleString("pl-PL") + " zł"}
                  </p>
                </div>
              </div>

              {/* Action button */}
              <Link href={`/auction/${bid.id}`}>
                <button className="w-full bg-black text-white py-3 text-xs font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-[2px]">
                  {bid.status === "winning"
                    ? "View Auction →"
                    : "Place Higher Bid →"}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
