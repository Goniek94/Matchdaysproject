"use client";

import { useState } from "react";
import {
  Check,
  Zap,
  Star,
  ShieldCheck,
  Crown,
  ArrowLeft,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { UpgradeModal, type PlanDef } from "@/components/pricing/UpgradeModal";
import { BusinessInquiryModal } from "@/components/pricing/BusinessInquiryModal";

// ─── Plans ────────────────────────────────────────────────────────────────────
// `id` MUST match the backend tier code in
// matchdaysbackend/src/modules/subscriptions/tier-config.ts.
// Renaming a tier silently de-grades historical orders (Order.feeTier is a
// snapshot of this string).

interface Plan {
  id: "free" | "premium" | "premium_pro" | "elite";
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: { text: string; included: boolean; highlight?: boolean }[];
  cta: string;
  popular: boolean;
  card: string;
  iconBg: string;
  priceColor: string;
  highlight: string;
  checkActive: string;
  btn: string;
  glow: string;
  color: string;
  border: string;
  bg: string;
  badgeBg: string;
  badgeText: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "FREE",
    icon: <Zap size={22} />,
    monthlyPrice: 0,
    annualPrice: 0,
    description: "For occasional users",
    features: [
      { text: "Buy & sell on the platform", included: true },
      { text: "Access to verified auctions", included: true },
      { text: "Daily Quiz + Weekly Predictor (free games)", included: true },
      { text: "3 AI credits per month", included: true },
      { text: "12% Sales Commission", included: true, highlight: true },
    ],
    cta: "Start for Free",
    popular: false,
    card: "bg-[#1a1a1a] border-white/10",
    iconBg: "bg-white/10 text-white/60",
    priceColor: "text-white",
    highlight: "text-white/60",
    checkActive: "bg-white/20 text-white",
    btn: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    glow: "",
    color: "text-gray-400",
    border: "rgba(255,255,255,0.12)",
    bg: "rgba(255,255,255,0.04)",
    badgeBg: "rgba(255,255,255,0.08)",
    badgeText: "#9CA3AF",
  },
  {
    id: "premium",
    name: "PREMIUM",
    icon: <Star size={22} />,
    monthlyPrice: 13.99,
    annualPrice: 134.3, // ~17% off (10mo priced)
    description: "For active sellers and collectors",
    features: [
      { text: "8% Sales Commission", included: true, highlight: true },
      { text: "All games unlocked (Spin, Tiki-Taka, Missing XI, Bingo)", included: true },
      { text: "25 AI credits per month", included: true },
      { text: "1 featured-listing slot per month", included: true },
      { text: "Ad-free experience", included: true },
    ],
    cta: "Choose Premium",
    popular: true,
    card: "bg-gradient-to-b from-indigo-900 to-indigo-950 border-indigo-500/40",
    iconBg: "bg-indigo-500/20 text-indigo-300",
    priceColor: "text-white",
    highlight: "text-indigo-300",
    checkActive: "bg-indigo-500/30 text-indigo-200",
    btn: "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30",
    glow: "shadow-[0_0_60px_rgba(99,102,241,0.25)]",
    color: "text-indigo-300",
    border: "rgba(99,102,241,0.4)",
    bg: "rgba(99,102,241,0.08)",
    badgeBg: "rgba(99,102,241,0.2)",
    badgeText: "#818CF8",
  },
  {
    id: "premium_pro",
    name: "PREMIUM PRO",
    icon: <ShieldCheck size={22} />,
    monthlyPrice: 21.99,
    annualPrice: 211.1, // ~17% off
    description: "For regular sellers",
    features: [
      { text: "6% Sales Commission", included: true, highlight: true },
      { text: "100 AI credits per month", included: true },
      { text: "3 featured-listing slots per month", included: true },
      { text: "Priority listing placement", included: true },
      { text: "Ad-free experience", included: true },
    ],
    cta: "Choose PRO",
    popular: false,
    card: "bg-gradient-to-b from-violet-900 to-purple-950 border-purple-500/40",
    iconBg: "bg-purple-500/20 text-purple-300",
    priceColor: "text-white",
    highlight: "text-purple-300",
    checkActive: "bg-purple-500/30 text-purple-200",
    btn: "bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/30",
    glow: "shadow-[0_0_60px_rgba(168,85,247,0.20)]",
    color: "text-purple-300",
    border: "rgba(168,85,247,0.4)",
    bg: "rgba(168,85,247,0.08)",
    badgeBg: "rgba(168,85,247,0.2)",
    badgeText: "#C084FC",
  },
  {
    id: "elite",
    name: "ELITE",
    icon: <Crown size={22} />,
    monthlyPrice: 49.99,
    annualPrice: 479.9, // ~17% off
    description: "For power users & pros",
    features: [
      { text: "5% Sales Commission", included: true, highlight: true },
      { text: "300 AI credits per month", included: true },
      { text: "10 featured-listing slots per month", included: true },
      { text: "Top-of-feed placement", included: true },
      { text: "Priority support + event invitations", included: true },
    ],
    cta: "Join the Elite",
    popular: false,
    card: "bg-gradient-to-b from-amber-900/80 to-yellow-950 border-amber-400/40",
    iconBg: "bg-amber-400/20 text-amber-300",
    priceColor: "text-amber-300",
    highlight: "text-amber-300",
    checkActive: "bg-amber-400/30 text-amber-200",
    btn: "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black shadow-lg shadow-amber-500/30",
    glow: "shadow-[0_0_60px_rgba(245,158,11,0.20)]",
    color: "text-amber-300",
    border: "rgba(245,158,11,0.4)",
    bg: "rgba(245,158,11,0.08)",
    badgeBg: "rgba(245,158,11,0.2)",
    badgeText: "#FCD34D",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showB2B, setShowB2B] = useState(false);
  const currentTier = (user?.subscriptionTier ?? "free").toLowerCase();

  const handleCta = (plan: Plan) => {
    if (!isAuthenticated) return;
    if (plan.id === "free" || plan.id === currentTier) return;
    setSelectedPlan(plan);
  };

  const handleSuccess = () => {
    setSelectedPlan(null);
  };

  return (
    <section className="min-h-screen py-24 px-6 md:px-12 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-900/15 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight italic">
            Change the rules of the game
          </h2>
          <p className="text-xl text-white/50 mb-10">
            Choose a level tailored to your activity on MatchDays.
          </p>

          {/* Monthly / Annual toggle */}
          <div
            className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl cursor-pointer"
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!isAnnual ? "bg-white text-black shadow-lg" : "text-white/40"}`}>
              Monthly
            </div>
            <div className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isAnnual ? "bg-white text-black shadow-lg" : "text-white/40"}`}>
              Yearly
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black">-17%</span>
            </div>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentTier === plan.id;
            const price = isAnnual && plan.monthlyPrice > 0 ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`group relative flex flex-col p-7 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-3 ${plan.card} ${plan.glow}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-xl whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/10 text-white/60 border border-white/10">
                    Current plan
                  </div>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-xl ${plan.iconBg} transition-transform duration-500 group-hover:rotate-12`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{plan.name}</h3>
                    <p className="text-[11px] text-white/40 font-medium">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-7">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black tracking-tighter ${plan.priceColor}`}>
                      {plan.monthlyPrice === 0 ? "Free" : `€${price.toFixed(2)}`}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-white/30 font-bold text-lg">/{isAnnual ? "yr" : "mo"}</span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-6" />

                {/* Features */}
                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${plan.checkActive}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className={`text-sm leading-snug ${f.highlight ? `font-black ${plan.highlight}` : "text-white/50 font-medium"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div className={`block w-full py-3.5 text-center font-black text-sm rounded-2xl uppercase tracking-wider opacity-50 cursor-default ${plan.btn}`}>
                    ✓ Active plan
                  </div>
                ) : plan.id === "free" ? (
                  <Link
                    href="/register"
                    className={`block w-full py-3.5 text-center font-black text-sm rounded-2xl transition-all active:scale-95 uppercase tracking-wider ${plan.btn}`}
                  >
                    {plan.cta}
                  </Link>
                ) : isAuthenticated ? (
                  <button
                    onClick={() => handleCta(plan)}
                    className={`block w-full py-3.5 text-center font-black text-sm rounded-2xl transition-all active:scale-95 uppercase tracking-wider ${plan.btn}`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    href="/register"
                    className={`block w-full py-3.5 text-center font-black text-sm rounded-2xl transition-all active:scale-95 uppercase tracking-wider ${plan.btn}`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* B2B "Are you a shop?" CTA — distinct row underneath the four tiers */}
        <div className="mt-14">
          <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
            <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
              <div className="p-4 rounded-2xl bg-white/5 text-white/70 self-start md:self-center">
                <Building2 size={28} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-1.5">
                  Are you a shop?
                </h3>
                <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl">
                  Selling 100+ items per month? We offer custom commission
                  rates, volume API access, and a dedicated account manager
                  starting at €299/mo. Tell us about your operation.
                </p>
              </div>
              <button
                onClick={() => setShowB2B(true)}
                className="px-8 py-3.5 font-black text-sm rounded-2xl bg-white text-black hover:bg-white/90 active:scale-95 transition-all uppercase tracking-wider whitespace-nowrap"
              >
                Contact sales
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-14 text-white/20 text-sm max-w-2xl mx-auto">
          MatchDays operates on a freemium model. Subscriptions never block
          selling — they affect commissions, visibility, and access to
          professional AI tools.
        </p>
      </div>

      {/* Upgrade modal */}
      {selectedPlan && (
        <UpgradeModal
          plan={selectedPlan as PlanDef}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* B2B inquiry modal */}
      {showB2B && (
        <BusinessInquiryModal onClose={() => setShowB2B(false)} />
      )}
    </section>
  );
}
