"use client";

import { useEffect, useState } from "react";
import ImageGallery from "@/components/auction/ImageGallery";
import CountdownTimer from "@/components/auction/CountdownTimer";
import BidPanel from "@/components/auction/BidPanel";
import BuyNowPanel from "@/components/auction/BuyNowPanel";
import SellerInfo from "@/components/auction/SellerInfo";
import BidHistory from "@/components/auction/BidHistory";
import InfoCards from "@/components/auction/InfoCards";
import Link from "next/link";

// --- MOCK DATA (DEMO) ---
import { mockAuctions, mockBidHistory } from "@/lib/mockData";

interface AuctionDetailPageProps {
  params: {
    id: string;
  };
}

export default function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      loadAuctionData(params.id);
    }
  }, [params.id]);

  const loadAuctionData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const foundAuction = mockAuctions.find((a) => a.id === id);

      if (!foundAuction) {
        setError("Auction not found (Demo)");
        setLoading(false);
        return;
      }

      await new Promise((r) => setTimeout(r, 500));

      setAuction({
        ...foundAuction,
        currentBid: foundAuction.price,
        bidCount: foundAuction.bids,
        listingType: foundAuction.type,
        images:
          foundAuction.images ||
          (foundAuction.image ? [foundAuction.image] : []),
        status: "active",
        endTime: calculateDemoEndTime(foundAuction.endTime),
      });

      setBids(mockBidHistory);
    } catch (err: any) {
      console.error("Error loading auction:", err);
      setError(err.message || "Failed to load auction");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (amount: number) => {
    try {
      setBidding(true);
      setError(null);

      await new Promise((r) => setTimeout(r, 1000));
      alert(`🎉 DEMO: Twój bid (${amount} €) przyjęty!`);

      const newBid = {
        id: Date.now().toString(),
        username: "You (Demo)",
        amount: amount,
        time: "Just now",
        isWinning: true,
      };
      setBids((prev) => [
        newBid,
        ...prev.map((b) => ({ ...b, isWinning: false })),
      ]);
      setAuction((prev: any) => ({
        ...prev,
        currentBid: amount,
        bidCount: (prev.bidCount || 0) + 1,
      }));
    } catch (err: any) {
      console.error("Error placing bid:", err);
      alert(err.message || "Failed to place bid");
    } finally {
      setBidding(false);
    }
  };

  const calculateDemoEndTime = (endTimeString: string | undefined) => {
    if (!endTimeString) return new Date(Date.now() + 86400000).toISOString();
    if (endTimeString.includes("-") && endTimeString.includes(":"))
      return endTimeString;
    const now = Date.now();
    if (endTimeString.includes("d")) {
      const days = parseInt(endTimeString) || 1;
      return new Date(now + days * 86400000).toISOString();
    }
    return new Date(now + 86400000).toISOString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auction...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Auction Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "This auction does not exist"}
          </p>
          <Link
            href="/auctions"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Auctions
          </Link>
        </div>
      </div>
    );
  }

  const endTime = new Date(auction.endTime).getTime();
  const now = Date.now();
  const secondsRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

  const productDetails = [
    { label: "Size", value: auction.size || "N/A" },
    { label: "Condition", value: auction.condition || "N/A" },
    { label: "Season", value: auction.season || "N/A" },
    { label: "Brand", value: auction.manufacturer || "N/A" },
    { label: "Type", value: auction.itemType || "shirt" },
    { label: "Team", value: auction.team || "N/A" },
    { label: "Player", value: auction.playerName || "No Name/Number" },
    { label: "Number", value: auction.playerNumber || "N/A" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-black transition-colors">
            Auctions
          </Link>
          <span>/</span>
          <Link href="#" className="hover:text-black transition-colors">
            {auction.category || auction.itemType || "Category"}
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">{auction.title}</span>
        </div>

        {/* TOP SECTION - Image + Bidding (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* LEFT - Image, Title, Seller */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
              <ImageGallery
                images={auction.images || []}
                title={auction.title}
                verified={auction.verified}
                rare={auction.rare}
              />
            </div>

            {/* Title & Badges */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                {auction.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full ${
                    auction.listingType === "auction"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {auction.listingType === "auction"
                    ? "🔨 Auction"
                    : "🛒 Buy Now"}
                </span>
                {auction.verified && (
                  <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full bg-emerald-100 text-emerald-800">
                    ✓ Verified
                  </span>
                )}
                {auction.rare && (
                  <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full bg-purple-100 text-purple-800">
                    ⭐ Rare
                  </span>
                )}
              </div>
            </div>

            {/* Seller Info */}
            {auction.seller && (
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
                <SellerInfo seller={auction.seller} />
              </div>
            )}
          </div>

          {/* RIGHT - Timer, Bid Panel, Bid History */}
          <div className="space-y-6">
            {/* Countdown Timer */}
            {auction.status === "active" &&
              auction.listingType === "auction" && (
                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
                  <CountdownTimer initialSeconds={secondsRemaining} />
                </div>
              )}

            {/* Bid/Buy Panel */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
              {auction.listingType === "auction" ? (
                <BidPanel
                  currentBid={Number(auction.currentBid)}
                  bidCount={auction.bidCount}
                  onPlaceBid={handlePlaceBid}
                  disabled={bidding || auction.status !== "active"}
                />
              ) : (
                <BuyNowPanel
                  price={Number(auction.buyNowPrice || auction.currentBid)}
                  currency="EUR"
                  auctionId={auction.id}
                  title={auction.title}
                  image={auction.images?.[0] || ""}
                  seller={auction.seller}
                  onAddToWatchlist={() => {
                    console.log("Added to watchlist:", auction.title);
                  }}
                />
              )}
            </div>

            {/* Bid History - Only for auctions */}
            {auction.listingType === "auction" && (
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
                <BidHistory bids={bids} />
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION - Full Width */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {auction.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Product Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {productDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600 font-medium">
                    {detail.label}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
            <InfoCards />
          </div>
        </div>
      </div>
    </div>
  );
}
