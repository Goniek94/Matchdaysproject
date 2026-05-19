/**
 * Manufacturer-specific tag code formats.
 *
 * Used in two flows:
 *   1. AI extraction prompt — Gemini gets the per-brand reference so it
 *      knows what kind of code to look for on the washtag.
 *   2. Form validation — when AI can't read a code and the seller types
 *      it manually, we check the format matches the declared brand.
 *      Wrong format → blocked OR flagged for moderator (depending on
 *      strictness setting).
 *
 * Adding a new brand: append to BRAND_CODE_FORMATS with its regex and an
 * example. Keep the regex anchored (^...$) so partial matches don't pass.
 *
 * Era awareness: pre-2005 vintage items often don't have machine-readable
 * codes at all (Umbro, Le Coq Sportif pre-2000). Those entries set
 * `eraStart` so the validator can fall back to "no code expected" mode
 * when Auction.season predates the code era for that brand.
 */
export interface BrandCodeFormat {
  brand: string;
  /** Regex to validate user-typed codes. Always anchored. */
  regex: RegExp;
  /** Realistic example shown in placeholder text. */
  example: string;
  /** Where on the garment/item this code typically appears. */
  tagLocation: string;
  /** Year the format started being used. null = unknown / always. */
  eraStart: number | null;
  /** Year the format stopped (if format changed). null = still in use. */
  eraEnd: number | null;
  /** Human-readable description for AI prompt + UI hints. */
  description: string;
}

export const BRAND_CODE_FORMATS: Record<string, BrandCodeFormat[]> = {
  adidas: [
    {
      brand: "adidas",
      regex: /^[A-Z]{2}\d{4,5}$/,
      example: "IN9844",
      tagLocation: "Inner left side seam + neck label",
      eraStart: 2005,
      eraEnd: null,
      description:
        "Adidas modern code: 2 letters + 4–5 digits. Last 2 digits often encode production year.",
    },
  ],
  nike: [
    {
      brand: "nike",
      regex: /^[A-Z]{2}\d{4}-\d{3}$/,
      example: "DV1234-567",
      tagLocation: "Inner collar, left side",
      eraStart: 2010,
      eraEnd: null,
      description:
        "Nike style code: 2 letters + 4 digits + hyphen + 3 digits (colorway). SKU before hyphen.",
    },
  ],
  puma: [
    {
      brand: "puma",
      regex: /^(76|77|65)\d{4}$/,
      example: "761234",
      tagLocation: "Inner left seam",
      eraStart: 2008,
      eraEnd: null,
      description:
        "Puma code: 6 digits starting with 76, 77, or 65 depending on product line.",
    },
  ],
  umbro: [
    {
      brand: "umbro",
      // Pre-2005 vintage Umbro often has no code at all — only country of origin.
      regex: /^[A-Z]\d{4}$/,
      example: "X1234",
      tagLocation: "Inner collar back",
      eraStart: 2005,
      eraEnd: null,
      description:
        "Modern Umbro: 1 letter + 4 digits. Pre-2005 vintage items typically have NO code, only 'Made in' tag.",
    },
  ],
  reebok: [
    {
      brand: "reebok",
      regex: /^[A-Z]\d{5}$/,
      example: "V12345",
      tagLocation: "Inner left seam",
      eraStart: 2010,
      eraEnd: null,
      description: "Reebok modern: 1 letter + 5 digits.",
    },
  ],
  kappa: [
    {
      brand: "kappa",
      regex: /^\d{6}$/,
      example: "302K3M0",
      tagLocation: "Inner left seam",
      eraStart: 2010,
      eraEnd: null,
      description: "Kappa: 6 alphanumeric. Older items may use different formats.",
    },
  ],
  // Brands historically without machine-readable codes (pre-2005 vintage)
  le_coq_sportif: [],
  hummel: [],
};

/**
 * Validate a user-supplied code against the brand's expected format.
 *
 * Returns:
 *   { valid: true, format }   — code matches one of the known formats
 *   { valid: false, reason }  — known brand but code doesn't match any format
 *   { valid: null, reason }   — brand unknown or pre-code-era; can't validate
 *
 * The `null` case lets the moderator decide manually rather than blocking
 * a legitimate vintage item that simply doesn't have a code at all.
 */
export function validateBrandCode(
  brand: string,
  code: string,
  season?: string | null,
): {
  valid: boolean | null;
  format?: BrandCodeFormat;
  reason?: string;
} {
  const normalised = brand.toLowerCase().replace(/\s+/g, "_");
  const formats = BRAND_CODE_FORMATS[normalised];

  if (!formats) {
    return {
      valid: null,
      reason: `Brand "${brand}" not in code format library — moderator review`,
    };
  }

  if (formats.length === 0) {
    return {
      valid: null,
      reason: `${brand} historically has no machine-readable codes — moderator review`,
    };
  }

  // Era check — pre-eraStart items may legitimately have no code.
  const year = parseSeasonStartYear(season);
  if (year !== null) {
    const tooOld = formats.every(
      (f) => f.eraStart !== null && year < f.eraStart,
    );
    if (tooOld) {
      return {
        valid: null,
        reason: `Item from ${year} predates ${brand} code era — moderator review`,
      };
    }
  }

  for (const format of formats) {
    if (format.regex.test(code)) {
      return { valid: true, format };
    }
  }

  // Code typed but matches no known format for this brand
  return {
    valid: false,
    reason: `Code "${code}" doesn't match expected ${brand} format (e.g. ${formats[0].example})`,
  };
}

/**
 * Pulls a year out of season strings like "2023/24", "1998-99", "2010".
 * Returns the START year (so "2023/24" → 2023). null when unparsable —
 * callers treat null as "era unknown, skip era check".
 */
function parseSeasonStartYear(season: string | null | undefined): number | null {
  if (!season) return null;
  const match = season.match(/(\d{4})/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  if (year < 1900 || year > 2100) return null;
  return year;
}

/**
 * For UI: get the placeholder example for a brand's manual input field.
 * Falls back to a generic placeholder when the brand isn't in the library.
 */
export function getBrandCodePlaceholder(brand: string | null | undefined): string {
  if (!brand) return "e.g. AB12345";
  const normalised = brand.toLowerCase().replace(/\s+/g, "_");
  const formats = BRAND_CODE_FORMATS[normalised];
  if (!formats || formats.length === 0) return "Enter code as printed on tag";
  return `e.g. ${formats[0].example}`;
}
