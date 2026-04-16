"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ScanLine,
  BarChart3,
  Sparkles,
  Users,
  Check,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    id: "legit-check",
    icon: ScanLine,
    name: "Legit Check",
    tagline: "Spot a fake before it costs you.",
    description:
      "Upload photos of tags, stitching, and crests. Our AI compares against millions of authentic samples and returns an authenticity score with a detailed breakdown in under 10 seconds.",
    bullets: [
      "Seam, badge & font analysis",
      "Size tag and manufacturer label verification",
      "Downloadable PDF report",
    ],
    credits: 1,
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    color: "blue",
    accent: "#3B82F6",
    iconBg: "bg-blue-500",
    href: "/ai/verify",
    available: true,
  },
  {
    id: "valuation",
    icon: BarChart3,
    name: "Price Oracle",
    tagline: "Find out what your jersey is really worth.",
    description:
      "Stop guessing your start price. AI scans thousands of recent sales of identical or similar items and returns a realistic price range with full market context.",
    bullets: [
      "Data from active and completed auctions",
      "Adjusted for condition and rarity",
      "Optimal listing timing suggestion",
    ],
    credits: 1,
    badge: "New",
    badgeColor: "bg-emerald-100 text-emerald-700",
    color: "emerald",
    accent: "#10B981",
    iconBg: "bg-emerald-500",
    href: "/ai/verify",
    available: true,
  },
  {
    id: "smart-listing",
    icon: Sparkles,
    name: "Smart Listing",
    tagline: "Photo → full listing in one click.",
    description:
      "Take a photo of your kit. AI writes the complete listing — title, description, size, condition, tags — optimised for search and effective selling.",
    bullets: [
      "SEO-optimised title and description",
      "Auto-detects team, season and brand",
      "Collector or casual buyer tone",
    ],
    credits: 2,
    badge: "Beta",
    badgeColor: "bg-purple-100 text-purple-700",
    color: "purple",
    accent: "#8B5CF6",
    iconBg: "bg-purple-500",
    href: "/add-listing",
    available: true,
  },
  {
    id: "expert",
    icon: Users,
    name: "Expert Consultation",
    tagline: "A real collector, not just an algorithm.",
    description:
      "Connect with a verified expert from our network — club historians, professional authenticators, experienced collectors. Written opinion on any item.",
    bullets: [
      "Written report within 48 hours",
      "Ideal for rare, vintage or high-value pieces",
      "Every expert vetted by Matchdays",
    ],
    credits: 5,
    badge: "Coming Soon",
    badgeColor: "bg-gray-100 text-gray-500",
    color: "amber",
    accent: "#F59E0B",
    iconBg: "bg-amber-500",
    href: "#",
    available: false,
  },
];

const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    price: "€2.99",
    perCredit: "€0.30 / credit",
    popular: false,
    desc: "Try all tools risk-free",
  },
  {
    id: "pro",
    name: "Pro",
    credits: 50,
    price: "€9.99",
    perCredit: "€0.20 / credit",
    popular: true,
    desc: "Most popular among active sellers",
  },
  {
    id: "power",
    name: "Power",
    credits: 200,
    price: "€29.99",
    perCredit: "€0.15 / credit",
    popular: false,
    desc: "For collectors and power sellers",
  },
];

// ─── Tool card ────────────────────────────────────────────────────────────────

