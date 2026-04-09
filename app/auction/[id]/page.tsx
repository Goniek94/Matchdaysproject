"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ChevronUp, ChevronDown, Gavel, Trophy, X } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import ImageGallery from "@/components/auction/ImageGallery";
import BidPanel from "@/components/auction/BidPanel";
import BuyNowPanel from "@/components/auction/BuyNowPanel";
import SellerInfo from "@/components/auction/SellerInfo";
import BidHistory from "@/components/auction/BidHistory";
import InfoCards from "@/components/auction/InfoCards";

import { getAuctionById } from "@/lib/api/auctions.api";
import { placeBid } from "@/lib/api/bids.api";
import type { AuctionDetailDto } from "@/types/api/auction.types";
import { mockAuctions, mockBidHistory } from "@/lib/mockData";
import { useAuctionRealtime } from "@/lib/hooks/useAuctionRealtime";
import BidModal from "@/components/auction/BidModal";

// ─── Auction display shape (mapped from DTO for UI convenience) ───────────────

interface AuctionDisplay {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  bidCount: number;
  listingType: "auction" | "buy_now";
  images: string[];
  status: string;
  endTime: string;
  startTime: string;
  verified: boolean;
  rare: boolean;
  featured: boolean;
  buyNowPrice: number | null;
  startingBid: number;
  bidIncrement: number;
  category: string;
  itemType: string;
  team: string;
  season: string;
  size: string;
  sizeEU: string | null;
  sizeUK: string | null;
  condition: string;
  manufacturer: string | null;
  model: string | null;
  productionYear: string | null;
  countryOfProduction: string | null;
  serialCode: string | null;
  tagCondition: string | null;
  hasAutograph: boolean;
  autographDetails: string | null;
  isVintage: boolean;
  vintageYear: string | null;
  playerName: string | null;
  playerNumber: string | null;
  shippingCost: number;
  shippingTime: string;
  shippingFrom: string;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    reviews: number;
  };
}

interface BidDisplay {
  id: string;
  username: string;
  amount: number;
  time: string;
  isWinning: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTimeAgo = (dateString: string): string => {
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

const calculateDemoEndTime = (endTimeString: string | undefined): string => {
  if (!endTimeString) return new Date(Date.now() + 86400000).toISOString();
  if (endTimeString.includes("-") && endTimeString.includes(":"))
    return endTimeString;
  const days = parseInt(endTimeString) || 1;
  return new Date(Date.now() + days * 86400000).toISOString();
};

/** Map backend AuctionDetailDto to the local display shape */
const mapDtoToDisplay = (d: AuctionDetailDto): AuctionDisplay => ({
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
  size: d.size || "N/A",
  sizeEU: d.sizeEU ?? null,
  sizeUK: d.sizeUK ?? null,
  condition: d.condition || "N/A",
  manufacturer: d.manufacturer || null,
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
        name: d.seller.username || "Unknown",
        avatar: d.seller.avatar,
        rating: d.seller.rating || 5.0,
        reviews: d.seller.reviews || 0,
      }
    : { name: "Seller", rating: 5.0, reviews: 0 },
});

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();

  const [auction, setAuction] = useState<AuctionDisplay | null>(null);
  const [bids, setBids] = useState<BidDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bidFeedback, setBidFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [bidsOpen, setBidsOpen] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [winBanner, setWinBanner] = useState(false);
  const winNotifiedRef = useRef(false);

  // Real auctions have UUID format (contain dashes), mock ones are numeric strings
  const isRealAuction = id?.includes("-") ?? false;

  const realtime = useAuctionRealtime(
    auction?.id ?? null,
    auction?.endTime,
    isRealAuction,
  );

  // Detect win: auction ended + current user is the highest bidder
  useEffect(() => {
    if (
      !winNotifiedRef.current &&
      isRealAuction &&
      realtime.isEnded &&
      realtime.winner &&
      user?.username &&
      realtime.winner === user.username
    ) {
      winNotifiedRef.current = true;
      setWinBanner(true);
    }
  }, [realtime.isEnded, realtime.winner, user?.username, isRealAuction]);

  useEffect(() => {
    if (id) loadAuctionData(id);
  }, [id]);

