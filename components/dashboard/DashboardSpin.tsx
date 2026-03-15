"use client";

import dynamic from "next/dynamic";
import { Clock, Zap, Trophy, Tag, Star, Gift, RefreshCw } from "lucide-react";
import { useSpinWheel, SPIN_PRIZES } from "@/lib/hooks/useSpinWheel";
import { SpinResultModal } from "./spin-wheel/SpinResultModal";
import type { SpinPrize } from "@/types/features/spin-wheel.types";

// ─── Lazy-load canvas (avoids SSR issues) ─────────────────────────────────────

const SpinWheelCanvas = dynamic(
  () =>
    import("./spin-wheel/SpinWheelCanvas").then((m) => ({
      default: m.SpinWheelCanvas,
    })),
  { ssr: false },
);

// ─── Prize legend helpers ─────────────────────────────────────────────────────

function PrizeIcon({ category }: { category: string }) {
  const cls = "flex-shrink-0";
  switch (category) {
    case "premium":
      return <Trophy size={14} className={`${cls} text-amber-400`} />;
    case "subscription":
      return <Gift size={14} className={`${cls} text-orange-400`} />;
    case "discount":
      return <Tag size={14} className={`${cls} text-purple-400`} />;
    case "loyalty":
      return <Star size={14} className={`${cls} text-blue-400`} />;
    default:
      return <RefreshCw size={14} className={`${cls} text-gray-500`} />;
  }
}

function PrizeLegendItem({ prize }: { prize: SpinPrize }) {
  return (
    <div className="flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
      {/* Color dot */}
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: prize.color }}
      />
      <span className="text-lg leading-none select-none">{prize.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-200 truncate">
          {prize.label}
        </p>
        <p className="text-[10px] text-gray-500 truncate">
          {prize.description}
        </p>
      </div>
      <PrizeIcon category={prize.category} />
    </div>
  );
}

// ─── Spin button ──────────────────────────────────────────────────────────────

interface SpinButtonProps {
  canSpin: boolean;
  isSpinning: boolean;
  countdown: string;
  onSpin: () => void;
}

function SpinButton({
  canSpin,
  isSpinning,
  countdown,
  onSpin,
}: SpinButtonProps) {
  if (isSpinning) {
    return (
      <button
        disabled
        className="relative px-10 py-4 rounded-2xl font-black text-base bg-gray-700 text-gray-400 cursor-not-allowed overflow-hidden"
      >
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
          Spinning…
        </span>
      </button>
    );
  }

  if (!canSpin) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
          <Clock size={15} />
          <span className="text-sm font-bold">Next spin in</span>
        </div>
        <div className="font-black text-2xl text-white tracking-widest tabular-nums">
          {countdown}
        </div>
        <p className="text-[11px] text-gray-500 mt-1">Come back tomorrow!</p>
      </div>
    );
  }

  return (
    <button
      onClick={onSpin}
      className="group relative px-10 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-gray-900 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/30 overflow-hidden"
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      <span className="relative flex items-center gap-2">
        <Zap size={18} className="fill-current" />
        SPIN NOW
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardSpin() {
  const {
    prizes,
    phase,
    rotation,
    lastResult,
    cooldownMs,
    countdown,
    spin,
    dismissResult,
  } = useSpinWheel();

  const isSpinning = phase === "spinning";
  const canSpin = phase === "idle" && cooldownMs === 0;

  return (
    <>
      {/* ── Result modal ── */}
      {phase === "result" && lastResult && (
        <SpinResultModal result={lastResult} onDismiss={dismissResult} />
      )}

      <div className="space-y-6">
        {/* ── Header ── */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-black text-gray-900">SuperSpin</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider">
              Daily
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Spin the wheel once a day to win exclusive rewards
          </p>
        </div>

        {/* ── Main card ── */}
        <div className="bg-gray-900 rounded-3xl overflow-hidden relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.1),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* ── Wheel area ── */}
              <div className="flex flex-col items-center gap-6 flex-shrink-0">
                {/* Pointer triangle */}
                <div className="relative">
                  {/* Top pointer */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-amber-400 drop-shadow-lg" />

                  {/* Wheel glow ring */}
                  <div
                    className={`rounded-full p-1 transition-all duration-300 ${
                      isSpinning
                        ? "shadow-[0_0_40px_rgba(245,158,11,0.5)]"
                        : canSpin
                          ? "shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                          : "shadow-none"
                    }`}
                  >
                    <SpinWheelCanvas
                      prizes={prizes}
                      rotation={rotation}
                      isSpinning={isSpinning}
                      size={300}
                    />
                  </div>
                </div>

                {/* Spin button */}
                <SpinButton
                  canSpin={canSpin}
                  isSpinning={isSpinning}
                  countdown={countdown}
                  onSpin={spin}
                />
              </div>

              {/* ── Prize list ── */}
              <div className="flex-1 w-full">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">
                  Possible Rewards
                </p>
                <div className="space-y-0.5">
                  {SPIN_PRIZES.filter((p) => p.category !== "try_again").map(
                    (prize) => (
                      <PrizeLegendItem key={prize.id} prize={prize} />
                    ),
                  )}
                </div>

                {/* Last win info */}
                {lastResult && lastResult.prize.category !== "try_again" && (
                  <div className="mt-4 mx-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Last Win
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lastResult.prize.emoji}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-200">
                          {lastResult.prize.label}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {new Date(lastResult.timestamp).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Info cards row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <Trophy size={16} className="text-amber-600" />
            </div>
            <p className="text-sm font-black text-gray-900">Grand Prize</p>
            <p className="text-xs text-gray-400 mt-0.5">
              1 month Premium Elite — win it with every spin!
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <Star size={16} className="text-blue-600" />
            </div>
            <p className="text-sm font-black text-gray-900">Loyalty Points</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Earn 100–500 points redeemable for rewards
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
              <Tag size={16} className="text-purple-600" />
            </div>
            <p className="text-sm font-black text-gray-900">Discounts</p>
            <p className="text-xs text-gray-400 mt-0.5">
              10–20% off subscriptions and premium features
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
