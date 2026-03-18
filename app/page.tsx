"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import PricingSection from "@/components/home/PricingSection";
import AuctionCard from "@/components/home/AuctionCard";
import { mockAuctions } from "@/lib/mockData";
import { getSportsListings } from "@/lib/api/listings.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function SectionHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black flex items-center gap-3 uppercase">
        <span className="text-4xl md:text-5xl">{emoji}</span>
        <span>{title}</span>
      </h2>
      <p className="text-gray-500 mt-2 text-base md:text-lg">{subtitle}</p>
    </div>
  );
}

function ViewAllButton({
  href,
  label = "View All Items",
}: {
  href: string;
  label?: string;
}) {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold text-sm uppercase tracking-widest rounded-full hover:bg-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
      >
        {label}
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <ArrowRight size={14} />
        </div>
      </Link>
    </div>
  );
}

const popularBadges = [
  { text: "HOT", colors: "bg-red-500 text-white shadow-red-500/40" },
  { text: "RARE", colors: "bg-purple-600 text-white shadow-purple-600/40" },
  { text: "HOT", colors: "bg-red-500 text-white shadow-red-500/40" },
  { text: "RARE", colors: "bg-purple-600 text-white shadow-purple-600/40" },
  { text: "HOT", colors: "bg-red-500 text-white shadow-red-500/40" },
  { text: "RARE", colors: "bg-purple-600 text-white shadow-purple-600/40" },
];

export default function HomePage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        setIsLoading(true);
        const result = await getSportsListings({ page: 1, limit: 12 });

        if (result.success && result.data && result.data.length > 0) {
          const adaptedAuctions = adaptAuctionsForDisplay(result.data);
          setAuctions(adaptedAuctions);
        } else {
          setAuctions(mockAuctions);
        }
      } catch (err) {
        setAuctions(mockAuctions);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuctions();
  }, []);

  const displayAuctions = auctions.length > 0 ? auctions : mockAuctions;
  const popularAuctions = displayAuctions.slice(0, 6);
  const lastCallAuctions =
    displayAuctions.length > 6
      ? displayAuctions.slice(6, 12)
      : [...displayAuctions.slice(0, 6)];

  return (
    <div className="bg-white">
      <Hero />

      <section className="relative py-16 md:py-20 px-4 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100">
        <div className="w-full max-w-7xl mx-auto space-y-20">
          {/* 1. POPULAR */}
          <div>
            <SectionHeader
              emoji="🔥"
              title="POPULAR"
              subtitle="Most active auctions right now."
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularAuctions.map((auction, index) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    badge={popularBadges[index]}
                  />
                ))}
              </div>
            )}

            {/* CTA pod kartami */}
            <ViewAllButton href="/auctions" label="Browse All Popular Items" />
          </div>

          {/* 2. LAST CALL */}
          {!isLoading && lastCallAuctions.length > 0 && (
            <div>
              <SectionHeader
                emoji="⏳"
                title="LAST CALL"
                subtitle="Last chance to bid. Don't miss out."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lastCallAuctions.map((auction, index) => (
                  <AuctionCard
                    key={`lastcall-${auction.id}-${index}`}
                    auction={auction}
                    badge={{
                      text: "LAST CALL",
                      colors: "bg-orange-500 text-white shadow-orange-500/40",
                    }}
                  />
                ))}
              </div>

              {/* CTA pod kartami */}
              <ViewAllButton href="/auctions" label="See All Ending Soon" />
            </div>
          )}

          {/* Główny CTA na dole */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-6 font-medium">
              Thousands of items across all sports
            </p>
            <Link
              href="/auctions"
              className="inline-block px-12 py-5 bg-black text-white font-bold text-xl rounded-full hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-900 uppercase"
            >
              Check All Auctions
            </Link>
          </div>
        </div>
      </section>

      <PricingSection />
    </div>
  );
}
