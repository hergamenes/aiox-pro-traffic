/**
 * Pure helpers for budget validation and currency conversion.
 *
 * No SDK dependencies — this file is safe to import anywhere.
 * Google Ads API uses micros internally: 1 currency unit = 1_000_000 micros.
 */

const MICROS_PER_UNIT = 1_000_000;

/**
 * Parses a user-provided currency string into micros.
 *
 * Accepts inputs like:
 *   "30"         → 30_000_000
 *   "30.50"      → 30_500_000
 *   "30,50"      → 30_500_000  (Brazilian decimal comma)
 *   "R$ 30,00"   → 30_000_000
 *   "$30.00"     → 30_000_000
 *   "  30.5  "   → 30_500_000  (whitespace tolerated)
 *
 * Throws if the input cannot be parsed or is negative.
 */
export function parseMicros(input: string): number {
  if (typeof input !== 'string') {
    throw new Error(`parseMicros expects a string, got ${typeof input}`);
  }

  // Strip currency symbols, whitespace
  const cleaned = input.replace(/[R$€£¥\s]/g, '');
  if (cleaned === '') {
    throw new Error('Budget value cannot be empty');
  }

  // Detect decimal separator: prefer last , or . if both present
  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');
  let normalized = cleaned;
  if (lastComma > lastDot) {
    // "1.234,56" or "30,50" → comma is decimal separator
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > -1) {
    // "1,234.56" → remove thousands commas
    normalized = cleaned.replace(/,/g, '');
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    throw new Error(`Could not parse budget value: '${input}'`);
  }
  if (value < 0) {
    throw new Error(`Budget cannot be negative: '${input}'`);
  }

  return Math.round(value * MICROS_PER_UNIT);
}

/**
 * Formats micros as a currency string for user display.
 *
 *   formatMicros(30_000_000, 'BRL')  → 'R$ 30,00'
 *   formatMicros(30_500_000, 'USD')  → '$ 30.50'
 *   formatMicros(0, 'BRL')           → 'R$ 0,00'
 */
export function formatMicros(micros: number, currency: string): string {
  const symbol = currencySymbol(currency);
  const value = micros / MICROS_PER_UNIT;
  // Use locale matching the currency for separator conventions
  const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';
  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol} ${formatted}`;
}

function currencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case 'BRL':
      return 'R$';
    case 'USD':
    case 'AUD':
    case 'CAD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return currency.toUpperCase();
  }
}

export interface BudgetDelta {
  /** Percentage change. +50 means +50%, -25 means -25%. */
  pct: number;
  /** True when the absolute increase exceeds `thresholdPct`. */
  exceedsThreshold(thresholdPct: number): boolean;
  /** True when the change is a reduction beyond 90% (often a mistake signal). */
  isMassiveReduction(): boolean;
}

/**
 * Calculates the percentage delta between an old and a new micros value.
 * Polymorphic — used for budget updates (6.1), keyword bid updates (6.4),
 * and any future numeric mutation with anti-runaway threshold.
 *
 * If `oldMicros` is 0, any positive new value is treated as +∞%
 * (always exceeds threshold). Returns 0 if both are 0.
 */
export function calculatePercentDelta(oldMicros: number, newMicros: number): BudgetDelta {
  let pct: number;
  if (oldMicros === 0) {
    pct = newMicros === 0 ? 0 : Number.POSITIVE_INFINITY;
  } else {
    pct = ((newMicros - oldMicros) / oldMicros) * 100;
  }

  return {
    pct,
    exceedsThreshold(thresholdPct: number): boolean {
      return pct > thresholdPct;
    },
    isMassiveReduction(): boolean {
      return pct <= -90;
    },
  };
}

/** @deprecated Alias preserved for Story 6.1 compatibility. Use calculatePercentDelta. */
export const calculateBudgetDelta = calculatePercentDelta;
