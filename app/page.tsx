"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import PricingSection from "@/components/home/PricingSection";
import AuctionCard from "@/components/home/AuctionCard";
import { mockAuctions } from "@/lib/mockData";
import { getAuctions } from "@/lib/api/auctions.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function SectionHeader({
  emoji,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black flex items-center gap-3 uppercase">
          <span className="text-4xl md:text-5xl">{emoji}</span>
          <span>{title}</span>
        </h2>
        <p className="text-gray-500 mt-2 text-base md:text-lg">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-black transition-colors group mb-1"
      >
        {linkLabel}
        <ArrowRight
          size={14}
          className="group-hover:translate-x-0.5 transition-transform"
        />
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
        const result = await getAuctions({ page: 1, limit: 12 });
        const fetchedAuctions = result.data?.auctions ?? [];
        if (result.success && fetchedAuctions.length > 0) {
          setAuctions(adaptAuctionsForDisplay(fetchedAuctions));
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
              href="/auctions"
              linkLabel="Check all items"
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
            <div className="mt-4 flex justify-end md:hidden">
              <Link
                href="/auctions"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-black transition-colors"
              >
                Check all items <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 2. LAST CALL */}
          {!isLoading && lastCallAuctions.length > 0 && (
            <div>
              <SectionHeader
                emoji="⏳"
                title="LAST CALL"
                subtitle="Last chance to bid. Don't miss out."
                href="/auctions?sort=ending_soon"
                linkLabel="See all ending soon"
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
              <div className="mt-4 flex justify-end md:hidden">
                <Link
                  href="/auctions?sort=ending_soon"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-black transition-colors"
                >
                  See all ending soon <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Dół sekcji — link NAD borderem, czarny */}
          <div className="flex justify-end pb-2 border-b border-gray-200">
            <Link
              href="/auctions"
              className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-gray-600 transition-colors uppercase tracking-widest group"
            >
              Browse all auctions
              <ArrowRight
                size={12}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      <PricingSection />
    </div>
  );
}
