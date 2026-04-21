"use client";

import Link from "next/link";
import {
  Truck, Crown, Zap, Gift, Lock, ChevronRight, ArrowLeft, Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

// ─── Reward data ──────────────────────────────────────────────────────────────

const REWARDS = [
  {
    id: "free-shipping",
    icon: Truck,
    title: "Free Shipping",
    desc: "Get free standard shipping on your next purchase over €30. No code needed — applied automatically at checkout.",
    value: "€4.99",
    valueLabel: "saved",
    available: true,
    cta: "Claim now",
    ctaHref: "/auctions",
    grad: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
    glow: "rgba(16,185,129,0.15)",
    badgeBg: "#d1fae5",
    badgeColor: "#065f46",
    badge: "Available",
  },
  {
    id: "ai-credit",
    icon: Zap,
    title: "Free AI Credit",
    desc: "Earn 1 free AI credit by completing your seller profile and adding your first item to My Collection.",
    value: "1 cr.",
    valueLabel: "free",
    available: true,
    cta: "Complete profile",
    ctaHref: "/dashboard",
    grad: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    glow: "rgba(124,58,237,0.15)",
    badgeBg: "#ede9fe",
    badgeColor: "#5b21b6",
    badge: "Earn now",
  },
  {
    id: "premium-discount",
    icon: Crown,
    title: "20% off Premium",
    desc: "Upgrade to Premium and get 20% off your first month. Includes 50 active listings, priority support and 5 AI credits/month.",
    value: "20%",
    valueLabel: "off",
    available: false,
    cta: "Coming soon",
    ctaHref: "/pricing",
    grad: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    glow: "rgba(217,119,6,0.15)",
    badgeBg: "#fef3c7",
    badgeColor: "#92400e",
    badge: "Coming soon",
  },
  {
    id: "referral",
    icon: Gift,
    title: "Refer a Friend",
    desc: "Invite a friend to Matchdays. When they list their first item you both get 2 AI credits and 200 loyalty points.",
    value: "2 cr.",
    valueLabel: "per referral",
    available: false,
    cta: "Coming soon",
    ctaHref: "#",
    grad: "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
    glow: "rgba(219,39,119,0.15)",
    badgeBg: "#fce7f3",
    badgeColor: "#9d174d",
    badge: "Coming soon",
  },
  {
    id: "loyalty-boost",
    icon: Sparkles,
    title: "Loyalty Point Boost",
    desc: "Double points on all transactions during special events. Stay active to unlock weekend multipliers and seasonal campaigns.",
    value: "2×",
    valueLabel: "points",
    available: false,
    cta: "Coming soon",
    ctaHref: "#",
    grad: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    glow: "rgba(124,58,237,0.15)",
    badgeBg: "#ede9fe",
    badgeColor: "#4c1d95",
    badge: "Coming soon",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RewardsPage() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiCredits = (user as any)?.aiCredits ?? 0;

  const available = REWARDS.filter((r) => r.available);
  const upcoming  = REWARDS.filter((r) => !r.available);

  return (
    <div className="min-h-screen" style={{ background: "#f9f8f6" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(145deg, #0f0e0b 0%, #16121e 55%, #100e0b 100%)", borderBottom: "1px solid #1f1e1b" }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[11px] font-bold mb-6 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={13} /> Back to dashboard
          </Link>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Gift size={14} className="text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.3)" }}>Matchdays</p>
              </div>
              <h1 className="text-4xl font-black text-white leading-none" style={{ letterSpacing: "-0.03em" }}>Your Rewards</h1>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>Perks, discounts and bonuses — all in one place</p>
            </div>

            {/* Credits summary */}
            <div className="flex items-center gap-4 pb-1">
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>AI Credits</p>
                <p className="text-2xl font-black tabular-nums" style={{ color: aiCredits === 0 ? "#f87171" : "#38bdf8", letterSpacing: "-0.04em" }}>{aiCredits}</p>
              </div>
              <div className="w-px h-10" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Loyalty pts</p>
                <p className="text-2xl font-black tabular-nums text-white" style={{ letterSpacing: "-0.04em" }}>{(user?.totalPoints ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* ── Available rewards ── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: "#a8a49a" }}>
            Available now · {available.length}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {available.map((r) => (
              <div key={r.id} className="group rounded-2xl overflow-hidden" style={{ border: "1px solid #e6e3da" }}>
                {/* Colored top bar */}
                <div className="h-1" style={{ background: r.grad }} />
                <div className="bg-white p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: r.glow.replace("0.15", "0.2"), border: `1px solid ${r.glow.replace("0.15", "0.35")}` }}>
                      <r.icon size={18} style={{ color: r.badgeColor }} />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: r.badgeBg, color: r.badgeColor }}>
                      {r.badge}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-black" style={{ color: "#0d0c09" }}>{r.title}</h3>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "#a8a49a" }}>{r.desc}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-2xl font-black" style={{ color: "#0d0c09", letterSpacing: "-0.04em" }}>{r.value}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#c0bbb4" }}>{r.valueLabel}</p>
                    </div>
                  </div>

                  <Link href={r.ctaHref}
                    className="group/btn mt-1 w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                    style={{ background: r.grad }}>
                    {r.cta}
                    <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Coming soon ── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: "#a8a49a" }}>
            Coming soon
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upcoming.map((r) => (
              <div key={r.id} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "#fff", border: "1px solid #e6e3da", opacity: 0.75 }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: r.glow, border: `1px solid ${r.glow}` }}>
                    <r.icon size={16} style={{ color: r.badgeColor }} />
                  </div>
                  <Lock size={13} style={{ color: "#d1cec7" }} />
                </div>
                <h3 className="text-sm font-black mb-1" style={{ color: "#0d0c09" }}>{r.title}</h3>
                <p className="text-[11px] leading-snug mb-3" style={{ color: "#a8a49a" }}>{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: r.badgeBg, color: r.badgeColor }}>{r.badge}</span>
                  <span className="text-xl font-black" style={{ color: "#d1cec7", letterSpacing: "-0.04em" }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: "#0d0c09" }}>
          <div>
            <p className="text-base font-black text-white mb-1">Want more rewards?</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Upgrade to Premium for exclusive perks and bonus AI credits every month.</p>
          </div>
          <Link href="/pricing"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)", color: "#0d0c09" }}>
            <Crown size={14} /> Upgrade plan
          </Link>
        </div>

      </div>
    </div>
  );
}
