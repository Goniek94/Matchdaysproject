"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Info,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Shield,
  Tag,
  Clock,
  Gavel,
  ShoppingBag,
  Shirt,
  MapPin,
  Hash,
  User,
  PenTool,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CURRENCY, AUCTION_DURATIONS } from "@/lib/constants/listing.constants";
import { SmartFormData } from "./types";

// ============================================
// TYPES
// ============================================

interface SmartFormSummaryProps {
  data: SmartFormData;
  onPublish: () => void;
  onBack: () => void;
  isPublishing?: boolean;
}

// ============================================
// HELPERS
// ============================================

/** Resolve human-readable label for auction duration */
const getDurationLabel = (durationId: string): string => {
  const found = AUCTION_DURATIONS.find((d) => d.id === durationId);
  return found?.label ?? durationId;
};

/** Map tag condition value to readable label */
const TAG_CONDITION_LABELS: Record<string, string> = {
  intact: "Intact",
  cut: "Cut",
  washed_out: "Washed Out",
  missing: "Missing",
};

/** Map verification status to badge style */
const VERIFICATION_BADGE: Record<string, { label: string; className: string }> =
  {
    AI_VERIFIED_HIGH: {
      label: "AI Verified – High",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    AI_VERIFIED_MEDIUM: {
      label: "AI Verified – Medium",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    FLAGGED: {
      label: "Flagged for Review",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    NOT_AI_VERIFIED: {
      label: "Not AI Verified",
      className: "bg-gray-100 text-gray-600 border-gray-200",
    },
  };

// ============================================
// COMPONENT
// ============================================

const SmartFormSummary = ({
  data,
  onPublish,
  onBack,
  isPublishing = false,
}: SmartFormSummaryProps) => {
  const [activeImage, setActiveImage] = useState<string | null>(
    data.photos?.[0]?.url || null,
  );

  // Use AI authenticity score if available, otherwise fallback
  const score = data.aiData?.authenticityScore ?? 0;
  const authenticityLabel = data.aiData?.authenticityLabel ?? "Unknown";
  const authenticityNotes =
    data.aiData?.authenticityNotes ??
    "No AI analysis data available for this listing.";

  const isAuction = data.listingType === "auction";
  const verificationBadge =
    VERIFICATION_BADGE[data.verificationStatus] ??
    VERIFICATION_BADGE.NOT_AI_VERIFIED;

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-2">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Final Review
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          AI has optimized your listing. Check everything before it goes live on
          the marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ================================================
            LEFT COLUMN: Gallery & All Details
            ================================================ */}
        <div className="lg:col-span-2 space-y-6">
          {/* IMAGE PREVIEW */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="relative aspect-square md:aspect-video bg-gray-50">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No images
                </div>
              )}
            </div>
            {data.photos && data.photos.length > 1 && (
              <div className="p-4 bg-white flex gap-2 overflow-x-auto">
                {data.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(photo.url)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === photo.url
                        ? "border-black scale-105"
                        : "border-transparent opacity-70"
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* TITLE & DESCRIPTION */}
          <div className="space-y-4">
            <div className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-primary/30 transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                  Optimized Title
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-primary/5 border-primary/10 text-primary"
                >
                  AI ENHANCED
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {data.title || "Untitled Listing"}
              </h3>
            </div>

            <div className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-primary/30 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 block mb-3">
                Description
              </span>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{data.description || "No description provided."}&rdquo;
              </p>
            </div>
          </div>

          {/* PRODUCT SPECIFICATIONS */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info size={16} className="text-primary" /> Product
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                {/* Category */}
                <SpecItem
                  icon={<Tag size={14} />}
                  label="Category"
                  value={data.category}
                />
                {/* Brand */}
                <SpecItem
                  icon={<Shirt size={14} />}
                  label="Brand"
                  value={data.brand}
                />
                {/* Model */}
                <SpecItem label="Model" value={data.model} />
                {/* Club / Team */}
                <SpecItem label="Club / Team" value={data.club} />
                {/* Season */}
                <SpecItem
                  icon={<Calendar size={14} />}
                  label="Season"
                  value={data.season}
                />
                {/* Size */}
                <SpecItem label="Size" value={data.size || "Standard"} />
                {/* Condition */}
                <SpecItem label="Condition" value={data.condition} badge />
                {/* Listing Type */}
                <SpecItem
                  icon={
                    isAuction ? <Gavel size={14} /> : <ShoppingBag size={14} />
                  }
                  label="Listing Type"
                  value={isAuction ? "Auction" : "Buy Now"}
                />
                {/* Country of Production (from AI) */}
                {data.aiData?.countryOfProduction && (
                  <SpecItem
                    icon={<MapPin size={14} />}
                    label="Country"
                    value={data.aiData.countryOfProduction}
                  />
                )}
                {/* Serial Code (from AI) */}
                {data.aiData?.serialCode && (
                  <SpecItem
                    icon={<Hash size={14} />}
                    label="Serial Code"
                    value={data.aiData.serialCode}
                  />
                )}
                {/* Player Name (from AI or form) */}
                {data.aiData?.playerName && (
                  <SpecItem
                    icon={<User size={14} />}
                    label="Player Name"
                    value={data.aiData.playerName}
                  />
                )}
                {/* Player Number (from AI or form) */}
                {data.aiData?.playerNumber && (
                  <SpecItem
                    icon={<Hash size={14} />}
                    label="Player Number"
                    value={data.aiData.playerNumber}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* VERIFICATION DETAILS */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield size={16} className="text-primary" /> Verification
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {/* Verification Status */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold ${verificationBadge.className}`}
                >
                  {verificationBadge.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4">
                {/* Tag Condition */}
                <SpecItem
                  label="Tag Condition"
                  value={
                    TAG_CONDITION_LABELS[data.verification.tagCondition] ??
                    data.verification.tagCondition
                  }
                />
                {/* Autograph */}
                <SpecItem
                  icon={<PenTool size={14} />}
                  label="Autograph"
                  value={
                    data.verification.hasAutograph
                      ? data.verification.autographDetails || "Yes"
                      : "No"
                  }
                />
                {/* Vintage */}
                <SpecItem
                  label="Vintage"
                  value={
                    data.verification.isVintage
                      ? data.verification.vintageYear
                        ? `Yes (${data.verification.vintageYear})`
                        : "Yes"
                      : "No"
                  }
                />
                {/* Player Print */}
                <SpecItem
                  label="Player Print"
                  value={data.verification.noPlayerPrint ? "None" : "Present"}
                />
              </div>

              {/* Defects */}
              {data.verification.hasDefects &&
                data.verification.defects.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider flex items-center gap-1">
                      <AlertTriangle size={12} /> Reported Defects
                    </p>
                    <ul className="space-y-1.5">
                      {data.verification.defects.map((defect, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                        >
                          <span className="font-semibold capitalize">
                            {defect.type}
                          </span>
                          {defect.description && (
                            <span className="text-gray-500">
                              {" "}
                              — {defect.description}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* AI Authenticity Notes */}
              {data.aiData?.authenticityNotes && (
                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                    AI Authenticity Notes
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {data.aiData.authenticityNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AUCTION DETAILS (only for auction type) */}
          {isAuction && (
            <Card className="border-gray-100 shadow-sm rounded-2xl">
              <CardHeader className="border-b border-gray-50 pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Gavel size={16} className="text-primary" /> Auction Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                  <SpecItem
                    label="Starting Price"
                    value={
                      data.startPrice
                        ? `${CURRENCY.SYMBOL}${data.startPrice}`
                        : "N/A"
                    }
                  />
                  <SpecItem
                    label="Bid Step"
                    value={
                      data.bidStep ? `${CURRENCY.SYMBOL}${data.bidStep}` : "N/A"
                    }
                  />
                  <SpecItem
                    icon={<Clock size={14} />}
                    label="Duration"
                    value={getDurationLabel(data.duration)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ================================================
            RIGHT COLUMN: Pricing & Action
            ================================================ */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* AUTHENTICITY SCORE CARD */}
          <Card className="border-green-100 bg-green-50/50 overflow-hidden rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-green-700">
                  Authenticity Confidence
                </span>
                <span className="text-2xl font-black text-green-600">
                  {score}%
                </span>
              </div>
              <Progress
                value={score}
                className="h-1.5 bg-green-100"
                indicatorClassName="bg-green-500"
              />
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] bg-green-50 border-green-200 text-green-700"
                >
                  {authenticityLabel}
                </Badge>
              </div>
              <div className="mt-3 flex gap-2 items-start text-[10px] text-green-700 leading-tight">
                <CheckCircle2 size={12} className="shrink-0 mt-0.5" />
                <span>{authenticityNotes}</span>
              </div>
            </CardContent>
          </Card>

          {/* AI PRICE RANGE (if available) */}
          {data.aiData && (
            <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    AI Price Estimate
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Min
                    </p>
                    <p className="text-lg font-bold text-gray-700">
                      {CURRENCY.SYMBOL}
                      {data.aiData.priceMin}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-primary uppercase font-bold">
                      Suggested
                    </p>
                    <p className="text-2xl font-black text-primary">
                      {CURRENCY.SYMBOL}
                      {data.aiData.priceSuggested}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Max
                    </p>
                    <p className="text-lg font-bold text-gray-700">
                      {CURRENCY.SYMBOL}
                      {data.aiData.priceMax}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PRICING CARD */}
          <Card className="border-none bg-black text-white shadow-xl rounded-2xl overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {isAuction ? "Starting Price" : "Market Value"}
                </span>
              </div>
              <div>
                <span className="text-5xl font-black tracking-tighter">
                  {CURRENCY.SYMBOL}
                  {isAuction
                    ? data.startPrice || data.price || "0"
                    : data.price || "0"}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/10 text-white border-none text-[10px]"
              >
                {isAuction ? "AUCTION STARTING PRICE" : "BUY IT NOW PRICE"}
              </Badge>
            </div>
          </Card>

          {/* ACTIONS */}
          <div className="space-y-3">
            <Button
              className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20"
              onClick={onPublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Listing <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 font-bold border-gray-200 rounded-xl hover:bg-gray-50"
              onClick={onBack}
              disabled={isPublishing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back & Edit
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex gap-3">
            <AlertCircle size={16} className="text-gray-400 shrink-0" />
            <p className="text-[10px] text-gray-500 leading-snug">
              By publishing, you agree to our terms. Your item will be visible
              to thousands of collectors instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// REUSABLE SPEC ITEM COMPONENT
// ============================================

interface SpecItemProps {
  label: string;
  value?: string | null;
  badge?: boolean;
  icon?: React.ReactNode;
}

/** Single specification row used in the product details grid */
const SpecItem = ({ label, value, badge = false, icon }: SpecItemProps) => (
  <div className="space-y-1">
    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
      {icon}
      {label}
    </p>
    {badge ? (
      <Badge className="bg-black text-white hover:bg-black font-medium text-[10px]">
        {(value || "N/A").toUpperCase()}
      </Badge>
    ) : (
      <p className="text-sm font-semibold text-gray-800 capitalize">
        {value || "N/A"}
      </p>
    )}
  </div>
);

export default SmartFormSummary;
