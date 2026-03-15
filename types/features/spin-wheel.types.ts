/**
 * Spin Wheel (SuperSpin) feature types
 */

// ─── Prize types ──────────────────────────────────────────────────────────────

export type PrizeCategory =
  | "premium"
  | "discount"
  | "loyalty"
  | "subscription"
  | "try_again";

export interface SpinPrize {
  id: string;
  label: string;
  description: string;
  category: PrizeCategory;
  /** Tailwind gradient classes for the wheel segment */
  color: string;
  /** Emoji icon displayed on the wheel */
  emoji: string;
  /** Probability weight (higher = more likely) */
  weight: number;
  /** Value of the prize (e.g. discount percentage, points amount) */
  value?: number;
}

// ─── Spin result ──────────────────────────────────────────────────────────────

export interface SpinResult {
  prize: SpinPrize;
  /** Final rotation angle in degrees */
  finalAngle: number;
  /** ISO timestamp of when the spin occurred */
  timestamp: string;
}

// ─── Spin state ───────────────────────────────────────────────────────────────

export type SpinPhase = "idle" | "spinning" | "result";

export interface SpinWheelState {
  phase: SpinPhase;
  lastSpinAt: string | null;
  lastResult: SpinResult | null;
  /** Remaining milliseconds until next spin is available */
  cooldownMs: number;
}
