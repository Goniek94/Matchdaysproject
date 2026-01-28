import { Auction } from "@/types";
import AuctionCard from "./AuctionCard";
import Link from "next/link";

interface HotOffersProps {
  auctions: Auction[];
}

export default function HotOffers({ auctions }: HotOffersProps) {
  const hotAuctions = auctions.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 sm:gap-0 mb-8 sm:mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-1 sm:mb-2">Hot Offers</h2>
            <p className="text-sm sm:text-base text-gray-600">
              The most sought-after items right now
            </p>
          </div>
          <Link
            href="#"
            className="text-xs sm:text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            See More →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
