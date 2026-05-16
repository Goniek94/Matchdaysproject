import apiClient from "./client";

/**
 * Rankings — read-only leaderboard data.
 *
 * Single source of truth: backend `RankingsService.getOverall` walks
 * `User.totalPoints`, which is the SUM of every point ever credited
 * (quiz + predictor + spin + tiki-taka + missing-xi + bingo + non-game
 * loyalty triggers). So this one board IS the cross-game ranking the
 * arena page wants — no separate "combined" endpoint needed.
 */
export interface OverallRankingRow {
  rank: number;
  id: string;
  username: string;
  avatar: string | null;
  totalPoints: number;
  level: number;
  country: string | null;
  subscriptionTier: string;
}

export async function getOverallRanking(
  limit = 5,
): Promise<OverallRankingRow[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: OverallRankingRow[];
  }>("/rankings/overall", { params: { limit } });
  return res.data.data;
}
