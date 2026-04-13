"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import PricingSection from "@/components/home/PricingSection";
import AuctionCard from "@/components/home/AuctionCard";
import { mockAuctions } from "@/lib/mockData";
import { getAuctions } from "@/lib/api/auctions.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
  emoji,
  label,
  title,
  subtitle,
}: {
  emoji: string;
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
        {emoji} {label}
      </p>
      <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase">
        {title}
      </h2>
      <p className="text-gray-500 mt-2 text-base">{subtitle}</p>
    </div>
  );
}

function ViewAllButton({ href }: { href: string }) {
  return (
    <div className="mt-5 flex justify-end">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-black transition-colors uppercase tracking-widest group"
      >
        View all
        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ─── Weighted random pick (stable per session, changes on refresh) ─────────────

function pickWeighted(pool: any[], count: number): any[] {
  if (pool.length <= count) return pool;
  // Shuffle using Math.random (changes on each page load/refresh)
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hotAdapted, setHotAdapted] = useState<any[]>([]);
  const [lastCall, setLastCall] = useState<any[]>([]);
  const [forYou, setForYou] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        setIsLoading(true);
        const result = await getAuctions({ page: 1, limit: 24 });
        const raw = result.success ? (result.data?.auctions ?? []) : [];
        const data = raw.length > 0 ? raw : mockAuctions;

        // 🔥 HOT OFFERS — top-9 by score, pick 3 randomly once on load
        const hotPool = [...data]
          .sort((a: any, b: any) =>
            ((b.rare ? 10 : 0) + (b.views ?? 0) * 0.5 + (b.bidCount ?? 0) * 2) -
            ((a.rare ? 10 : 0) + (a.views ?? 0) * 0.5 + (a.bidCount ?? 0) * 2)
          )
          .slice(0, 9);
        const hotPicked = pickWeighted(hotPool, 3);
        setHotAdapted(adaptAuctionsForDisplay(hotPicked as any));

        // ⏰ LAST CALL — ending within 7 hours, sorted by soonest, max 6
        const in7h = Date.now() + 7 * 60 * 60 * 1000;
        const lastCallRaw = [...data]
          .filter((a) => new Date(a.endTime).getTime() <= in7h)
          .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
          .slice(0, 6);
        // Fallback: if nothing ending in 7h, show 6 soonest overall
        const lastCallFinal = lastCallRaw.length > 0
          ? lastCallRaw
          : [...data]
              .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
              .slice(0, 6);
        setLastCall(adaptAuctionsForDisplay(lastCallFinal as any));

        // 💎 FOR YOU — rare + verified, exclude hot pool IDs
        const hotIds = new Set(hotPool.map((a: any) => a.id));
        const forYouRaw = [...data]
          .filter((a) => !hotIds.has(a.id))
          .sort((a: any, b: any) =>
            ((b.rare ? 8 : 0) + (b.verified ? 5 : 0) + (b.bidCount ?? 0) * 1.5) -
            ((a.rare ? 8 : 0) + (a.verified ? 5 : 0) + (a.bidCount ?? 0) * 1.5)
          )
          .slice(0, 4);
        setForYou(adaptAuctionsForDisplay(forYouRaw as any));
      } catch {
        setHotAdapted(adaptAuctionsForDisplay(mockAuctions.slice(0, 3) as any));
        setLastCall(adaptAuctionsForDisplay(mockAuctions.slice(0, 6) as any));
        setForYou(adaptAuctionsForDisplay(mockAuctions.slice(2, 6) as any));
      } finally {
        setIsLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  return (
    <div className="bg-white">
      <Hero />

      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100">
        <div className="w-full max-w-7xl mx-auto space-y-12">

          {/* ── 1. HOT OFFERS ───────────────────────────────────────────────── */}
          <div>
            <SectionHeader
              emoji="🔥"
              label="Featured"
              title="Hot Offers"
              subtitle="Rare and most-viewed picks — refreshes every time you visit."
            />
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {hotAdapted.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
            <ViewAllButton href="/auctions" />
          </div>

          <div className="border-t border-gray-200" />

          {/* ── 2. LAST CALL ────────────────────────────────────────────────── */}
          <div>
            <SectionHeader
              emoji="⏰"
              label="Ending Soon"
              title="Last Call"
              subtitle="These auctions are almost over. Last chance to place your bid."
            />
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lastCall.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
            <ViewAllButton href="/auctions" />
          </div>

          <div className="border-t border-gray-200" />

          {/* ── 3. FOR YOU ──────────────────────────────────────────────────── */}
          {(isAuthenticated || isLoading) && (
            <div>
              <SectionHeader
                emoji="💎"
                label="Recommended"
                title="Picked For You"
                subtitle="Rare, verified and high-activity items matched to your searches."
              />
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : forYou.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {forYou.map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                  <ViewAllButton href="/auctions" />
                </>
              ) : null}
            </div>
          )}

          {/* ── Bottom CTA ───────────────────────────────────────────────── */}
          <div className="flex justify-end pb-2 border-b border-gray-200">
            <Link
              href="/auctions"
              className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-gray-600 transition-colors uppercase tracking-widest group"
            >
              Browse all auctions
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      <PricingSection />
    </div>
  );
}
