import { MISSING_XI_MATCHES } from "./gamesData";
import type { FootballerEntry } from "./api/footballers";

/**
 * Autocomplete dictionary for the Missing XI input.
 *
 * Source of truth (priority order):
 *   1. football-data.org top-scorers directory — fetched on page mount via
 *      `getFootballerDirectory()`. Real names, real clubs, ~500-600 well-known
 *      players. Resolves disambiguation ("Cristiano RONALDO @ Al-Nassr" vs
 *      "Ronaldo NAZARIO" — they don't collide in the dropdown).
 *   2. Static fallback list — used when the API is unavailable (rate-limited,
 *      offline dev, etc) so autocomplete still works.
 *
 * The match logic in page.tsx remains strict on surname — selecting any
 * dropdown entry submits its `surname`, which is uppercased to match
 * `Player.name` in `MISSING_XI_MATCHES`.
 */

export interface DictionaryItem {
  /** Uppercased surname — the canonical match key. */
  surname: string;
  /** Display string for the dropdown ("Cristiano RONALDO (Al-Nassr)"). */
  display: string;
}

// ─── Static fallback ─────────────────────────────────────────────────────────

/** Hardcoded list — minimal, just enough to function offline / before API loads. */
const STATIC_FALLBACK: readonly string[] = [
  "MESSI", "RONALDO", "NEYMAR", "MBAPPE", "BENZEMA", "HALAAND", "HAALAND",
  "BELLINGHAM", "DE BRUYNE", "KANE", "SON", "SALAH", "VAN DIJK", "MODRIC",
  "KROOS", "LEWANDOWSKI", "GRIEZMANN", "POGBA", "KANTE", "GIROUD",
  "ZIDANE", "BECKHAM", "GERRARD", "LAMPARD", "HENRY", "VIEIRA", "BERGKAMP",
  "MALDINI", "PIRLO", "BUFFON", "DEL PIERO", "TOTTI", "KAKA", "SHEVCHENKO",
];

function staticSurnamesAsDictionary(): DictionaryItem[] {
  const items: DictionaryItem[] = [];
  for (const m of MISSING_XI_MATCHES) {
    for (const p of m.positions) {
      const s = p.name.toUpperCase();
      items.push({ surname: s, display: s });
    }
  }
  for (const s of STATIC_FALLBACK) {
    items.push({ surname: s.toUpperCase(), display: s.toUpperCase() });
  }
  return dedupe(items);
}

// ─── Builder from the API directory ──────────────────────────────────────────

/**
 * Merge the API-sourced footballer list with surnames from every Missing XI
 * match (so today's answer is always in the dictionary even if it's a
 * historical player not in the current top-scorer feed).
 *
 * Display format: "Cristiano RONALDO (Al-Nassr FC)" — first name in normal
 * case, surname capitalised, club in parens. Falls back gracefully when
 * `firstName` or `club` is missing.
 */
export function buildDictionary(
  apiList: readonly FootballerEntry[],
): DictionaryItem[] {
  const items: DictionaryItem[] = [];

  // 1. Historical match players first — guarantees today's answer is selectable.
  for (const m of MISSING_XI_MATCHES) {
    for (const p of m.positions) {
      const surname = p.name.toUpperCase();
      items.push({ surname, display: surname });
    }
  }

  // 2. API entries — formatted with first name + club for disambiguation.
  for (const f of apiList) {
    const surname = f.surname.toUpperCase();
    const namePart = f.firstName
      ? `${capitalize(f.firstName)} ${surname}`
      : surname;
    const display = f.club ? `${namePart} (${f.club})` : namePart;
    items.push({ surname, display });
  }

  return dedupe(items);
}

/** Static dictionary used until the API responds (or if it never does). */
export const STATIC_DICTIONARY: readonly DictionaryItem[] =
  staticSurnamesAsDictionary();

// ─── Filtering ───────────────────────────────────────────────────────────────

/**
 * Filter the dictionary for autocomplete. Matches by:
 *   • surname starts-with → highest priority
 *   • display contains    → secondary (catches first-name + club searches)
 *
 * `excludeSurnamesUpper` removes entries the user has already correctly
 * guessed. Limit defaults to 6 — fits the dropdown without crowding.
 */
export function suggestPlayers(
  dict: readonly DictionaryItem[],
  query: string,
  excludeSurnamesUpper: Set<string>,
  limit = 6,
): DictionaryItem[] {
  const q = query.trim().toUpperCase();
  if (q.length < 1) return [];
  const startsWith: DictionaryItem[] = [];
  const contains: DictionaryItem[] = [];
  for (const item of dict) {
    if (excludeSurnamesUpper.has(item.surname)) continue;
    if (item.surname.startsWith(q) || item.display.toUpperCase().startsWith(q)) {
      startsWith.push(item);
    } else if (item.display.toUpperCase().includes(q)) {
      contains.push(item);
    }
    if (startsWith.length + contains.length > limit * 3) break;
  }
  return [...startsWith, ...contains].slice(0, limit);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dedupe(items: DictionaryItem[]): DictionaryItem[] {
  const seen = new Set<string>();
  const out: DictionaryItem[] = [];
  for (const item of items) {
    // Distinct by display string so the same surname can appear twice with
    // different first names (e.g. RONALDO + Cristiano RONALDO).
    if (seen.has(item.display)) continue;
    seen.add(item.display);
    out.push(item);
  }
  // Sort: shorter (often surname-only) first, then alpha.
  return out.sort(
    (a, b) => a.display.length - b.display.length || a.display.localeCompare(b.display),
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