  const loadAuctionData = async (auctionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAuctionById(auctionId);

      if (result.success && result.data) {
        setAuction(mapDtoToDisplay(result.data));

        if (result.data.bids && Array.isArray(result.data.bids)) {
          setBids(
            result.data.bids.map((bid, index) => ({
              id: bid.id,
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

      // Fallback to mock data for demo auctions
      const foundMock = mockAuctions.find((a) => a.id === auctionId);
      if (foundMock) {
        setAuction({
          id: foundMock.id,
          title: foundMock.title || "",
          description: "",
          currentBid: foundMock.price,
          bidCount: foundMock.bids,
          listingType: foundMock.type as "auction" | "buy_now",
          images:
            foundMock.images || (foundMock.image ? [foundMock.image] : []),
          status: "active",
          endTime: calculateDemoEndTime(foundMock.endTime),
          startTime: new Date().toISOString(),
          verified: false,
          rare: false,
          featured: false,
          buyNowPrice: null,
          startingBid: foundMock.price,
          bidIncrement: 5,
          category: foundMock.category || "Other",
          itemType: "shirt",
          team: "N/A",
          season: "N/A",
          size: "N/A",
          sizeEU: null,
          sizeUK: null,
          condition: "N/A",
          manufacturer: null,
          model: null,
          productionYear: null,
          countryOfProduction: null,
          serialCode: null,
          tagCondition: null,
          hasAutograph: false,
          autographDetails: null,
          isVintage: false,
          vintageYear: null,
          playerName: null,
          playerNumber: null,
          shippingCost: 0,
          shippingTime: "3-5 business days",
          shippingFrom: "N/A",
          seller: { name: "Demo Seller", rating: 5.0, reviews: 0 },
        });
        setBids(mockBidHistory);
        setLoading(false);
        return;
      }

      setError("Auction not found");
      setLoading(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load auction";
      setError(message);
      setLoading(false);
    }
  };

  const showBidFeedback = (type: "success" | "error", message: string) => {
    setBidFeedback({ type, message });
    setTimeout(() => setBidFeedback(null), 4000);
  };

  const handlePlaceBid = async (amount: number) => {
    try {
      setBidding(true);
      setError(null);

      if (isRealAuction) {
        const result = await placeBid(id, amount);

        if (!result.success) {
          showBidFeedback("error", result.message || "Failed to place bid");
          return;
        }

        showBidFeedback("success", `Bid of €${amount} placed successfully!`);
        realtime.refresh();
      } else {
        // Demo mode
        await new Promise((r) => setTimeout(r, 800));
        showBidFeedback(
          "success",
          `DEMO: Your bid of €${amount} was accepted!`,
        );
        const newBid: BidDisplay = {
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
        setAuction((prev) =>
          prev
            ? {
                ...prev,
                currentBid: amount,
                bidCount: (prev.bidCount || 0) + 1,
              }
            : prev,
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to place bid";
      showBidFeedback("error", message);
    } finally {
      setBidding(false);
    }
  };

  // ─── Loading / Error states ─────────────────────────────────────────────────

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

  // ─── Derived display values ─────────────────────────────────────────────────

  const currentBid = isRealAuction
    ? realtime.currentBid
    : Number(auction.currentBid);
  const bidCount = isRealAuction ? realtime.bidCount : auction.bidCount;
  const displayBids = isRealAuction ? realtime.bids : bids;
  const highestBidder = isRealAuction
    ? realtime.highestBidder
    : bids.length > 0
      ? bids[0].username
      : undefined;
  const secondsRemaining = isRealAuction
    ? realtime.secondsRemaining
    : Math.max(
        0,
        Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000),
      );
  const auctionEnded = isRealAuction
    ? realtime.isEnded
    : auction.status !== "active";

  // ─── Product detail helpers ─────────────────────────────────────────────────

  const CATEGORY_LABELS: Record<string, string> = {
    shirts: "Shirts & Jerseys",
    shirts_jerseys: "Shirts & Jerseys",
    footwear: "Sports Footwear",
    sports_footwear: "Sports Footwear",
    pants: "Pants & Shorts",
    pants_shorts: "Pants & Shorts",
    jackets: "Jackets & Hoodies",
    jackets_hoodies: "Jackets & Hoodies",
    accessories: "Accessories",
    equipment: "Sports Equipment",
    sports_equipment: "Sports Equipment",
  };

  const SPORT_LABELS: Record<string, string> = {
    football: "Football",
    basketball: "Basketball",
    hockey: "Ice Hockey",
    tennis: "Tennis",
    f1: "Formula 1",
    rugby: "Rugby",
    baseball: "Baseball",
    cricket: "Cricket",
    esports: "Esports",
    other: "Other",
  };

  // category field in DB now stores the sport (e.g. "football")
  const sportDisplay = SPORT_LABELS[auction.category?.toLowerCase()] || null;

  const categoryDisplay = (() => {
    const itemSlug = auction.itemType?.toLowerCase() || "";
    return CATEGORY_LABELS[itemSlug] || auction.itemType || null;
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
    const typeMap: Record<string, string> = {
      shirt: "shirts",
      shirts: "shirts",
      shirts_jerseys: "shirts",
      jersey: "shirts",
      shoes: "footwear",
      footwear: "footwear",
      sports_footwear: "footwear",
      sneakers: "footwear",
      boots: "footwear",
      pants: "pants",
      pants_shorts: "pants",
      shorts: "pants",
      jacket: "jackets",
      jackets: "jackets",
      jackets_hoodies: "jackets",
      hoodie: "jackets",
      accessory: "accessories",
      accessories: "accessories",
      equipment: "equipment",
      sports_equipment: "equipment",
    };
    const category = typeMap[itemType] || "shirts";

    const common: DetailEntry[] = [
      ...(sportDisplay ? [{ label: "Sport", value: sportDisplay, icon: "⚽" }] : []),
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

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      {/* ── Win notification banner ── */}
      {winBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-4">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black rounded-2xl shadow-2xl p-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <Trophy size={26} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="font-black text-lg leading-tight">
                Congratulations! You won this auction!
              </p>
              <p className="text-sm mt-1 font-medium text-black/70">
                Winning bid: €{realtime.currentBid.toLocaleString()}
              </p>
              <Link
                href="/history"
                className="inline-block mt-2 text-sm font-bold underline"
              >
                Go to Transaction History →
              </Link>
            </div>
            <button
              onClick={() => setWinBanner(false)}
              className="flex-shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Bid Modal — opens on "Place Bid" button click */}
      {bidModalOpen && auction.listingType === "auction" && (
        <BidModal
          auctionId={auction.id}
          auctionTitle={auction.title}
          auctionImage={auction.images?.[0]}
          auctionEndTime={auction.endTime}
          currentBid={currentBid}
          bidCount={bidCount}
          highestBidder={highestBidder}
          initialSeconds={secondsRemaining}
          onPlaceBid={handlePlaceBid}
          disabled={bidding || auctionEnded}
          onClose={() => setBidModalOpen(false)}
        />
      )}

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
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-light text-gray-900 leading-snug tracking-tight">
                  {auction.title}
                </h1>
                {/* Place Bid button — visible on desktop next to title */}
                {auction.listingType === "auction" && !auctionEnded && (
                  <button
                    onClick={() => setBidModalOpen(true)}
                    className="hidden lg:inline-flex items-center gap-2 shrink-0 px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all"
                  >
                    <Gavel size={13} />
                    Place Bid
                  </button>
                )}
              </div>
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

            {/* Product Details */}
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

            {/* Bids */}
            {auction.listingType === "auction" && (
              <div className="bg-white rounded-[2px] border border-gray-200 overflow-hidden">
                <CollapsibleHeader
                  title={`Bid History (${isRealAuction ? realtime.bidCount : bids.length})`}
                  open={bidsOpen}
                  onToggle={() => setBidsOpen((o) => !o)}
                />
                {bidsOpen && (
                  <div className="border-t border-gray-100 p-5">
                    <BidHistory bids={displayBids} />
                  </div>
                )}
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-white rounded-[2px] p-6 border border-gray-200">
              <InfoCards />
            </div>

            {/* Mobile floating "Place Bid" bar — hidden on desktop */}
            {auction.listingType === "auction" && !auctionEnded && (
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                      Current Bid
                    </p>
                    <p className="text-lg font-black text-gray-900 leading-tight">
                      €{currentBid.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setBidModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg"
                  >
                    <Gavel size={14} />
                    Place Bid
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4 lg:sticky lg:top-8">
            {/* Winner Banner */}
            {auctionEnded && (
              <div className="px-5 py-4 bg-black text-white rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Auction Ended
                </p>
                {realtime.winner ? (
                  <>
                    <p className="text-lg font-black">🏆 {realtime.winner}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      won this auction
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">No bids placed</p>
                )}
              </div>
            )}

            {/* Bid Feedback Toast */}
            {bidFeedback && (
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  bidFeedback.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <span>{bidFeedback.type === "success" ? "✓" : "✕"}</span>
                <span>{bidFeedback.message}</span>
              </div>
            )}

            <div className="overflow-hidden">
              {auction.listingType === "auction" ? (
                <BidPanel
                  auctionId={auction.id}
                  auctionTitle={auction.title}
                  auctionImage={auction.images?.[0] || ""}
                  auctionEndTime={auction.endTime}
                  currentBid={currentBid}
                  bidCount={bidCount}
                  highestBidder={highestBidder}
                  initialSeconds={secondsRemaining}
                  onPlaceBid={handlePlaceBid}
                  disabled={bidding || auctionEnded}
                />
              ) : (
                <BuyNowPanel
                  price={Number(auction.buyNowPrice || auction.currentBid)}
                  currency="EUR"
                  auctionId={auction.id}
                  title={auction.title}
                  image={auction.images?.[0] || ""}
                  endTime={auction.endTime}
                  seller={auction.seller}
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
