import apiClient from "./client";

/**
 * Today's Tiki-Taka-Toe puzzle — rotates daily, real crests included.
 *
 * Backed by `SkillGamesService.getTikiTakaToday` which picks deterministically
 * from a curated puzzle bank by UTC day-of-year and hydrates each club with
 * its real crest URL from football-data.org.
 */
export interface TikiTakaClub {
  id: number;
  name: string;
  short: string;
  /** "red" | "blue" | … — frontend maps to Tailwind ring/bg classes. */
  ringColor: string;
  /** Crest SVG/PNG URL — null if football-data.org didn't respond. */
  crest: string | null;
}

export interface TikiTakaPuzzle {
  id: string;
  cols: [TikiTakaClub, TikiTakaClub, TikiTakaClub];
  rows: [TikiTakaClub, TikiTakaClub, TikiTakaClub];
  /** Keyed "row-col" (e.g. "1-2"), values lowercased player names. */
  answers: Record<string, string[]>;
  hints: Record<string, string>;
}

export async function getTodaysTikiTaka(): Promise<TikiTakaPuzzle> {
  const res = await apiClient.get<{
    success: boolean;
    data: TikiTakaPuzzle;
  }>("/games/tiki-taka/today");
  return res.data.data;
}
