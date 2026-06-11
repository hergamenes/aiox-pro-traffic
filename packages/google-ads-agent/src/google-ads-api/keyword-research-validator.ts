/**
 * Resolvers de geo/idioma e validação de seeds para `keyword-research`.
 *
 * Funções puras — sem I/O, sem SDK. Fáceis de testar.
 *
 * Referência dos IDs:
 * - Geo target constants: https://developers.google.com/google-ads/api/data/geotargets
 * - Language codes: https://developers.google.com/google-ads/api/data/codes-formats#languages
 */

/** Limite da API GenerateKeywordIdeas para keyword seeds por chamada. */
export const MAX_SEEDS = 20;

/** Mapa dos geos mais usados pelo operador (código ISO → ID numérico). */
const GEO_MAP: Record<string, string> = {
  BR: '2076', // Brasil
  US: '2840', // Estados Unidos
  PT: '2620', // Portugal
  ES: '2724', // Espanha
  AR: '2032', // Argentina
  MX: '2484', // México
};

/** Mapa dos idiomas mais usados (código → ID numérico). */
const LANG_MAP: Record<string, string> = {
  pt: '1014', // Português
  en: '1000', // Inglês
  es: '1003', // Espanhol
};

/**
 * Resolve um código de geo (ex.: 'BR') para o resource name
 * 'geoTargetConstants/2076'. Aceita também o ID numérico cru como fallback.
 * Retorna null se não reconhecer.
 */
export function resolveGeoConstant(code: string): string | null {
  const trimmed = code.trim();
  if (/^\d+$/.test(trimmed)) {
    return `geoTargetConstants/${trimmed}`;
  }
  const id = GEO_MAP[trimmed.toUpperCase()];
  return id ? `geoTargetConstants/${id}` : null;
}

/**
 * Resolve um código de idioma (ex.: 'pt') para 'languageConstants/1014'.
 * Aceita ID numérico cru como fallback. Retorna null se não reconhecer.
 */
export function resolveLanguageConstant(code: string): string | null {
  const trimmed = code.trim();
  if (/^\d+$/.test(trimmed)) {
    return `languageConstants/${trimmed}`;
  }
  const id = LANG_MAP[trimmed.toLowerCase()];
  return id ? `languageConstants/${id}` : null;
}

/** Códigos de geo suportados (para mensagens de erro). */
export function supportedGeoCodes(): string[] {
  return Object.keys(GEO_MAP);
}

/** Códigos de idioma suportados (para mensagens de erro). */
export function supportedLangCodes(): string[] {
  return Object.keys(LANG_MAP);
}

export interface SeedsValidation {
  valid: boolean;
  /** Seeds normalizadas (trim + remoção de vazias e duplicadas). */
  seeds: string[];
  error?: string;
}

/**
 * Normaliza e valida a lista de seeds: faz trim, remove vazias e duplicadas,
 * exige pelo menos 1 e no máximo MAX_SEEDS.
 */
export function validateSeeds(raw: string[]): SeedsValidation {
  const seen = new Set<string>();
  const seeds: string[] = [];
  for (const s of raw) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    seeds.push(trimmed);
  }

  if (seeds.length === 0) {
    return {
      valid: false,
      seeds,
      error: 'Informe pelo menos 1 palavra-semente (--seeds "termo1, termo2" ou --seeds-file).',
    };
  }
  if (seeds.length > MAX_SEEDS) {
    return {
      valid: false,
      seeds,
      error: `Máximo de ${MAX_SEEDS} palavras-semente por consulta (você passou ${seeds.length}).`,
    };
  }
  return { valid: true, seeds };
}
