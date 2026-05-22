/**
 * Pure validators for Responsive Search Ads (RSA) and Responsive Display
 * Ads (RDA) — Story 6.5.
 *
 * Client-side validation BEFORE API call to give operators friendly
 * errors with all violations listed at once (vs Google rejecting on
 * the first one).
 */

export interface AdValidationResult {
  valid: boolean;
  errors: string[];
}

export interface RsaInputs {
  headlines: string[];
  descriptions: string[];
  path1?: string;
  path2?: string;
  finalUrl: string;
  pinnedHeadline1?: string;
}

export interface RdaInputs {
  headlines: string[];
  longHeadline: string;
  descriptions: string[];
  businessName: string;
  finalUrl: string;
  logoAssetId: string;
  marketingImageAssetIds: string[];
  squareMarketingImageAssetIds?: string[];
}

/** Char limits per Google Ads API for RSA / RDA fields. */
export const AD_LIMITS = {
  RSA: {
    HEADLINE_MAX: 30,
    HEADLINE_COUNT_MIN: 3,
    HEADLINE_COUNT_MAX: 15,
    DESCRIPTION_MAX: 90,
    DESCRIPTION_COUNT_MIN: 2,
    DESCRIPTION_COUNT_MAX: 4,
    PATH_MAX: 15,
  },
  RDA: {
    HEADLINE_MAX: 30,
    HEADLINE_COUNT_MIN: 1,
    HEADLINE_COUNT_MAX: 5,
    LONG_HEADLINE_MAX: 90,
    DESCRIPTION_MAX: 90,
    DESCRIPTION_COUNT_MIN: 1,
    DESCRIPTION_COUNT_MAX: 5,
    BUSINESS_NAME_MAX: 25,
  },
} as const;

function pushIfTooLong(
  errors: string[],
  field: string,
  text: string,
  max: number,
  index?: number,
): void {
  if (text.length > max) {
    const where = index !== undefined ? `${field} ${index + 1}` : field;
    errors.push(`${where}: ${text.length}/${max} chars (excede ${max}).`);
  }
}

function requireHttps(errors: string[], url: string): void {
  if (!url.startsWith('https://')) {
    errors.push(`final_url deve usar HTTPS (recebido: ${url})`);
  }
}

/**
 * Validates RSA inputs against Google Ads limits. Returns all violations
 * in a single result (vs API which rejects on first error).
 */
export function validateRsaInputs(input: RsaInputs): AdValidationResult {
  const errors: string[] = [];
  const L = AD_LIMITS.RSA;

  // Headlines count
  if (input.headlines.length < L.HEADLINE_COUNT_MIN) {
    errors.push(`Headlines: ${input.headlines.length} fornecidas (mínimo ${L.HEADLINE_COUNT_MIN}).`);
  }
  if (input.headlines.length > L.HEADLINE_COUNT_MAX) {
    errors.push(`Headlines: ${input.headlines.length} fornecidas (máximo ${L.HEADLINE_COUNT_MAX}).`);
  }

  // Headlines length
  input.headlines.forEach((h, i) => {
    pushIfTooLong(errors, 'Headline', h, L.HEADLINE_MAX, i);
    if (h.trim() === '') errors.push(`Headline ${i + 1} está vazia.`);
  });

  // Descriptions count
  if (input.descriptions.length < L.DESCRIPTION_COUNT_MIN) {
    errors.push(`Descriptions: ${input.descriptions.length} (mínimo ${L.DESCRIPTION_COUNT_MIN}).`);
  }
  if (input.descriptions.length > L.DESCRIPTION_COUNT_MAX) {
    errors.push(`Descriptions: ${input.descriptions.length} (máximo ${L.DESCRIPTION_COUNT_MAX}).`);
  }

  // Descriptions length
  input.descriptions.forEach((d, i) => {
    pushIfTooLong(errors, 'Description', d, L.DESCRIPTION_MAX, i);
    if (d.trim() === '') errors.push(`Description ${i + 1} está vazia.`);
  });

  // Paths
  if (input.path1 !== undefined) pushIfTooLong(errors, 'path1', input.path1, L.PATH_MAX);
  if (input.path2 !== undefined) pushIfTooLong(errors, 'path2', input.path2, L.PATH_MAX);

  // path2 sem path1 não faz sentido
  if (input.path2 && !input.path1) {
    errors.push('path2 não pode ser usado sem path1.');
  }

  requireHttps(errors, input.finalUrl);

  // Pinned headline must exist in headlines list
  if (input.pinnedHeadline1 !== undefined) {
    if (!input.headlines.includes(input.pinnedHeadline1)) {
      errors.push(
        `pinned-headline-1 "${input.pinnedHeadline1}" não está na lista de --headlines.`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates RDA inputs against Google Ads limits.
 */
export function validateRdaInputs(input: RdaInputs): AdValidationResult {
  const errors: string[] = [];
  const L = AD_LIMITS.RDA;

  // Headlines count
  if (input.headlines.length < L.HEADLINE_COUNT_MIN) {
    errors.push(`Headlines: ${input.headlines.length} (mínimo ${L.HEADLINE_COUNT_MIN}).`);
  }
  if (input.headlines.length > L.HEADLINE_COUNT_MAX) {
    errors.push(`Headlines: ${input.headlines.length} (máximo ${L.HEADLINE_COUNT_MAX}).`);
  }
  input.headlines.forEach((h, i) => {
    pushIfTooLong(errors, 'Headline', h, L.HEADLINE_MAX, i);
    if (h.trim() === '') errors.push(`Headline ${i + 1} está vazia.`);
  });

  // Long headline
  pushIfTooLong(errors, 'long-headline', input.longHeadline, L.LONG_HEADLINE_MAX);
  if (input.longHeadline.trim() === '') errors.push('long-headline está vazio.');

  // Descriptions
  if (input.descriptions.length < L.DESCRIPTION_COUNT_MIN) {
    errors.push(`Descriptions: ${input.descriptions.length} (mínimo ${L.DESCRIPTION_COUNT_MIN}).`);
  }
  if (input.descriptions.length > L.DESCRIPTION_COUNT_MAX) {
    errors.push(`Descriptions: ${input.descriptions.length} (máximo ${L.DESCRIPTION_COUNT_MAX}).`);
  }
  input.descriptions.forEach((d, i) => {
    pushIfTooLong(errors, 'Description', d, L.DESCRIPTION_MAX, i);
    if (d.trim() === '') errors.push(`Description ${i + 1} está vazia.`);
  });

  // Business name
  pushIfTooLong(errors, 'business-name', input.businessName, L.BUSINESS_NAME_MAX);
  if (input.businessName.trim() === '') errors.push('business-name está vazio.');

  // Logo asset is required
  if (!input.logoAssetId || input.logoAssetId.trim() === '') {
    errors.push('logo-asset-id é obrigatório para RDA.');
  }

  // Marketing image assets — at least 1
  if (input.marketingImageAssetIds.length < 1) {
    errors.push('Pelo menos 1 --marketing-image-asset-id é obrigatório.');
  }

  requireHttps(errors, input.finalUrl);

  return { valid: errors.length === 0, errors };
}
