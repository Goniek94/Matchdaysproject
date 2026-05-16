import apiClient from "./client";

/**
 * Real footballer directory used by the Missing XI autocomplete.
 *
 * Backed by `MatchesService.getFootballerDirectory` which aggregates
 * top scorers across PL / La Liga / Serie A / Bundesliga / Ligue 1 /
 * Champions League from football-data.org. Cached 24h on the server,
 * so this endpoint is cheap to hit on every page mount.
 */
export interface FootballerEntry {
  /** Uppercased last name — what we match against `Player.name` in game data. */
  surname: string;
  /** "Cristiano Ronaldo", "Erling Haaland", … */
  fullName: string;
  /** First name(s) when the API provides them — else null. */
  firstName: string | null;
  /** Current club, used to disambiguate "Cristiano RONALDO" vs "RONALDO". */
  club: string | null;
  /** ISO-3166 alpha-3, e.g. "POR". */
  nationality: string | null;
}

export async function getFootballerDirectory(): Promise<FootballerEntry[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: FootballerEntry[];
  }>("/games/footballers/directory");
  return res.data.data;
}
