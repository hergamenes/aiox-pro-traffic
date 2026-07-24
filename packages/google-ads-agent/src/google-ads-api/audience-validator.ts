/**
 * Validadores puros de inputs para `create audience-remarketing` (Story 9.1) e
 * `create audience-target` (Story 9.2).
 *
 * Funções puras — sem I/O, sem SDK. Não importam 'google-ads-api'.
 * Mesmo padrão `{valid, error?}` de `keyword-research-validator.ts`.
 */

import { isNumericId } from './id-validator.js';
import { CUSTOM_AUDIENCE_TYPES } from '../types/audience.js';

/** Limite de caracteres do nome de uma user_list (mesmo limite de campaign.name). */
export const MAX_AUDIENCE_NAME_LENGTH = 255;

/** Faixa aceita de duração de associação (membership_life_span), em dias. */
export const MIN_MEMBERSHIP_DAYS = 1;
export const MAX_MEMBERSHIP_DAYS = 540;

export interface AudienceValidation {
  valid: boolean;
  error?: string;
}

/**
 * Valida o nome da lista: não vazio (após trim) e ≤255 caracteres.
 */
export function validateAudienceName(name: string): AudienceValidation {
  const trimmed = (name ?? '').trim();
  if (trimmed === '') {
    return { valid: false, error: 'Nome da lista não pode ser vazio (--name).' };
  }
  if (trimmed.length > MAX_AUDIENCE_NAME_LENGTH) {
    return {
      valid: false,
      error: `Nome da lista excede ${MAX_AUDIENCE_NAME_LENGTH} caracteres (você passou ${trimmed.length}).`,
    };
  }
  return { valid: true };
}

/**
 * Valida a duração de associação em dias: inteiro dentro da faixa 1..540.
 */
export function validateMembershipDays(days: number): AudienceValidation {
  if (!Number.isInteger(days)) {
    return {
      valid: false,
      error: `--membership-days deve ser um número inteiro de dias (faixa ${MIN_MEMBERSHIP_DAYS}..${MAX_MEMBERSHIP_DAYS}).`,
    };
  }
  if (days < MIN_MEMBERSHIP_DAYS || days > MAX_MEMBERSHIP_DAYS) {
    return {
      valid: false,
      error: `--membership-days fora da faixa aceita: use um valor entre ${MIN_MEMBERSHIP_DAYS} e ${MAX_MEMBERSHIP_DAYS} dias (você passou ${days}).`,
    };
  }
  return { valid: true };
}

// ============================================================================
// Story 9.2 — Validadores de `create audience-target`
// ============================================================================

/** Formato de resource_name de uma user_list: `customers/{id}/userLists/{id}`. */
const USER_LIST_RESOURCE_NAME = /^customers\/\d+\/userLists\/\d+$/;

/** Modos de aplicação aceitos pelo comando `create audience-target`. */
export const AUDIENCE_TARGET_MODES = ['observation', 'targeting'] as const;

/** Resultado da validação de nível de aplicação (com o nível resolvido). */
export interface AudienceTargetLevelValidation extends AudienceValidation {
  /** Nível resolvido quando `valid` — 'campaign' ou 'ad_group'. */
  level?: 'campaign' | 'ad_group';
}

/**
 * Valida o resource_name da lista informado em `--user-list`: obrigatório e no
 * formato `customers/{id}/userLists/{id}`.
 */
export function validateUserListResourceName(value: string): AudienceValidation {
  const trimmed = (value ?? '').trim();
  if (trimmed === '') {
    return { valid: false, error: '--user-list é obrigatório (resource_name da lista).' };
  }
  if (!USER_LIST_RESOURCE_NAME.test(trimmed)) {
    return {
      valid: false,
      error: `--user-list inválido: '${value}'. Formato esperado: customers/{id}/userLists/{id}.`,
    };
  }
  return { valid: true };
}

/**
 * Valida o nível de aplicação: exatamente UM entre `--campaign-id` e
 * `--ad-group-id` (XOR, R4), e que o ID informado seja numérico. Retorna o
 * nível resolvido (`campaign`/`ad_group`) quando válido.
 */
export function validateAudienceTargetLevel(params: {
  campaignId?: string;
  adGroupId?: string;
}): AudienceTargetLevelValidation {
  const hasCampaign = (params.campaignId ?? '').trim() !== '';
  const hasAdGroup = (params.adGroupId ?? '').trim() !== '';

  if (hasCampaign && hasAdGroup) {
    return {
      valid: false,
      error: 'Informe apenas UM: --campaign-id OU --ad-group-id (não os dois).',
    };
  }
  if (!hasCampaign && !hasAdGroup) {
    return {
      valid: false,
      error: 'Informe exatamente um nível de aplicação: --campaign-id OU --ad-group-id.',
    };
  }

  const flag = hasCampaign ? '--campaign-id' : '--ad-group-id';
  const id = (hasCampaign ? params.campaignId : params.adGroupId) as string;
  if (!isNumericId(id)) {
    return {
      valid: false,
      error: `${flag} inválido: '${id}'. Deve conter apenas dígitos (0-9).`,
    };
  }

  return { valid: true, level: hasCampaign ? 'campaign' : 'ad_group' };
}

/**
 * Valida o modo de aplicação: apenas `observation` (default) ou `targeting`.
 */
export function validateAudienceTargetMode(mode: string): AudienceValidation {
  if (!(AUDIENCE_TARGET_MODES as readonly string[]).includes(mode)) {
    return {
      valid: false,
      error: `--mode inválido: '${mode}'. Use 'observation' (default, não restringe) ou 'targeting' (restringe alcance).`,
    };
  }
  return { valid: true };
}

// ============================================================================
// Story 9.3 — Validadores de `create audience-custom-segment`
// ============================================================================

/**
 * Parseia uma lista separada por vírgula (flags `--keywords`/`--urls`):
 * split por vírgula, trim de cada item e descarte de vazios. Tolerante a
 * espaços e vírgulas duplicadas (`"a,,b"`, `" a , b "` → `['a', 'b']`).
 * Retorna `[]` para `undefined`/vazio (R3).
 */
export function parseCommaSeparatedList(value: string | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

/**
 * Valida que o segmento terá pelo menos um member: ao menos uma keyword OU uma
 * url válida após o parsing (R4). Recebe as listas JÁ parseadas.
 */
export function validateCustomSegmentMembers(params: {
  keywords: string[];
  urls: string[];
}): AudienceValidation {
  if (params.keywords.length === 0 && params.urls.length === 0) {
    return {
      valid: false,
      error:
        'Informe ao menos uma palavra-chave (--keywords "a,b") ou uma URL (--urls "x,y") para o segmento.',
    };
  }
  return { valid: true };
}

/**
 * Valida o tipo do segmento contra a lista fechada confirmada no enum do SDK:
 * `AUTO | INTEREST | PURCHASE_INTENT | SEARCH` (R5). Case-sensitive (os valores
 * do enum são maiúsculos).
 */
export function validateCustomAudienceType(type: string): AudienceValidation {
  if (!(CUSTOM_AUDIENCE_TYPES as readonly string[]).includes(type)) {
    return {
      valid: false,
      error: `--type inválido: '${type}'. Use um de: ${CUSTOM_AUDIENCE_TYPES.join(', ')}.`,
    };
  }
  return { valid: true };
}
