import { Auction } from "@/types";
import AuctionCard from "./AuctionCard";
import Link from "next/link";

interface EndingSoonProps {
  auctions: Auction[];
}

export default function EndingSoon({ auctions }: EndingSoonProps) {
  // Sort by time remaining and take last 4
  const endingSoonAuctions = auctions.slice(-4);

  return (
    <section className="py-20 px-8 bg-gray-50 border-t border-gray-200">
      <div className="container-max">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-light mb-2">Ending Soon</h2>
            <p className="text-gray-600">
              Don't miss out on these amazing opportunities
            </p>
          </div>
          <Link
            href="#"
            className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {endingSoonAuctions.map((auction, index) => (
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
