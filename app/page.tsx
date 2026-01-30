"use client";

import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";
import AuctionCard from "@/components/AuctionCard";
import { mockAuctions } from "@/lib/mockData";
import Link from "next/link";

// Simple Section Header Component (bez nadmiaru animacji)
function SectionHeader({
  emoji,
  title,
  subtitle,
  linkText,
  linkHref,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  linkText?: string;
  linkHref?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black flex items-center gap-3 uppercase">
            <span className="text-4xl md:text-5xl">{emoji}</span>
            <span>{title}</span>
          </h2>
          <p className="text-gray-500 mt-2 text-lg">{subtitle}</p>
        </div>
        {linkText && linkHref && (
          <Link
            href={linkHref}
            className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-red-600 hover:border-red-600 transition-all duration-300 uppercase"
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  // Popular - pierwsze 6 aukcji z oryginalnymi badge
  const popularAuctions = mockAuctions.slice(0, 6);
  const popularBadges = [
    { text: "HOT", colors: "bg-red-500 text-white shadow-red-500/40" },
    { text: "RARE", colors: "bg-purple-600 text-white shadow-purple-600/40" },
    { text: "HOT", colors: "bg-red-500 text-white shadow-red-500/40" },
    { text: "RARE", colors: "bg-purple-600 text-white shadow-purple-600/40" },
    { text: "HOT", colors: "bg-red-500 text-white shadow-red-500/40" },
    { text: "RARE", colors: "bg-purple-600 text-white shadow-purple-600/40" },
  ];

  // Last Call - ostatnie 3 aukcje (powtórzone żeby było 6)
  const lastCallAuctions = [
    ...mockAuctions.slice(6, 9),
    ...mockAuctions.slice(0, 3),
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />

      {/* --- MARKETPLACE SECTION (2 ROWS) --- */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100">
        <div className="w-full max-w-7xl mx-auto space-y-20">
          {/* 1. POPULAR */}
          <div>
            <SectionHeader
              emoji="🔥"
              title="POPULAR"
              subtitle="Most active auctions right now."
              linkText="Check all items"
              linkHref="/auctions"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularAuctions.map((auction, index) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  badge={popularBadges[index]}
                />
              ))}
            </div>
          </div>

          {/* 2. LAST CALL */}
          <div>
            <SectionHeader
              emoji="⏳"
              title="LAST CALL"
              subtitle="Last chance to bid. Don't miss out."
              linkText="Check all items"
              linkHref="/auctions"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lastCallAuctions.map((auction) => (
                <AuctionCard
                  key={`lastcall-${auction.id}`}
                  auction={auction}
                  badge={{
                    text: "LAST CALL",
                    colors: "bg-orange-500 text-white shadow-orange-500/40",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Check All Auctions Button */}
          <div className="text-center pt-8">
            <Link
              href="/auctions"
              className="inline-block px-12 py-5 bg-black text-white font-bold text-xl rounded-full hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-900 uppercase"
            >
              Check All Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />
    </div>
  );
}
