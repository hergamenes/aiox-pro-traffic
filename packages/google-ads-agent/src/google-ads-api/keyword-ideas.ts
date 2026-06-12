/**
 * Adapter do KeywordPlanIdeaService.GenerateKeywordIdeas.
 *
 * BOUNDARY RULE: este arquivo vive em src/google-ads-api/ e por isso pode
 * importar 'google-ads-api'. Nenhum outro módulo deve tocar o SDK — devem
 * chamar generateKeywordIdeas() daqui.
 *
 * READ-ONLY: GenerateKeywordIdeas é uma consulta. Não muta nada na conta,
 * não cria KeywordPlan persistido, não exige audit log nem confirmação.
 */

import { createClient, getCustomer } from './client.js';
import { ensureValidAuth } from '../auth/token-manager.js';
import { getDefaults } from '../config/config-repository.js';
import { AppError } from '../errors/types.js';
import { logger } from '../cli/logger.js';
import type {
  KeywordIdea,
  KeywordResearchParams,
  CompetitionLevel,
} from '../types/keyword-research.js';

/** Converte micros (1.000.000 = 1 unidade) para a unidade monetária. */
const MICROS_PER_UNIT = 1_000_000;

/**
 * Shape mínimo de cada resultado retornado pela API. Os campos longos podem
 * chegar como number OU string (protobuf int64), e os enums como string OU
 * número — por isso tipamos de forma defensiva e normalizamos no parser.
 */
export interface RawKeywordIdeaResult {
  text?: string | null;
  keyword_idea_metrics?: {
    avg_monthly_searches?: number | string | null;
    competition?: number | string | null;
    competition_index?: number | string | null;
    low_top_of_page_bid_micros?: number | string | null;
    high_top_of_page_bid_micros?: number | string | null;
  } | null;
}

/** Converte um valor possivelmente string/null/undefined em número. */
function toNumber(value: number | string | null | undefined): number | undefined {
  if (value === null || value === undefined) return undefined;
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) ? n : undefined;
}

/** Converte micros em unidade monetária, ou undefined se ausente. */
function microsToUnit(value: number | string | null | undefined): number | undefined {
  const n = toNumber(value);
  return n === undefined ? undefined : n / MICROS_PER_UNIT;
}

/** Normaliza o enum de concorrência (string ou número) para CompetitionLevel. */
function normalizeCompetition(value: number | string | null | undefined): CompetitionLevel {
  // Valores numéricos do enum KeywordPlanCompetitionLevel:
  // 0 UNSPECIFIED, 1 UNKNOWN, 2 LOW, 3 MEDIUM, 4 HIGH
  const byNumber: Record<number, CompetitionLevel> = {
    2: 'LOW',
    3: 'MEDIUM',
    4: 'HIGH',
  };
  if (typeof value === 'number') {
    return byNumber[value] ?? 'UNKNOWN';
  }
  if (typeof value === 'string') {
    const upper = value.toUpperCase();
    if (upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH') return upper;
  }
  return 'UNKNOWN';
}

/**
 * Extrai o array de resultados da resposta do SDK.
 * Função PURA — sem I/O.
 *
 * A lib google-ads-api usa a paginação automática do gax e retorna o array
 * de KeywordIdeaResult DIRETO — não um GenerateKeywordIdeasResponse com
 * campo .results. Aceita os dois formatos por segurança.
 */
export function extractKeywordIdeaResults(response: unknown): RawKeywordIdeaResult[] {
  if (Array.isArray(response)) return response as RawKeywordIdeaResult[];
  const wrapped = (response as { results?: RawKeywordIdeaResult[] } | null | undefined)?.results;
  return wrapped ?? [];
}

/**
 * Mapeia a resposta crua da API para o nosso modelo KeywordIdea[].
 * Função PURA — sem I/O. Ordena por volume decrescente.
 */
export function parseKeywordIdeasResponse(results: RawKeywordIdeaResult[]): KeywordIdea[] {
  const ideas: KeywordIdea[] = results
    .filter((r) => typeof r.text === 'string' && r.text.length > 0)
    .map((r) => {
      const m = r.keyword_idea_metrics ?? {};
      const idea: KeywordIdea = {
        keyword: r.text as string,
        avgMonthlySearches: toNumber(m.avg_monthly_searches) ?? 0,
        competition: normalizeCompetition(m.competition),
      };
      const competitionIndex = toNumber(m.competition_index);
      if (competitionIndex !== undefined) idea.competitionIndex = competitionIndex;
      const low = microsToUnit(m.low_top_of_page_bid_micros);
      if (low !== undefined) idea.lowTopOfPageBid = low;
      const high = microsToUnit(m.high_top_of_page_bid_micros);
      if (high !== undefined) idea.highTopOfPageBid = high;
      return idea;
    });

  ideas.sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches);
  return ideas;
}

