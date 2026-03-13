import { Star, Eye, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ============================================
// BOOST OPTIONS
// ============================================

export interface BoostOption {
  id: string;
  label: string;
  desc: string;
  price: string;
  icon: LucideIcon;
  color: string;
}

export const BOOST_OPTIONS: BoostOption[] = [
  {
    id: "featured",
    label: "Featured Listing",
    desc: "Appear at the top of search results for 7 days",
    price: "4.99",
    icon: Star,
    color: "text-yellow-500",
  },
  {
    id: "spotlight",
    label: "Homepage Spotlight",
    desc: "Featured on the homepage carousel",
    price: "9.99",
    icon: Eye,
    color: "text-purple-500",
  },
  {
    id: "urgent",
    label: "Urgent Sale Badge",
    desc: "Eye-catching badge to attract quick buyers",
    price: "2.99",
    icon: Zap,
    color: "text-orange-500",
  },
];

// ============================================
// VERIFICATION BADGE STYLES
// ============================================

export interface VerificationBadgeConfig {
  label: string;
  className: string;
}

export const VERIFICATION_BADGE: Record<string, VerificationBadgeConfig> = {
  AI_VERIFIED_HIGH: {
    label: "AI Verified – High Confidence",
    className: "bg-green-100 text-green-700 border-green-300",
  },
  AI_VERIFIED_MEDIUM: {
    label: "AI Verified – Medium Confidence",
    className: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  FLAGGED: {
    label: "Flagged for Review",
    className: "bg-red-100 text-red-700 border-red-300",
  },
  NOT_AI_VERIFIED: {
    label: "Not AI Verified",
    className: "bg-gray-100 text-gray-600 border-gray-300",
  },
};

// ============================================
// TAG CONDITION LABELS
// ============================================

export const TAG_CONDITION_LABELS: Record<string, string> = {
  intact: "Intact",
  cut: "Cut",
  washed_out: "Washed Out",
  missing: "Missing",
};
