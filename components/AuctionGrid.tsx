import { Auction } from "@/types";
import AuctionCard from "./AuctionCard";

interface AuctionGridProps {
  auctions: Auction[];
}

export default function AuctionGrid({ auctions }: AuctionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {auctions.map((auction, index) => (
        <div
          key={auction.id}
          style={{
            animation: `fadeInUp 0.6s ease forwards`,
            animationDelay: `${index * 0.1}s`,
            opacity: 0,
          }}
        >
          <AuctionCard auction={auction} />
        </div>
      ))}
    </div>
  );
}
