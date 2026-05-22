/**
 * Pure helpers for entity status validation (Story 6.2).
 *
 * Google Ads uses numeric enums in some API responses and strings in others.
 * These helpers normalize both to a stable union type.
 */

export type NormalizedStatus = 'ENABLED' | 'PAUSED' | 'REMOVED' | 'UNKNOWN';

/**
 * Normalizes a status value (number, numeric string, or named string) to
 * the canonical union. Returns 'UNKNOWN' for any unrecognized input.
 *
 *   parseStatusEnum(2)         → 'ENABLED'
 *   parseStatusEnum('2')       → 'ENABLED'
 *   parseStatusEnum('ENABLED') → 'ENABLED'
 *   parseStatusEnum(null)      → 'UNKNOWN'
 */
export function parseStatusEnum(value: unknown): NormalizedStatus {
  if (value === null || value === undefined) return 'UNKNOWN';
  const s = String(value).toUpperCase().trim();
  // Google Ads CampaignStatus enum: 2=ENABLED, 3=PAUSED, 4=REMOVED
  if (s === '2' || s === 'ENABLED') return 'ENABLED';
  if (s === '3' || s === 'PAUSED') return 'PAUSED';
  if (s === '4' || s === 'REMOVED') return 'REMOVED';
  return 'UNKNOWN';
}

/**
 * Returns the desired status given the operation verb.
 */
export function getTargetStatus(operation: 'pause' | 'enable'): 'ENABLED' | 'PAUSED' {
  return operation === 'pause' ? 'PAUSED' : 'ENABLED';
}

/**
 * Checks if a campaign is in the bidding-strategy learning phase by
 * comparing the supplied ISO date against `now`. The learning phase
 * for automated bidding strategies is typically 7-14 days; we use 14
 * as the conservative threshold.
 *
 *   isLearningPhase('2026-05-15', new Date('2026-05-22')) → true (7d)
 *   isLearningPhase('2026-05-01', new Date('2026-05-22')) → false (21d)
 */
export function isLearningPhase(referenceIso: string | undefined, now: Date): boolean {
  if (!referenceIso) return false;
  const reference = new Date(referenceIso);
  if (Number.isNaN(reference.getTime())) return false;

  const diffMs = now.getTime() - reference.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays < 14;
}
