"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import ImageGallery from "@/components/auction/ImageGallery";
import BidPanel from "@/components/auction/BidPanel";
import BuyNowPanel from "@/components/auction/BuyNowPanel";
import SellerInfo from "@/components/auction/SellerInfo";
import BidHistory from "@/components/auction/BidHistory";
import InfoCards from "@/components/auction/InfoCards";
import Link from "next/link";

import { getSportsListingById, placeBid } from "@/lib/api/listings.api";
import { mockAuctions, mockBidHistory } from "@/lib/mockData";

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [bidsOpen, setBidsOpen] = useState(false);

  useEffect(() => {
    if (id) loadAuctionData(id);
  }, [id]);

  const loadAuctionData = async (auctionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getSportsListingById(auctionId);

      if (result.success && result.data) {
        const d = result.data;
        setAuction({
          id: d.id,
          title: d.title,
          description: d.description || "No description provided",
          currentBid: Number(d.currentBid || d.startingBid || 0),
          bidCount: d.bidCount || 0,
          listingType:
            d.listingType?.toLowerCase() === "buy_now" ? "buy_now" : "auction",
          images: d.images || [],
          status: d.status?.toLowerCase() || "active",
          endTime: d.endTime,
          startTime: d.startTime,
          verified: d.verified || false,
          rare: d.rare || false,
          featured: d.featured || false,
          buyNowPrice: d.buyNowPrice ? Number(d.buyNowPrice) : null,
          startingBid: Number(d.startingBid || 0),
          bidIncrement: Number(d.bidIncrement || 5),
          category: d.category || "Other",
          itemType: d.itemType || "shirt",
          team: d.team || "N/A",
          season: d.season || "N/A",
          size: d.size || d.sizeFromForm || "N/A",
          sizeEU: d.sizeEU || null,
          sizeUK: d.sizeUK || null,
          condition: d.condition || "N/A",
          manufacturer: d.manufacturer || "N/A",
          model: d.model || null,
          productionYear: d.productionYear || null,
          countryOfProduction: d.countryOfProduction || null,
          serialCode: d.serialCode || null,
          tagCondition: d.tagCondition || null,
          hasAutograph: d.hasAutograph || false,
          autographDetails: d.autographDetails || null,
          isVintage: d.isVintage || false,
          vintageYear: d.vintageYear || null,
          playerName: d.playerName || null,
          playerNumber: d.playerNumber || null,
          shippingCost: Number(d.shippingCost || 0),
          shippingTime: d.shippingTime || "3-5 business days",
          shippingFrom: d.shippingFrom || "N/A",
          seller: d.seller
            ? {
                name: d.seller.username || d.seller.name || "Unknown",
                avatar: d.seller.avatar || undefined,
                rating: d.seller.rating || 5.0,
                reviews: d.seller.reviews || 0,
              }
            : { name: "Seller", rating: 5.0, reviews: 0 },
        });

        if (d.bids && Array.isArray(d.bids)) {
          setBids(
            d.bids.map((bid: any, index: number) => ({
              id: bid.id || index.toString(),
              username: bid.bidder?.username || "Anonymous",
              amount: Number(bid.amount),
              time: formatTimeAgo(bid.createdAt),
              isWinning: index === 0,
            })),
          );
        }

        setLoading(false);
        return;
      }

      const foundMock = mockAuctions.find((a) => a.id === auctionId);
      if (foundMock) {
        setAuction({
          ...foundMock,
          currentBid: foundMock.price,
          bidCount: foundMock.bids,
          listingType: foundMock.type,
          images:
            foundMock.images || (foundMock.image ? [foundMock.image] : []),
          status: "active",
          endTime: calculateDemoEndTime(foundMock.endTime),
        });
        setBids(mockBidHistory);
        setLoading(false);
        return;
      }

      setError("Auction not found");
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to load auction");
      setLoading(false);
    }
  };

  const handlePlaceBid = async (amount: number) => {
    try {
      setBidding(true);
      setError(null);
      const isRealAuction = id.includes("-");

      if (isRealAuction) {
        const result = await placeBid(id, amount);
        if (!result.success) {
          alert(`❌ ${result.error || "Failed to place bid"}`);
          return;
        }
        alert(`🎉 Bid (${amount} €) placed successfully!`);
        await loadAuctionData(id);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        alert(`🎉 DEMO: Your bid (${amount} €) was accepted!`);
        const newBid = {
          id: Date.now().toString(),
          username: "You (Demo)",
          amount,
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
      }
    } catch (err: any) {
      alert(err.message || "Failed to place bid");
    } finally {
      setBidding(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Unknown";
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const calculateDemoEndTime = (endTimeString: string | undefined) => {
    if (!endTimeString) return new Date(Date.now() + 86400000).toISOString();
    if (endTimeString.includes("-") && endTimeString.includes(":"))
      return endTimeString;
    const days = parseInt(endTimeString) || 1;
    return new Date(Date.now() + days * 86400000).toISOString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Not Found</h2>
          <p className="text-gray-500 mb-6">
            {error || "This auction does not exist"}
          </p>
          <Link
            href="/auctions"
            className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            Back to Auctions
          </Link>
        </div>
      </div>
    );
  }

  const endTime = new Date(auction.endTime).getTime();
  const secondsRemaining = Math.max(
    0,
    Math.floor((endTime - Date.now()) / 1000),
  );

  const CATEGORY_LABELS: Record<string, string> = {
    shirts: "Shirts & Jerseys",
    footwear: "Sports Footwear",
    pants: "Pants & Shorts",
    jackets: "Jackets & Hoodies",
    accessories: "Accessories",
    equipment: "Sports Equipment",
  };

  const categoryDisplay = (() => {
    const catLabel =
      CATEGORY_LABELS[auction.category?.toLowerCase()] || auction.category;
    return catLabel || auction.itemType || null;
  })();

  const getConditionLabel = (raw: string | null | undefined): string => {
    if (!raw) return "Unknown";
    const lower = raw.toLowerCase();
    if (lower.includes("brand new with tags") || lower.startsWith("bnwt"))
      return "BNWT";
    if (lower.includes("brand new without tags") || lower.startsWith("bnwot"))
      return "BNWOT";
    if (lower.includes("excellent") || lower.includes("like new"))
      return "Excellent";
    if (lower.includes("good")) return "Good";
    if (lower.includes("fair") || lower.includes("visible wear")) return "Fair";
    if (lower.includes("poor") || lower.includes("heavy wear")) return "Poor";
    return raw.charAt(0).toUpperCase() + raw.slice(1).split(/[\s\-.,]/)[0];
  };

  const conditionLabel = getConditionLabel(auction.condition);

  type DetailEntry = {
    label: string;
    value: string | null;
    icon: string;
    verified?: boolean;
  };

  const val = (v: string | null | undefined): string | null =>
    v && v !== "N/A" ? v : null;

  const normalizeShirtSize = (
    raw: string | null | undefined,
  ): string | null => {
    if (!raw || raw === "N/A") return null;
    const SHIRT_SIZE_MAP: Record<string, string> = {
      xxxs: "XXXS",
      xxs: "XXS",
      xs: "XS",
      s: "S",
      m: "M",
      l: "L",
      xl: "XL",
      xxl: "XXL",
      xxxl: "XXXL",
      xxxxl: "XXXXL",
      ys: "YS",
      ym: "YM",
      yl: "YL",
      yxl: "YXL",
      "3-4y": "3-4 years",
      "5-6y": "5-6 years",
      "7-8y": "7-8 years",
      "9-10y": "9-10 years",
      "11-12y": "11-12 years",
      "13-14y": "13-14 years",
    };
    const lower = raw.toLowerCase().trim();
    if (SHIRT_SIZE_MAP[lower]) return SHIRT_SIZE_MAP[lower];
    if (raw.length <= 10 && !raw.includes(" ")) return raw.toUpperCase();
    return null;
  };

  const buildProductDetails = (): DetailEntry[] => {
    const itemType = auction.itemType?.toLowerCase() || "";
    const catSlug = auction.category?.toLowerCase() || "";
    const typeMap: Record<string, string> = {
      shirt: "shirts",
      shirts: "shirts",
      jersey: "shirts",
      shoes: "footwear",
      footwear: "footwear",
      sneakers: "footwear",
      boots: "footwear",
      pants: "pants",
      shorts: "pants",
      jacket: "jackets",
      jackets: "jackets",
      hoodie: "jackets",
      accessory: "accessories",
      accessories: "accessories",
      equipment: "equipment",
    };
    const category = typeMap[itemType] || typeMap[catSlug] || "shirts";

    const common: DetailEntry[] = [
      { label: "Category", value: categoryDisplay || "—", icon: "📂" },
      { label: "Brand", value: val(auction.manufacturer) || "—", icon: "🏷️" },
      { label: "Condition", value: conditionLabel, icon: "✨" },
    ];

    const always = (
      label: string,
      value: string | null | undefined,
      icon: string,
      verified = false,
    ): DetailEntry => ({ label, value: value || "—", icon, verified });

    const optional = (
      label: string,
      value: string | null | undefined,
      icon: string,
    ): DetailEntry | null => {
      const v = val(value);
      return v ? { label, value: v, icon } : null;
    };

    const specific: Record<string, (DetailEntry | null)[]> = {
      shirts: [
        always("Model", val(auction.model), "📋"),
        always("Club / Team", val(auction.team), "🏟️"),
        always("Season", val(auction.season), "📅"),
        always("Size", normalizeShirtSize(auction.size), "📐"),
        always(
          "Country of Production",
          auction.countryOfProduction,
          "🌍",
          true,
        ),
        always("Serial Code", auction.serialCode, "🔢", true),
        optional("Player", auction.playerName, "⚽"),
        optional("Number", auction.playerNumber, "#️⃣"),
        optional("Tag Condition", auction.tagCondition, "🏷️"),
        auction.hasAutograph
          ? {
              label: "Autograph",
              value: auction.autographDetails || "Yes",
              icon: "✍️",
            }
          : null,
        auction.isVintage
          ? {
              label: "Vintage",
              value: auction.vintageYear || "Yes",
              icon: "🕰️",
            }
          : null,
      ],
      footwear: [
        always("Model", val(auction.model), "📋"),
        always("Production Year", val(auction.productionYear), "📅"),
        always(
          "Size",
          (() => {
            const parts = [
              auction.size && auction.size !== "N/A"
                ? `US ${auction.size}`
                : null,
              auction.sizeEU ? `EU ${auction.sizeEU}` : null,
              auction.sizeUK ? `UK ${auction.sizeUK}` : null,
            ].filter(Boolean);
            return parts.length > 0 ? parts.join(" / ") : null;
          })(),
          "📐",
        ),
        always(
          "Country of Production",
          auction.countryOfProduction,
          "🌍",
          true,
        ),
        always("Style Code", auction.serialCode, "🔢", true),
      ],
      pants: [
        always("Model", val(auction.model), "📋"),
        always("Club / Team", val(auction.team), "🏟️"),
        always("Season", val(auction.season), "📅"),
        always("Size", val(auction.size), "📐"),
        always(
          "Country of Production",
          auction.countryOfProduction,
          "🌍",
          true,
        ),
        always("Serial Code", auction.serialCode, "🔢", true),
      ],
      jackets: [
        always("Model", val(auction.model), "📋"),
        always("Club / Team", val(auction.team), "🏟️"),
        always("Season", val(auction.season), "📅"),
        always("Size", val(auction.size), "📐"),
        always(
          "Country of Production",
          auction.countryOfProduction,
          "🌍",
          true,
        ),
        always("Serial Code", auction.serialCode, "🔢", true),
      ],
      accessories: [
        always("Model", val(auction.model), "📋"),
        optional("Club / Team", auction.team, "🏟️"),
        always("Serial Code", auction.serialCode, "🔢", true),
      ],
      equipment: [
        always("Model", val(auction.model), "📋"),
        always("Size", val(auction.size), "📐"),
        always("Serial Code", auction.serialCode, "🔢", true),
      ],
    };

    const defaultFields: (DetailEntry | null)[] = [
      always("Model", val(auction.model), "📋"),
      always("Club / Team", val(auction.team), "🏟️"),
      always("Season", val(auction.season), "📅"),
      always("Size", val(auction.size), "📐"),
      always("Country of Production", auction.countryOfProduction, "🌍", true),
      always("Serial Code", auction.serialCode, "🔢", true),
    ];

    const categoryFields = specific[category] ?? defaultFields;
    return [...common, ...categoryFields].filter(
      (d): d is DetailEntry => d !== null,
    );
  };

  const productDetails = buildProductDetails();

  const CollapsibleHeader = ({
    title,
    open,
    onToggle,
  }: {
    title: string;
    open: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-6 py-4 hover:bg-gray-50 transition-colors"
    >
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
        {title}
      </span>
      {open ? (
        <ChevronUp size={15} className="text-gray-400 shrink-0" />
      ) : (
        <ChevronDown size={15} className="text-gray-400 shrink-0" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="h-1 bg-gradient-to-r from-black via-gray-600 to-black" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">
            Auctions
          </Link>
          <span>/</span>
          <Link href="#" className="hover:text-black transition-colors">
            {auction.category || auction.itemType}
          </Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-xs">
            {auction.title}
          </span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Image Gallery */}
            <div className="bg-white rounded-[2px] overflow-hidden border border-gray-200">
              <ImageGallery
                images={auction.images || []}
                title={auction.title}
                verified={auction.verified}
                rare={auction.rare}
              />
            </div>

            {/* Title + Badges */}
            <div className="bg-white rounded-[2px] p-6 border border-gray-200">
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-[2px] ${
                    auction.listingType === "auction"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {auction.listingType === "auction" ? "Auction" : "Buy Now"}
                </span>
                {auction.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-[2px] bg-black text-white">
                    ✓ Verified
                  </span>
                )}
                {auction.rare && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-[2px] bg-amber-50 text-amber-700">
                    Rare
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-light text-gray-900 leading-snug tracking-tight">
                {auction.title}
              </h1>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[2px] p-6 border border-gray-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Description
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                {auction.description}
              </p>
            </div>

            {/* Product Details — domyślnie otwarte */}
            <div className="bg-white rounded-[2px] border border-gray-200 overflow-hidden">
              <CollapsibleHeader
                title="Product Details"
                open={detailsOpen}
                onToggle={() => setDetailsOpen((o) => !o)}
              />
              {detailsOpen && (
                <div className="border-t border-gray-100">
                  {productDetails.map((d, i) => (
                    <div
                      key={i}
                      className={`flex items-start justify-between px-6 py-3 border-b border-gray-50 last:border-0 min-w-0 ${
                        d.verified ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest shrink-0 pt-0.5 ${
                          d.verified ? "text-emerald-600" : "text-gray-400"
                        }`}
                      >
                        {d.label}
                        {d.verified && (
                          <span className="ml-1.5 text-[8px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full tracking-wider">
                            AI
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-sm font-medium text-right break-words min-w-0 ml-4 ${
                          d.verified ? "text-emerald-700" : "text-gray-900"
                        }`}
                      >
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bids — tylko dla aukcji, domyślnie zamknięte */}
            {auction.listingType === "auction" && (
              <div className="bg-white rounded-[2px] border border-gray-200 overflow-hidden">
                <CollapsibleHeader
                  title={`Bid History (${bids.length})`}
                  open={bidsOpen}
                  onToggle={() => setBidsOpen((o) => !o)}
                />
                {bidsOpen && (
                  <div className="border-t border-gray-100 p-5">
                    <BidHistory bids={bids} />
                  </div>
                )}
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-white rounded-[2px] p-6 border border-gray-200">
              <InfoCards />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 lg:sticky lg:top-8">
            <div className="overflow-hidden">
              {auction.listingType === "auction" ? (
                <BidPanel
                  currentBid={Number(auction.currentBid)}
                  bidCount={auction.bidCount}
                  highestBidder={bids.length > 0 ? bids[0].username : undefined}
                  initialSeconds={
                    auction.status === "active" ? secondsRemaining : 0
                  }
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
                  onAddToWatchlist={() =>
                    console.log("Added to watchlist:", auction.title)
                  }
                />
              )}
            </div>

            {/* Seller Card */}
            {auction.seller && (
              <div className="bg-white rounded-[2px] border border-gray-200 overflow-hidden">
                <div className="px-6 pt-5 pb-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Sold by
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <SellerInfo seller={auction.seller} auctionId={auction.id} />
                </div>
              </div>
            )}

            {/* Shipping summary */}
            <div className="bg-white rounded-[2px] p-5 border border-gray-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                Shipping
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 uppercase text-[10px] tracking-widest font-medium">
                    Cost
                  </span>
                  <span
                    className={`font-bold text-sm ${auction.shippingCost === 0 ? "text-green-600" : "text-gray-900"}`}
                  >
                    {auction.shippingCost > 0
                      ? `€${auction.shippingCost}`
                      : "Free"}
                  </span>
                </div>
                {auction.shippingFrom && auction.shippingFrom !== "N/A" && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 uppercase text-[10px] tracking-widest font-medium">
                      From
                    </span>
                    <span className="font-medium text-sm text-gray-900">
                      {auction.shippingFrom}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 uppercase text-[10px] tracking-widest font-medium">
                    Delivery
                  </span>
                  <span className="font-medium text-sm text-gray-900">
                    {auction.shippingTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
