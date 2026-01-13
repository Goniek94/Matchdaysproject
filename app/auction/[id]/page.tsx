"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/auction/ImageGallery";
import CountdownTimer from "@/components/auction/CountdownTimer";
import BidPanel from "@/components/auction/BidPanel";
import BuyNowPanel from "@/components/auction/BuyNowPanel";
import SellerInfo from "@/components/auction/SellerInfo";
import BidHistory from "@/components/auction/BidHistory";
import ProductDetails from "@/components/auction/ProductDetails";
import InfoCards from "@/components/auction/InfoCards";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getAuctionById } from "@/lib/api/auctions";
import { placeBid, getAuctionBids } from "@/lib/api/bids";
import { isAuthenticated } from "@/lib/api/config";

interface AuctionDetailPageProps {
  params: {
    id: string;
  };
}

export default function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  const router = useRouter();
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load auction data
  useEffect(() => {
    loadAuctionData();
  }, [params.id]);

  const loadAuctionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load auction details
      const auctionResponse = await getAuctionById(params.id);

      if (!auctionResponse.success) {
        setError(auctionResponse.message || "Failed to load auction");
        return;
      }

      setAuction(auctionResponse.data);

      // Load bids
      await loadBids();
    } catch (err: any) {
      console.error("Error loading auction:", err);
      setError(err.message || "Failed to load auction");
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    try {
      const bidsResponse = await getAuctionBids(params.id);

      if (bidsResponse.success && bidsResponse.data) {
        // Transform API bids to component format
        const transformedBids = bidsResponse.data.map(
          (bid: any, index: number) => ({
            id: bid.id,
            username: bid.bidder?.username || bid.user?.username || "Anonymous",
            amount: Number(bid.amount),
            time: new Date(bid.createdAt).toLocaleString("pl-PL"),
            isWinning: index === 0, // First bid is the highest/winning
          })
        );
        setBids(transformedBids);
      }
    } catch (err) {
      console.error("Error loading bids:", err);
    }
  };

  const handlePlaceBid = async (amount: number) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      alert("Please log in to place a bid");
      return;
    }

    try {
      setBidding(true);
      setError(null);

      const response = await placeBid(params.id, amount);

      if (response.success) {
        alert("Bid placed successfully! 🎉");

        // Reload auction and bids
        await loadAuctionData();
      } else {
        alert(response.message || "Failed to place bid");
      }
    } catch (err: any) {
      console.error("Error placing bid:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to place bid";
      alert(errorMessage);
    } finally {
      setBidding(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-24 px-8">
          <div className="container-max">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading auction...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Error state
  if (error || !auction) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-24 px-8">
          <div className="container-max">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-4">Auction Not Found</h2>
                <p className="text-gray-600 mb-6">
                  {error || "This auction does not exist"}
                </p>
                <Link
                  href="/auctions"
                  className="inline-block px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Back to Auctions
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Calculate time remaining
  const endTime = new Date(auction.endTime).getTime();
  const now = Date.now();
  const secondsRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

  // Product details
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
    <main className="bg-white">
      <Navbar />

      <div className="pt-24 px-8">
        <div className="container-max">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-black transition-colors">
              Auctions
            </Link>
            <span>/</span>
            <Link href="#" className="hover:text-black transition-colors">
              {auction.category}
            </Link>
            <span>/</span>
            <span className="text-black">{auction.title}</span>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Image Gallery */}
            <div>
              <ImageGallery
                images={auction.images || []}
                title={auction.title}
                verified={auction.verified}
                rare={auction.rare}
              />
            </div>

            {/* Right: Auction Details */}
            <div>
              {/* Title & Subtitle */}
              <h1 className="text-4xl font-light mb-2 tracking-tight">
                {auction.title}
              </h1>
              <p className="text-gray-600 mb-8">{auction.description}</p>

              {/* Listing Type Badge */}
              <div className="mb-6">
                <span
                  className={`inline-block px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-[2px] ${
                    auction.listingType === "auction"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {auction.listingType === "auction"
                    ? "🔨 Auction"
                    : "🛒 Buy Now"}
                </span>
                {auction.status !== "active" && (
                  <span className="ml-2 inline-block px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-[2px] bg-gray-100 text-gray-800">
                    {auction.status}
                  </span>
                )}
              </div>

              {/* Countdown Timer - Only for active auctions */}
              {auction.status === "active" &&
                auction.listingType === "auction" && (
                  <CountdownTimer initialSeconds={secondsRemaining} />
                )}

              {/* Conditional Panel - Auction or Buy Now */}
              {auction.listingType === "auction" ? (
                <>
                  {/* Bid Panel for Auctions */}
                  <BidPanel
                    currentBid={Number(auction.currentBid)}
                    bidCount={auction.bidCount}
                    onPlaceBid={handlePlaceBid}
                    disabled={bidding || auction.status !== "active"}
                  />

                  {/* Bid History - Only for auctions */}
                  <BidHistory bids={bids} />
                </>
              ) : (
                /* Buy Now Panel for Fixed Price Listings */
                <BuyNowPanel
                  price={Number(auction.buyNowPrice || auction.currentBid)}
                  currency="PLN"
                  auctionId={auction.id}
                  title={auction.title}
                  image={auction.images?.[0] || ""}
                  seller={auction.seller}
                  onAddToWatchlist={() => {
                    console.log("Added to watchlist:", auction.title);
                  }}
                />
              )}

              {/* Seller Info */}
              {auction.seller && <SellerInfo seller={auction.seller} />}

              {/* Product Details */}
              <ProductDetails
                description={auction.description}
                details={productDetails}
              />

              {/* Info Cards */}
              <InfoCards />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
