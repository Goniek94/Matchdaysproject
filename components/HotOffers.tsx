import { Auction } from "@/types";
import AuctionCard from "./AuctionCard";
import Link from "next/link";

interface HotOffersProps {
  auctions: Auction[];
}

export default function HotOffers({ auctions }: HotOffersProps) {
  const hotAuctions = auctions.slice(0, 4);

  return (
    <section className="py-20 px-8 bg-white">
      <div className="container-max">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-light mb-2">Hot Offers</h2>
            <p className="text-gray-600">
              The most sought-after items right now
            </p>
          </div>
          <Link
            href="#"
            className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
          >
            See More →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotAuctions.map((auction, index) => (
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
      </div>
    </section>
  );
}
