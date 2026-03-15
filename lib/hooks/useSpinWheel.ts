"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  SpinPrize,
  SpinResult,
  SpinPhase,
  SpinWheelState,
} from "@/types/features/spin-wheel.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "matchdays_superspin";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const SPIN_DURATION_MS = 4500; // animation duration

// ─── Prize definitions ────────────────────────────────────────────────────────

export const SPIN_PRIZES: SpinPrize[] = [
  {
    id: "premium_elite",
    label: "Premium Elite",
    description: "1 month of Premium Elite subscription — free!",
    category: "premium",
    color: "#F59E0B",
    emoji: "👑",
    weight: 2,
    value: 1,
  },
  {
    id: "discount_20",
    label: "20% Off",
    description: "20% discount on your next subscription renewal",
    category: "discount",
    color: "#8B5CF6",
    emoji: "🎟️",
    weight: 8,
    value: 20,
  },
  {
    id: "loyalty_500",
    label: "500 Points",
    description: "500 loyalty points added to your account",
    category: "loyalty",
    color: "#3B82F6",
    emoji: "⭐",
    weight: 15,
    value: 500,
  },
  {
    id: "discount_10",
    label: "10% Off",
    description: "10% discount on any premium feature",
    category: "discount",
    color: "#EC4899",
    emoji: "💸",
    weight: 12,
    value: 10,
  },
  {
    id: "loyalty_200",
    label: "200 Points",
    description: "200 loyalty points added to your account",
    category: "loyalty",
    color: "#10B981",
    emoji: "🌟",
    weight: 20,
    value: 200,
  },
  {
    id: "subscription_week",
    label: "Free Week",
    description: "7 days of Premium subscription — on us!",
    category: "subscription",
    color: "#F97316",
    emoji: "🎁",
    weight: 5,
    value: 7,
  },
  {
    id: "loyalty_100",
    label: "100 Points",
    description: "100 loyalty points added to your account",
    category: "loyalty",
    color: "#06B6D4",
    emoji: "💎",
    weight: 25,
    value: 100,
  },
  {
    id: "try_again",
    label: "Try Again",
    description: "Better luck next time! Come back tomorrow.",
    category: "try_again",
    color: "#6B7280",
    emoji: "🔄",
    weight: 13,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Weighted random prize selection */
function pickPrize(prizes: SpinPrize[]): SpinPrize {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  for (const prize of prizes) {
    random -= prize.weight;
    if (random <= 0) return prize;
  }
  return prizes[prizes.length - 1];
}

/** Calculate the final rotation angle so the wheel stops on the chosen prize */
function calcFinalAngle(prizeIndex: number, totalPrizes: number): number {
  const segmentDeg = 360 / totalPrizes;
  // Center of the target segment (pointer is at top = 0°)
  const segmentCenter = prizeIndex * segmentDeg + segmentDeg / 2;
  // Add multiple full rotations for a dramatic spin effect
  const extraSpins = 5 * 360;
  return extraSpins + (360 - segmentCenter);
}

interface StoredData {
  lastSpinAt: string;
  lastResult: SpinResult;
}

function loadFromStorage(): StoredData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredData) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: StoredData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore storage errors
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseSpinWheelReturn extends SpinWheelState {
  prizes: SpinPrize[];
  /** Current rotation angle of the wheel (CSS degrees) */
  rotation: number;
  spin: () => void;
  dismissResult: () => void;
  /** Formatted countdown string e.g. "18:42:05" */
  countdown: string;
}

export function useSpinWheel(): UseSpinWheelReturn {
  const stored = loadFromStorage();

  const [phase, setPhase] = useState<SpinPhase>("idle");
  const [rotation, setRotation] = useState(0);
  const [lastSpinAt, setLastSpinAt] = useState<string | null>(
    stored?.lastSpinAt ?? null,
  );
  const [lastResult, setLastResult] = useState<SpinResult | null>(
    stored?.lastResult ?? null,
  );
  const [cooldownMs, setCooldownMs] = useState<number>(0);
  const [countdown, setCountdown] = useState("00:00:00");

  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Cooldown ticker ──
  useEffect(() => {
    const tick = () => {
      if (!lastSpinAt) {
        setCooldownMs(0);
        setCountdown("00:00:00");
        return;
      }
      const elapsed = Date.now() - new Date(lastSpinAt).getTime();
      const remaining = Math.max(0, COOLDOWN_MS - elapsed);
      setCooldownMs(remaining);

      if (remaining > 0) {
        const h = Math.floor(remaining / 3_600_000);
        const m = Math.floor((remaining % 3_600_000) / 60_000);
        const s = Math.floor((remaining % 60_000) / 1_000);
        setCountdown(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
        );
      } else {
        setCountdown("00:00:00");
      }
    };

    tick();
    const interval = setInterval(tick, 1_000);
    return () => clearInterval(interval);
  }, [lastSpinAt]);

  // ── Spin action ──
  const spin = useCallback(() => {
    if (phase !== "idle" || cooldownMs > 0) return;

    const prize = pickPrize(SPIN_PRIZES);
    const prizeIndex = SPIN_PRIZES.findIndex((p) => p.id === prize.id);
    const finalAngle = calcFinalAngle(prizeIndex, SPIN_PRIZES.length);

    setPhase("spinning");
    setRotation((prev) => prev + finalAngle);

    spinTimeoutRef.current = setTimeout(() => {
      const now = new Date().toISOString();
      const result: SpinResult = {
        prize,
        finalAngle,
        timestamp: now,
      };

      setLastSpinAt(now);
      setLastResult(result);
      setPhase("result");
      saveToStorage({ lastSpinAt: now, lastResult: result });
    }, SPIN_DURATION_MS);
  }, [phase, cooldownMs]);

  // ── Dismiss result modal ──
  const dismissResult = useCallback(() => {
    setPhase("idle");
  }, []);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  return {
    prizes: SPIN_PRIZES,
    phase,
    rotation,
    lastSpinAt,
    lastResult,
    cooldownMs,
    countdown,
    spin,
    dismissResult,
  };
}