/** Estrutura de erro aninhada que o SDK Google Ads retorna. */
interface SdkErrorLike {
  message?: string;
  errors?: Array<{ error_code?: Record<string, string | number>; message?: string }>;
}

/** Extrai uma mensagem legível do erro (top-level OU aninhado em errors[]). */
export function extractErrorText(err: unknown): string {
  const e = err as SdkErrorLike;
  const parts: string[] = [];
  if (typeof e?.message === 'string') parts.push(e.message);
  if (Array.isArray(e?.errors)) {
    for (const item of e.errors) {
      if (typeof item?.message === 'string') parts.push(item.message);
      for (const code of Object.values(item?.error_code ?? {})) {
        parts.push(String(code));
      }
    }
  }
  if (parts.length === 0 && err !== undefined && err !== null) {
    parts.push(String(err));
  }
  return parts.join(' ').toLowerCase();
}

/**
 * Detecta erros de autorização/permissão de Keyword Planner para dar uma
 * mensagem PT-BR acionável em vez de stack trace cru (AC#8 / R2).
 *
 * Cobre o caso real do projeto: developer token com "explorer access"
 * (DEVELOPER_TOKEN_NOT_APPROVED) — GenerateKeywordIdeas exige Basic/Standard.
 */
export function isPermissionError(err: unknown): boolean {
  const text = extractErrorText(err);
  return (
    text.includes('permission') ||
    text.includes('not authorized') ||
    text.includes('unauthorized') ||
    text.includes('developer token') ||
    text.includes('developer_token_not_approved') ||
    text.includes('authorization_error') ||
    text.includes('explorer access') ||
    text.includes('basic or standard') ||
    text.includes('not allowed for use') ||
    text.includes('keyword plan')
  );
}

/**
 * Consulta a API GenerateKeywordIdeas e retorna ideias de palavras-chave
 * com volume, concorrência e faixa de CPC. Resolve auth/config como os
 * demais comandos (ensureValidAuth + getDefaults).
 */
export async function generateKeywordIdeas(
  params: Pick<KeywordResearchParams, 'seeds' | 'geoConstant' | 'languageConstant' | 'network'> & {
    customerId?: string;
    loginCustomerId?: string;
  },
): Promise<KeywordIdea[]> {
  const creds = await ensureValidAuth();
  const defaults = await getDefaults();

  const customerId = params.customerId || defaults.customerId;
  if (!customerId) {
    throw new AppError(
      'VALIDATION',
      'Customer ID não informado e nenhuma conta padrão configurada.',
      "Passe --customer-id OU execute 'google-ads config set-default'.",
    );
  }

  const loginCustomerId =
    params.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;

  const client = createClient({
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
    developerToken: creds.developerToken,
  });

  const customer = getCustomer(client, {
    customerId,
    refreshToken: creds.refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const request = {
    customer_id: customerId.replace(/-/g, ''),
    language: params.languageConstant,
    geo_target_constants: [params.geoConstant],
    keyword_plan_network: params.network,
    keyword_seed: { keywords: params.seeds },
  };

  logger.debug({ customerId, network: params.network }, 'GenerateKeywordIdeas request');

  try {
    // O SDK expõe o serviço via customer.keywordPlanIdeas (ServiceFactory).
    const response = await customer.keywordPlanIdeas.generateKeywordIdeas(
      request as Parameters<typeof customer.keywordPlanIdeas.generateKeywordIdeas>[0],
    );
    return parseKeywordIdeasResponse(extractKeywordIdeaResults(response));
  } catch (err) {
    if (isPermissionError(err)) {
      throw new AppError(
        'AUTH_INVALID',
        'Não foi possível consultar o Planejador de Palavras-chave (sem permissão).',
        'O developer token precisa de acesso Basic ou Standard — o Keyword Planner ' +
          'não funciona com "explorer/test access". Solicite o upgrade em ' +
          'Google Ads → Ferramentas → Central de API. ' +
          `Detalhe da API: ${extractErrorText(err)}`,
      );
    }
    throw err;
  }
}
