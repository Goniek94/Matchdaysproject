"use client";

import dynamic from "next/dynamic";
import { X, Clock, Zap } from "lucide-react";
import { useEffect } from "react";
import { useSpinWheel, SPIN_PRIZES } from "@/lib/hooks/useSpinWheel";
import { SpinResultModal } from "./SpinResultModal";
import type { SpinPrize } from "@/types/features/spin-wheel.types";

// ─── Lazy-load canvas (avoids SSR issues) ─────────────────────────────────────

const SpinWheelCanvas = dynamic(
  () =>
    import("./SpinWheelCanvas").then((m) => ({ default: m.SpinWheelCanvas })),
  { ssr: false },
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface DailySpinModalProps {
  onClose: () => void;
}

// ─── Prize legend item ────────────────────────────────────────────────────────

function PrizeRow({ prize }: { prize: SpinPrize }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: prize.color }}
      />
      <span className="text-base leading-none">{prize.emoji}</span>
      <span className="text-xs font-semibold text-gray-300 flex-1 truncate">
        {prize.label}
      </span>
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
        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm bg-gray-700 text-gray-400 cursor-not-allowed"
      >
        <span className="w-4 h-4 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
        Spinning…
      </button>
    );
  }

  if (!canSpin) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
          <Clock size={13} />
          <span className="text-xs font-bold">Next spin in</span>
        </div>
        <div className="font-black text-xl text-white tracking-widest tabular-nums">
          {countdown}
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5">Come back tomorrow!</p>
      </div>
    );
  }

  return (
    <button
      onClick={onSpin}
      className="group relative flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-gray-900 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/30 overflow-hidden"
    >
      {/* Shimmer */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      <Zap size={16} className="relative fill-current" />
      <span className="relative">SPIN!</span>
    </button>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function DailySpinModal({ onClose }: DailySpinModalProps) {
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

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "spinning") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, phase]);

  // When result is shown, delegate to SpinResultModal
  if (phase === "result" && lastResult) {
    return (
      <SpinResultModal
        result={lastResult}
        onDismiss={() => {
          dismissResult();
          onClose();
        }}
      />
    );
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={phase !== "spinning" ? onClose : undefined}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.15),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.1),transparent_55%)] pointer-events-none" />

        {/* Close button */}
        {phase !== "spinning" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎡</span>
              <h2 className="text-xl font-black text-white">Daily Spin</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                Once a day
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Spin the wheel to win exclusive rewards — prizes reset every 24h
            </p>
          </div>

          {/* Content: wheel + prizes */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Wheel */}
            <div className="flex flex-col items-center gap-5 flex-shrink-0">
              <div className="relative">
                {/* Pointer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-amber-400 drop-shadow-lg" />
                {/* Glow ring */}
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isSpinning
                      ? "shadow-[0_0_50px_rgba(245,158,11,0.6)]"
                      : canSpin
                        ? "shadow-[0_0_25px_rgba(245,158,11,0.25)]"
                        : ""
                  }`}
                >
                  <SpinWheelCanvas
                    prizes={prizes}
                    rotation={rotation}
                    isSpinning={isSpinning}
                    size={260}
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

            {/* Prize list */}
            <div className="flex-1 w-full">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                Possible Rewards
              </p>
              <div className="space-y-0.5">
                {SPIN_PRIZES.map((prize) => (
                  <PrizeRow key={prize.id} prize={prize} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
