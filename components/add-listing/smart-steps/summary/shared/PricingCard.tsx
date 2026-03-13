import { Gavel, ShoppingBag, CheckCircle2 } from "lucide-react";
import { CURRENCY } from "@/lib/constants/listing.constants";
import type { SmartFormData } from "@/types/features/listing.types";
import { getDurationLabel } from "../summary.helpers";

interface PricingCardProps {
  data: SmartFormData;
}

/** Dark pricing card showing price and verified status below */
const PricingCard = ({ data }: PricingCardProps) => {
  const isAuction = data.listingType === "auction";
  const score = data.aiData?.authenticityScore ?? 0;
  const isVerified = score >= 80;

  return (
    <div className="bg-black text-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
        {isAuction ? <Gavel size={14} /> : <ShoppingBag size={14} />}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isAuction ? "Starting Price" : "Buy Now Price"}
        </span>
      </div>
      <div className="text-center">
        <span className="text-4xl font-black tracking-tight">
          {CURRENCY.SYMBOL}
          {isAuction ? data.startPrice || data.price || "0" : data.price || "0"}
        </span>
      </div>
      {isAuction && (
        <div className="mt-3 flex justify-center gap-4 text-xs text-gray-400">
          <span>
            Bid Step: {CURRENCY.SYMBOL}
            {data.bidStep || "—"}
          </span>
          <span>Duration: {getDurationLabel(data.duration)}</span>
        </div>
      )}

      {/* Verified badge below price */}
      <div className="mt-4 flex justify-center">
        {isVerified ? (
          <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full">
            <CheckCircle2 size={14} />
            <span className="text-xs font-bold">Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-gray-700/50 text-gray-400 px-4 py-1.5 rounded-full">
            <span className="text-xs font-medium">Not Verified</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