function ToolCard({
  tool,
  userCredits,
}: {
  tool: (typeof TOOLS)[0];
  userCredits: number;
}) {
  const canAfford = userCredits >= tool.credits;

  const content = (
    <div
      className={`group bg-white rounded-2xl border flex flex-col transition-all duration-200 h-full ${
        tool.available
          ? "border-gray-200/60 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5"
          : "border-gray-100 opacity-70"
      }`}
    >
      {/* Top accent line */}
      <div
        className="h-1 rounded-t-2xl"
        style={{
          background: tool.available
            ? `linear-gradient(90deg, ${tool.accent}, ${tool.accent}88)`
            : "#E5E7EB",
        }}
      />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              <tool.icon size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 leading-tight">
                {tool.name}
              </h3>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tool.badgeColor}`}
              >
                {tool.badge}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
            <Zap size={11} className="text-amber-500" />
            <span className="text-xs font-black text-gray-700">
              {tool.credits}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs font-bold text-gray-700 leading-snug">
          {tool.tagline}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed">
          {tool.description}
        </p>

        {/* Bullets */}
        <ul className="space-y-1.5 flex-1">
          {tool.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
              <Check size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          {tool.available ? (
            canAfford ? (
              <div
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: tool.accent,
                  color: "#fff",
                }}
              >
                <span>Use now</span>
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                  <Zap size={11} />
                  Not enough credits
                </span>
                <span className="text-[10px] text-gray-400">
                  Need {tool.credits} cr.
                </span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
              <Lock size={11} />
              Available soon
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!tool.available || !canAfford) return <div className="h-full">{content}</div>;

  return (
    <Link href={tool.href} className="h-full block">
      {content}
    </Link>
  );
}

// ─── Credit pack card ─────────────────────────────────────────────────────────

function PackCard({
  pack,
  onBuy,
}: {
  pack: (typeof CREDIT_PACKS)[0];
  onBuy: (id: string) => void;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-all ${
        pack.popular
          ? "border-gray-900 bg-gray-900"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {pack.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-gray-900 text-[10px] font-black rounded-full uppercase tracking-wider whitespace-nowrap">
          Best value
        </div>
      )}

      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-black ${pack.popular ? "text-white" : "text-gray-900"}`}
        >
          {pack.name}
        </span>
        <div className="flex items-center gap-1">
          <Zap size={13} className="text-amber-400" />
          <span
            className={`text-lg font-black ${pack.popular ? "text-amber-400" : "text-gray-900"}`}
          >
            {pack.credits}
          </span>
          <span className="text-xs text-gray-400">cr.</span>
        </div>
      </div>

      <p className={`text-[11px] ${pack.popular ? "text-gray-400" : "text-gray-400"}`}>
        {pack.desc}
      </p>

      <div className="flex items-end justify-between mt-auto">
        <div>
          <span
            className={`text-2xl font-black ${pack.popular ? "text-white" : "text-gray-900"}`}
          >
            {pack.price}
          </span>
          <p className={`text-[10px] mt-0.5 ${pack.popular ? "text-gray-500" : "text-gray-400"}`}>
            {pack.perCredit}
          </p>
        </div>
        <button
          onClick={() => onBuy(pack.id)}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-colors ${
            pack.popular
              ? "bg-amber-400 text-gray-900 hover:bg-amber-300"
              : "bg-gray-900 text-white hover:bg-black"
          }`}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardAiTools() {
  const { user, isAdmin } = useAuth();
  const aiCredits = (user as any)?.aiCredits ?? 0;
  const [toast, setToast] = useState<string | null>(null);

  const handleBuy = (packId: string) => {
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    setToast(`Stripe payment for ${pack.name} pack (${pack.credits} credits) — coming soon!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* ── Header + credits balance ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              MatchDays Intelligence
            </span>
          </div>
          <h1 className="text-lg font-black text-gray-900">AI Tools</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Verify, value and create listings — powered by AI
          </p>
        </div>

        {/* Credits widget */}
        <div className="flex items-center gap-3 bg-gray-900 rounded-2xl px-5 py-3.5 flex-shrink-0">
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center mb-0.5">
              <Zap size={14} className="text-amber-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                AI Credits
              </span>
            </div>
            <span className="text-2xl font-black text-white tabular-nums">
              {aiCredits}
            </span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-xs text-gray-400 max-w-[120px] leading-snug">
            {aiCredits === 0 ? (
              <span className="text-amber-400 font-bold">No credits — top up below</span>
            ) : aiCredits < 3 ? (
              <span className="text-amber-400 font-bold">Running low! Top up soon.</span>
            ) : (
              "Credits never expire. Use whenever you want."
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
          {toast}
        </div>
      )}

      {/* ── Tools 2×2 grid ── */}
      {/* ── Credits info banner ── */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
        <Sparkles size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-700 leading-relaxed">
          <span className="font-black">Credits also cover AI Listing Generation</span> — one credit unlocks full authenticity check, auto-generated title &amp; description, and price estimation all at once. The only thing not included is Expert Consultation.
        </p>
      </div>

      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
          Available tools
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} userCredits={isAdmin ? 999 : aiCredits} />
          ))}
        </div>
      </div>

      {/* ── Buy credits ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Buy AI Credits
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Credits never expire — use them whenever you want.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
            <ShieldCheck size={13} className="text-emerald-500" />
            Stripe — secure payment
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {CREDIT_PACKS.map((pack) => (
            <PackCard key={pack.id} pack={pack} onBuy={handleBuy} />
          ))}
        </div>

        {/* Cost reference */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TOOLS.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100"
            >
              <t.icon size={11} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-600">{t.name}</span>
              <span className="text-[10px] text-gray-400">
                = {t.credits} cr.
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
