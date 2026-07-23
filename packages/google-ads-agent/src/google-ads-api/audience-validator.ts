/**
 * Validadores puros de inputs para `create audience-remarketing` (Story 9.1).
 *
 * Funções puras — sem I/O, sem SDK. Não importam 'google-ads-api'.
 * Mesmo padrão `{valid, error?}` de `keyword-research-validator.ts`.
 */

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
