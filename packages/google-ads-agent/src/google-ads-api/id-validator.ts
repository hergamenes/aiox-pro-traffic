/**
 * Pure helpers for validating numeric IDs before they are interpolated
 * into GAQL queries or used in resource_name strings.
 *
 * GAQL has no parameterized queries, so IDs are interpolated as literals.
 * Validating that an ID is purely numeric BEFORE building the query is the
 * primary defense against GAQL injection via crafted `--campaign-id`,
 * `--criterion-id`, `--ad-group-id` arguments.
 *
 * No SDK dependencies — safe to import anywhere.
 */

import { AppError } from '../errors/types.js';
import { isValidCustomerId, normalizeCustomerId } from '../config/config-repository.js';

/** Matches one or more digits, nothing else. */
const NUMERIC_ID = /^\d+$/;

/**
 * Returns true when `raw` is a non-empty string of digits only.
 * Whitespace is trimmed before checking.
 */
export function isNumericId(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  return NUMERIC_ID.test(raw.trim());
}

/**
 * Validates a generic numeric entity ID (campaign, criterion, ad group).
 * Throws an AppError (VALIDATION) with a clear pt-BR message if invalid.
 *
 * `label` names the field in the error message (ex: "Campaign ID").
 * Returns the trimmed, validated ID.
 */
export function assertNumericId(raw: string, label: string): string {
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  if (!isNumericId(trimmed)) {
    throw new AppError(
      'VALIDATION',
      `${label} inválido: '${raw}'. Deve conter apenas dígitos (0-9).`,
      'Exemplo válido: 1234567890. Copie o ID exatamente como aparece no Google Ads.',
    );
  }
  return trimmed;
}

/**
 * Escapes a free-text string for safe interpolation inside a single-quoted
 * GAQL string literal. GAQL has no parameterized queries.
 *
 * Order matters: escape the backslash FIRST, then the single quote — otherwise
 * the backslash added for the quote would itself get doubled.
 *
 *   escapeGaqlString("O'Brien")   → "O\\'Brien"
 *   escapeGaqlString("a\\b")      → "a\\\\b"
 */
export function escapeGaqlString(raw: string): string {
  return raw.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Validates a customer ID (exactly 10 digits, dashes/whitespace tolerated).
 * Reuses `isValidCustomerId` from config-repository. Throws AppError on failure.
 *
 * Returns the normalized (dash-stripped) customer ID.
 */
export function assertCustomerId(raw: string): string {
  if (typeof raw !== 'string' || !isValidCustomerId(raw)) {
    throw new AppError(
      'VALIDATION',
      `Customer ID inválido: '${raw}'. Deve ter exatamente 10 dígitos.`,
      "Exemplo válido: 1234567890 (com ou sem traços '123-456-7890').",
    );
  }
  return normalizeCustomerId(raw);
}
