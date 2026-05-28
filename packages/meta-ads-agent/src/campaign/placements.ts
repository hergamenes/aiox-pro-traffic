import type { Platform } from '../types/campaign.js';
import { ValidationError } from '../errors/types.js';

export const VALID_PLATFORMS: Platform[] = ['instagram', 'facebook', 'all'];

/** Valida e normaliza um valor da flag `--plataforma`. */
export function parsePlatform(value: string | undefined): Platform | undefined {
  if (!value) return undefined;
  if (!VALID_PLATFORMS.includes(value as Platform)) {
    throw new ValidationError(`Plataforma inválida: "${value}". Use: ${VALID_PLATFORMS.join(', ')}.`);
  }
  return value as Platform;
}

/**
 * Injeta `publisher_platforms` no objeto de targeting do ad set conforme a
 * plataforma escolhida.
 *
 * - `instagram`: veicula apenas no Instagram
 * - `facebook`: veicula apenas no Facebook
 * - `all` (ou indefinido): não restringe — a Meta decide os placements
 *   automaticamente (Advantage+ Placements)
 *
 * Quando uma plataforma específica é definida, as posições (feed, stories,
 * reels, etc.) ficam no automático da Meta dentro daquela plataforma.
 *
 * O targeting é mutado no lugar (mesmo objeto retornado pela strategy).
 */
export function applyPlacements(
  targeting: Record<string, unknown>,
  platform?: Platform,
): void {
  if (platform === 'instagram') {
    targeting['publisher_platforms'] = ['instagram'];
  } else if (platform === 'facebook') {
    targeting['publisher_platforms'] = ['facebook'];
  }
  // 'all' / undefined → mantém placements automáticos (não toca no targeting)
}
