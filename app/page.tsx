"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import PricingSection from "@/components/home/PricingSection";
import AuctionCard from "@/components/home/AuctionCard";
import { getAuctions } from "@/lib/api/auctions.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import type { AuctionDisplayDto } from "@/lib/utils/auction-adapter";
import type { AuctionDto } from "@/types/api/auction.types";
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

/**
 * Pads an array of items to `targetCount` by cycling through a fallback pool.
 * Used to keep card rows visually full even when a category (e.g. buy-now)
 * is undersupplied — better to show a repeated real listing than an empty
 * slot, until the marketplace has enough inventory.
 */
function padFromPool<T>(items: T[], targetCount: number, pool: T[]): T[] {
  if (items.length >= targetCount || pool.length === 0) return items;
  const result = [...items];
  let i = 0;
  while (result.length < targetCount) {
    result.push(pool[i % pool.length]);
    i++;
  }
  return result;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  // "Live Now" — the marketplace pulse, two 3-card rows side-by-side.
  const [liveBids, setLiveBids] = useState<AuctionDisplayDto[]>([]);
  const [liveBuyNow, setLiveBuyNow] = useState<AuctionDisplayDto[]>([]);
  const [lastCall, setLastCall] = useState<AuctionDisplayDto[]>([]);
  const [forYou, setForYou] = useState<AuctionDisplayDto[]>([]);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        setIsLoading(true);
        const result = await getAuctions({ page: 1, limit: 24, status: "active" });
        const data: AuctionDto[] = result.success ? (result.data?.auctions ?? []) : [];

        // 🔥 LIVE BIDS — top 4 auctions by recent bid activity. If we don't
        //    have 4 yet, cycle through whatever active listings exist so the
        //    row stays visually full (better than empty slots while the
        //    marketplace bootstraps).
        const auctionsOnly = data.filter((a) => a.listingType !== "buy_now");
        const bidScoreA = (a: AuctionDto) =>
          (a.bidCount ?? 0) * 3 + (a.views ?? 0) * 0.2 + (a.rare ? 5 : 0);
        const liveBidsRaw = [...auctionsOnly]
          .sort((a, b) => bidScoreA(b) - bidScoreA(a))
          .slice(0, 4);
        const liveBidsPadded = padFromPool(liveBidsRaw, 4, data);
        setLiveBids(adaptAuctionsForDisplay(liveBidsPadded));

        // 🛒 LIVE BUY NOW — 4 buy-now items, newest first, padded from the
        //    overall pool if short.
        const buyNowOnly = data.filter(
          (a) => a.listingType === "buy_now" || a.listingType === "auction_buy_now",
        );
        const liveBuyNowRaw = [...buyNowOnly]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        const liveBuyNowPadded = padFromPool(liveBuyNowRaw, 4, data);
        setLiveBuyNow(adaptAuctionsForDisplay(liveBuyNowPadded));

        // ⏰ LAST CALL — auctions ending within 7h, 8 cards in a 4-col grid.
        const in7h = Date.now() + 7 * 60 * 60 * 1000;
        const lastCallRaw = [...auctionsOnly]
          .filter((a) => new Date(a.endTime).getTime() <= in7h)
          .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
          .slice(0, 8);
        const lastCallFinal = lastCallRaw.length > 0
          ? lastCallRaw
          : [...auctionsOnly]
              .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
              .slice(0, 8);
        const lastCallPadded = padFromPool(lastCallFinal, 8, data);
        setLastCall(adaptAuctionsForDisplay(lastCallPadded));

        // 💎 FOR YOU — rare + verified, excluding what's already shown in Live Now.
        const featuredIds = new Set([
          ...liveBidsRaw.map((a) => a.id),
          ...liveBuyNowRaw.map((a) => a.id),
        ]);
        const forYouRaw = [...data]
          .filter((a) => !featuredIds.has(a.id))
          .sort((a, b) =>
            ((b.rare ? 8 : 0) + (b.verified ? 5 : 0) + (b.bidCount ?? 0) * 1.5) -
            ((a.rare ? 8 : 0) + (a.verified ? 5 : 0) + (a.bidCount ?? 0) * 1.5)
          )
          .slice(0, 4);
        const forYouPadded = padFromPool(forYouRaw, 4, data);
        setForYou(adaptAuctionsForDisplay(forYouPadded));
      } catch {
        setLiveBids([]);
        setLiveBuyNow([]);
        setLastCall([]);
        setForYou([]);
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

          {/* ── 1. LIVE NOW ─────────────────────────────────────────────────── */}
          {/* The marketplace pulse — bidding action + instant-buy stock in
              a single block so the homepage feels alive the moment you land. */}
          <div>
            <SectionHeader
              emoji="⚡"
              label="Live now"
              title="The Market, Right Now"
              subtitle="What's getting bid up and what's ready to take home today."
            />

            {/* Two parallel rows of 3 — auctions on top, buy-now below.
                Each sub-block has its own micro-header and "View all". */}
            <div className="space-y-10">
              {/* Live bids */}
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      Bidding
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      Hot bids on jerseys
                    </h3>
                  </div>
                  <Link
                    href="/auctions?listingType=auction"
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                  >
                    All auctions
                    <ArrowRight size={11} />
                  </Link>
                </div>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={`b-${i}`} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {liveBids.map((auction, i) => (
                      <AuctionCard key={`bid-${auction.id}-${i}`} auction={auction} />
                    ))}
                  </div>
                )}
              </div>

              {/* Live buy-now */}
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Buy now
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      Available today
                    </h3>
                  </div>
                  <Link
                    href="/auctions?listingType=buy_now"
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                  >
                    All buy now
                    <ArrowRight size={11} />
                  </Link>
                </div>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={`n-${i}`} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {liveBuyNow.map((auction, i) => (
                      <AuctionCard key={`buy-${auction.id}-${i}`} auction={auction} />
                    ))}
                  </div>
                )}
              </div>
            </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {lastCall.map((auction, i) => (
                  <AuctionCard key={`last-${auction.id}-${i}`} auction={auction} />
                ))}
              </div>
            )}
            <ViewAllButton href="/auctions" />
          </div>

          <div className="border-t border-gray-200" />

          {/* ── 3. FOR YOU ──────────────────────────────────────────────────── */}
          {(isLoading || forYou.length > 0) && (
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
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {forYou.map((auction, i) => (
                      <AuctionCard key={`fy-${auction.id}-${i}`} auction={auction} />
                    ))}
                  </div>
                  <ViewAllButton href="/auctions" />
                </>
              )}
            </div>
          )}

          {/* ── Bottom CTA ───────────────────────────────────────────────── */}
          <div className="flex justify-end pb-2 border-b border-gray-200">
            <Link
              href="/auctions"
              className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-gray-600 transition-colors uppercase tracking-widest group"
            >
              Browse the full market
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      <PricingSection />
    </div>
  );
}
