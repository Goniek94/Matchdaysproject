"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useWatchlist } from "@/lib/context/WatchlistContext";
import {
  Heart,
  LogIn,
  AlertCircle,
  Crown,
  Truck,
  BadgeCheck,
  Wallet as WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { useShippingEstimate } from "@/lib/hooks/useShippingEstimate";
import { formatShippingRange } from "@/lib/api/shipping";
import {
  getWallet,
  formatMoney,
  type WalletSummary,
} from "@/lib/api/wallet";
import {
  getShippingEstimate,
  getAuctionStatus,
  type ShippingEstimate,
  type AuctionStatusDto,
} from "@/lib/api/auctions.api";

interface BidPanelProps {
  auctionId?: string;
  auctionTitle?: string;
  auctionImage?: string;
  auctionEndTime?: string;
  currentBid: number;
  bidCount: number;
  highestBidder?: string;
  initialSeconds?: number;
  onPlaceBid?: (amount: number) => void;
  disabled?: boolean;
  isEnded?: boolean;
  /** Seller's country (auction.shippingFrom) — used to estimate shipping to buyer. */
  shippingFromCountry?: string | null;
  /** Item taxonomy category — affects weight assumption in shipping estimate. */
  itemCategory?: string | null;
  /**
   * True when the logged-in user is the seller of this listing. Swaps the
   * bid form for an owner-facing notice — backend rejects self-bids
   * (anti-shill-bidding policy) with a 403, but the UI should never let
   * the seller try in the first place. Mirrors BuyNowPanel.isOwnListing.
   */
  isOwnListing?: boolean;
}

/**
 * Combined auction panel with countdown timer, current bid info,
 * highest bidder display, bid placement controls and watchlist button.
 * Requires authentication to place a bid.
 * Currency: EUR (€)
 */
export default function BidPanel({
  auctionId,
  auctionTitle,
  auctionImage,
  auctionEndTime,
  currentBid,
  bidCount,
  highestBidder,
  initialSeconds = 0,
  onPlaceBid,
  disabled = false,
  isEnded = false,
  shippingFromCountry,
  itemCategory,
  isOwnListing = false,
}: BidPanelProps) {
  const { isAuthenticated, user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  // Shipping context so the bidder always sees "your final cost = bid + shipping".
  const buyerCountry = user?.country?.trim() || null;
  const { estimate: shipEstimate } = useShippingEstimate({
    fromCountry: shippingFromCountry || undefined,
    toCountry: buyerCountry || shippingFromCountry || undefined,
    itemCategory,
    enabled: !!shippingFromCountry,
  });

  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isUrgent, setIsUrgent] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [watchlistFeedback, setWatchlistFeedback] = useState<string | null>(
    null,
  );
  // Wallet escrow — buyer can only bid up to their spendable wallet balance.
  // Fetched once on mount and refreshed after each successful bid (the
  // parent re-fetches the auction; we re-fetch our own slice here).
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  // Authoritative shipping fee — what the buyer will pay AFTER winning
  // (item is paid via the bid escrow, shipping is collected separately).
  const [shipFee, setShipFee] = useState<ShippingEstimate | null>(null);
  // Caller's current hold on THIS auction (from the auction-status
  // endpoint). When a user re-raises their own top bid, the existing
  // hold is released atomically before the new one is created — so the
  // money in that hold is effectively available for the new bid. UI
  // ceiling becomes `wallet.balance + myHold.amount`.
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatusDto | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setWallet(null);
      return;
    }
    let cancelled = false;
    getWallet()
      .then((r) => {
        if (!cancelled) setWallet(r.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setWallet(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, currentBid]); // re-fetch after a successful bid

  useEffect(() => {
    if (!auctionId) return;
    let cancelled = false;
    getShippingEstimate(auctionId)
      .then((r) => {
        if (!cancelled) setShipFee(r.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setShipFee(null);
      });
    return () => {
      cancelled = true;
    };
  }, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;
    let cancelled = false;
    getAuctionStatus(auctionId)
      .then((r) => {
        if (!cancelled) setAuctionStatus(r.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setAuctionStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, [auctionId, currentBid, isAuthenticated]); // re-fetch after re-bid

  const minimumBid = currentBid + 5;
  const quickBids = [minimumBid, currentBid + 10, currentBid + 25];
  const walletBalance = wallet ? parseFloat(wallet.balance) : null;
  const myHoldOnThisAuction = auctionStatus?.myActiveHold?.amount ?? 0;
  // Effective ceiling for this auction = spendable wallet + my locked hold
  // on this listing (which is released when I re-bid higher on the same
  // auction). Anonymous users get null → button disabled w/ login prompt.
  const availableBalance =
    walletBalance !== null ? walletBalance + myHoldOnThisAuction : null;

  const inWatchlist = auctionId ? isInWatchlist(auctionId) : false;

  // Sync countdown with initialSeconds prop changes
  useEffect(() => {
    if (initialSeconds <= 0) return;
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  // Countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsUrgent(timeLeft <= 10 && timeLeft > 0);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = () => {
    if (timeLeft <= 0) return "Auction Ended";
    if (timeLeft <= 10) return `${timeLeft}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const formatEur = (amount: number) =>
    `€${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
    setBidError(null);
  };

  const handlePlaceBid = () => {
    setBidError(null);

    if (!isAuthenticated) {
      setBidError("You must be logged in to place a bid.");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setBidError("Please enter a valid bid amount.");
      return;
    }

    if (amount < minimumBid) {
      setBidError(`Minimum bid is ${formatEur(minimumBid)}.`);
      return;
    }

    // Wallet check — fail fast on the client so the user gets a friendly
    // "top up to bid" CTA instead of a 400 from the backend. The server
    // still validates; this is purely UX.
    if (availableBalance !== null && amount > availableBalance) {
      setBidError(
        `Not enough in your wallet. Available: ${formatMoney(wallet?.balance ?? "0")}. Top up to bid higher.`,
      );
      return;
    }

    onPlaceBid?.(amount);
    setBidAmount("");
  };

  const handleToggleWatchlist = () => {
    if (!auctionId) return;

    const added = toggleWatchlist({
      id: auctionId,
      title: auctionTitle || "Auction",
      currentBid,
      image: auctionImage,
      endTime: auctionEndTime,
      listingType: "auction",
    });

    setWatchlistFeedback(
      added ? "Added to watchlist!" : "Removed from watchlist",
    );
    setTimeout(() => setWatchlistFeedback(null), 2000);
  };

  // Use explicit isEnded prop from parent (authoritative), fall back to local timer only
  // when we have confirmed timer data (initialSeconds > 0)
  const auctionEnded = isEnded || (initialSeconds > 0 && timeLeft <= 0);

  // ─── Owner view ────────────────────────────────────────────────────────
  // Seller is looking at their own listing. The backend rejects self-bids
  // with a 403 (anti-shill-bidding from the security audit). Show a clean
  // notice instead of the bid form so they never even try.
  if (isOwnListing) {
    return (
      <div className="bg-black text-white p-6 rounded-3xl">
        {initialSeconds > 0 && (
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">
              {auctionEnded ? "Auction ended" : "Ends in"}
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {formatTime()}
            </div>
          </div>
        )}

        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">
            Current bid
          </div>
          <div className="text-4xl font-bold tracking-tight">
            €{currentBid.toLocaleString("en-GB")}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {bidCount} {bidCount === 1 ? "bid" : "bids"}
            {highestBidder && ` · leading: ${highestBidder}`}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <BadgeCheck
            size={18}
            className="text-emerald-300 mt-0.5 shrink-0"
          />
          <div className="text-sm">
            <p className="font-semibold text-white">This is your listing</p>
            <p className="text-white/60 text-xs mt-1">
              You can&apos;t bid on your own auction. Manage it from your
              dashboard.
            </p>
          </div>
        </div>

        <Link
          href="/my-listings"
          className="w-full py-4 bg-white text-black font-medium text-sm uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          Manage listing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white p-6 rounded-3xl">
      {/* Timer Section */}
      {initialSeconds > 0 && (
        <div className="mb-5">
          <div
            className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
              isUrgent ? "text-red-400" : "text-gray-400"
            }`}
          >
            {auctionEnded ? "Auction ended" : "Ends in"}
          </div>
          <div className="flex items-center gap-2">
            {!auctionEnded && (
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isUrgent
                    ? "bg-red-500 animate-pulse"
                    : "bg-green-400 animate-pulse"
                }`}
              />
            )}
            <span
              className={`text-2xl font-bold tracking-tight ${
                isUrgent ? "text-red-400" : "text-white"
              }`}
            >
              {formatTime()}
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      {initialSeconds > 0 && <div className="border-t border-white/10 mb-5" />}

      {/* Current Bid */}
      <div className="mb-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Current Bid
        </div>
        <div className="text-4xl font-bold tracking-tight">
          {formatEur(currentBid)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {bidCount} {bidCount === 1 ? "bid" : "bids"} • Min. increment: €5
        </div>
      </div>

      {/* Shipping reminder — bidder always needs to know the final price
          isn't just the hammer price. Shows the estimated range to their
          country if logged in + country set; otherwise generic prompt.
          Pulls from the same zone calculator used elsewhere on the page. */}
      <div className="mt-3 mb-1 flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <Truck size={13} className="text-amber-300 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          {shipEstimate && buyerCountry ? (
            <>
              <p className="text-[11px] text-amber-100 leading-snug">
                Final price <span className="font-bold">does not include shipping</span> —
                add{" "}
                <span className="font-extrabold text-amber-200">
                  {formatShippingRange(shipEstimate.standard)}
                </span>{" "}
                to {shipEstimate.toCountry}.
              </p>
              <p className="text-[10px] text-amber-200/60 mt-0.5">
                Standard {shipEstimate.standard.carrier} ·{" "}
                {shipEstimate.standard.daysMin}–{shipEstimate.standard.daysMax}{" "}
                business days
              </p>
            </>
          ) : (
            <p className="text-[11px] text-amber-100 leading-snug">
              <span className="font-bold">Shipping is added on top</span> of your
              winning bid.
              {!isAuthenticated
                ? " Sign in to see the exact cost to your country."
                : !buyerCountry
                  ? " Set your country in profile to see the exact cost."
                  : ""}
            </p>
          )}
        </div>
      </div>

      {/* Highest Bidder — gold highlight */}
      {highestBidder && bidCount > 0 && (
        <div className="mt-3 mb-5 flex items-center gap-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
            <Crown size={13} className="text-black" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-400">
              Leading Bidder
            </p>
            <p className="text-sm font-black text-amber-300 truncate">
              {highestBidder}
            </p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="text-[9px] text-amber-500/70 uppercase tracking-wider">
              Top bid
            </p>
            <p className="text-sm font-black text-amber-400">
              {`€${currentBid.toLocaleString()}`}
            </p>
          </div>
        </div>
      )}

      {/* Bid Controls */}
      {!auctionEnded && (
        <>
          {/* Auth gate - show login prompt if not authenticated */}
          {!isAuthenticated ? (
            <div className="mt-5 mb-3 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-300 mb-3">
                Sign in to place a bid
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 w-full justify-center py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
              >
                <LogIn size={14} />
                Sign In / Register
              </Link>
            </div>
          ) : (
            <>
              {/* Wallet escrow disclosure — what the user can effectively bid
                  on THIS auction. "Available to bid" includes their own hold
                  on this listing (it rolls into the new bid when they
                  re-raise, so the money isn't really blocked from them). */}
              <div className="mt-5 mb-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-white/60 font-bold uppercase tracking-wider">
                    <WalletIcon size={12} />
                    Available to bid
                  </span>
                  <span className="font-black text-white">
                    {availableBalance !== null
                      ? formatMoney(availableBalance.toFixed(2))
                      : "…"}
                  </span>
                </div>
                {myHoldOnThisAuction > 0 && (
                  <div className="flex items-center justify-between text-[10px] mt-1.5 text-emerald-300/80">
                    <span>↻ Your current bid here (rolls into new)</span>
                    <span>{formatMoney(myHoldOnThisAuction.toFixed(2))}</span>
                  </div>
                )}
                {wallet &&
                  parseFloat(wallet.heldInBids) - myHoldOnThisAuction > 0 && (
                    <div className="flex items-center justify-between text-[10px] mt-1.5 text-white/40">
                      <span>Locked in other auctions</span>
                      <span>
                        {formatMoney(
                          (
                            parseFloat(wallet.heldInBids) - myHoldOnThisAuction
                          ).toFixed(2),
                        )}
                      </span>
                    </div>
                  )}
                {/* Inline top-up CTA when balance is too low to make min bid */}
                {availableBalance !== null && availableBalance < minimumBid && (
                  <Link
                    href="/wallet?topup=1"
                    className="block mt-2.5 w-full py-2 text-center bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] uppercase tracking-wider rounded-lg transition-colors"
                  >
                    Top up wallet to bid
                  </Link>
                )}
                {/* Shipping disclosure — paid separately AFTER winning, never bundled into the bid */}
                {shipFee && (
                  <div className="mt-2.5 pt-2.5 border-t border-white/10">
                    <div className="flex items-center justify-between text-[10px] text-white/60">
                      <span className="flex items-center gap-1.5">
                        <Truck size={11} />
                        Shipping (paid separately)
                      </span>
                      <span className="font-bold text-white/80">
                        ~{formatMoney(shipFee.total)}
                      </span>
                    </div>
                    <p className="text-[9px] text-white/40 mt-1 leading-snug">
                      Your bid only locks the item price. Shipping is paid
                      after you win, on the order page.
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setBidError(null);
                  }}
                  placeholder={`Enter bid (min. ${formatEur(minimumBid)})`}
                  disabled={disabled}
                  className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all disabled:opacity-50"
                />
              </div>

              {/* Error message */}
              {bidError && (
                <div className="flex items-center gap-2 mb-3 text-red-400 text-xs">
                  <AlertCircle size={13} />
                  <span>{bidError}</span>
                </div>
              )}

              {/* Quick Bid Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {quickBids.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickBid(amount)}
                    disabled={disabled}
                    className="py-2.5 bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-white/20 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formatEur(amount)}
                  </button>
                ))}
              </div>

              {/* Place Bid Button — disabled when wallet can't cover the min bid. */}
              <button
                onClick={handlePlaceBid}
                disabled={
                  disabled ||
                  (availableBalance !== null && availableBalance < minimumBid)
                }
                className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {disabled
                  ? "Placing bid..."
                  : availableBalance !== null && availableBalance < minimumBid
                    ? "Top up wallet to bid"
                    : "Place Bid"}
              </button>
            </>
          )}
        </>
      )}

      {/* Watchlist Button */}
      {auctionId && (
        <div className="mt-4">
          <button
            onClick={handleToggleWatchlist}
            className={`w-full py-3 border font-medium text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
              inWatchlist
                ? "bg-white/20 border-white text-white"
                : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40 hover:text-white"
            }`}
          >
            <Heart
              size={14}
              fill={inWatchlist ? "currentColor" : "none"}
              className={inWatchlist ? "text-red-400" : ""}
            />
            {watchlistFeedback
              ? watchlistFeedback
              : inWatchlist
                ? "In Watchlist"
                : "Add to Watchlist"}
          </button>
        </div>
      )}
    </div>
  );
}
