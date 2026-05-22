/**
 * Pure helpers for keyword validation and automated-bidding detection
 * (Story 6.4).
 */

export type KeywordMatchType = 'BROAD' | 'PHRASE' | 'EXACT';

export interface KeywordValidationResult {
  ok: boolean;
  normalized?: string;
  warnings: string[];
  error?: string;
}

/**
 * Validates and normalizes a keyword text per Google Ads constraints.
 *
 *   - Trims leading/trailing whitespace (warns if needed)
 *   - Strips surrounding " for PHRASE, [ ] for EXACT (CLI convenience)
 *   - Rejects empty after trim
 *   - Rejects > 80 chars (Google limit)
 *
 * Returns normalized text the caller should send to the API.
 */
export function validateKeywordText(
  text: string,
  matchType: KeywordMatchType,
): KeywordValidationResult {
  const warnings: string[] = [];

  if (typeof text !== 'string') {
    return { ok: false, warnings, error: 'Keyword inválida (não é string).' };
  }

  let normalized = text;
  if (normalized !== normalized.trim()) {
    warnings.push('Whitespace nas pontas foi removido.');
    normalized = normalized.trim();
  }

  // Strip operator characters for PHRASE/EXACT match
  if (matchType === 'PHRASE') {
    const m = normalized.match(/^"(.+)"$/);
    if (m) {
      normalized = m[1].trim();
      warnings.push('Aspas removidas — match PHRASE não precisa delas no texto.');
    }
  } else if (matchType === 'EXACT') {
    const m = normalized.match(/^\[(.+)\]$/);
    if (m) {
      normalized = m[1].trim();
      warnings.push('Brackets removidos — match EXACT não precisa deles no texto.');
    }
  }

  if (normalized === '') {
    return { ok: false, warnings, error: 'Keyword não pode ser vazia.' };
  }

  if (normalized.length > 80) {
    return {
      ok: false,
      warnings,
      error: `Keyword excede 80 caracteres (atual: ${normalized.length}). Limite do Google.`,
    };
  }

  return { ok: true, normalized, warnings };
}

/**
 * Returns true if the supplied bidding strategy type represents an
 * automated strategy where individual keyword bids are informational
 * only (algorithm overrides).
 *
 * Accepts both numeric enum (Google API number) and string names.
 */
export function isAutomatedBidding(strategy: string | number | undefined | null): boolean {
  if (strategy === undefined || strategy === null) return false;
  const s = String(strategy).toUpperCase();
  // Numeric mapping per BiddingStrategyType enum
  // 3=MANUAL_CPC, 2=ENHANCED_CPC (semi-auto, treated as manual here)
  // Automated ones: MAXIMIZE_CONVERSIONS (10), TARGET_CPA (6), TARGET_ROAS (11),
  // MAXIMIZE_CONVERSION_VALUE (12), TARGET_SPEND (8), TARGET_IMPRESSION_SHARE (15)
  const automated = [
    'MAXIMIZE_CONVERSIONS',
    'TARGET_CPA',
    'TARGET_ROAS',
    'MAXIMIZE_CONVERSION_VALUE',
    'TARGET_SPEND',
    'TARGET_IMPRESSION_SHARE',
    'MAXIMIZE_CLICKS',
    '10',
    '6',
    '11',
    '12',
    '8',
    '15',
  ];
  return automated.includes(s);
}
