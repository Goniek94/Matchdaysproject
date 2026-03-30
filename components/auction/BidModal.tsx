"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import BidPanel from "@/components/auction/BidPanel";

interface BidModalProps {
  auctionId: string;
  auctionTitle: string;
  auctionImage?: string;
  auctionEndTime: string;
  currentBid: number;
  bidCount: number;
  highestBidder?: string;
  initialSeconds: number;
  onPlaceBid: (amount: number) => void;
  disabled?: boolean;
  onClose: () => void;
}

/**
 * Modal wrapper around BidPanel.
 * Allows placing a bid without leaving the auction page.
 * Useful on mobile where the sticky sidebar is not visible.
 */
export default function BidModal({
  auctionId,
  auctionTitle,
  auctionImage,
  auctionEndTime,
  currentBid,
  bidCount,
  highestBidder,
  initialSeconds,
  onPlaceBid,
  disabled,
  onClose,
}: BidModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* BidPanel fills the modal */}
        <BidPanel
          auctionId={auctionId}
          auctionTitle={auctionTitle}
          auctionImage={auctionImage}
          auctionEndTime={auctionEndTime}
          currentBid={currentBid}
          bidCount={bidCount}
          highestBidder={highestBidder}
          initialSeconds={initialSeconds}
          onPlaceBid={(amount) => {
            onPlaceBid(amount);
            onClose();
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
