/**
 * Tipos do comando `create audience-remarketing` (Story 9.1 — Epic 9).
 *
 * Uma lista de remarketing (`user_list`) rule-based coleta visitantes do
 * site do cliente (aproveitando a tag já instalada) para segmentar depois.
 * A regra mais simples — "todos os visitantes" — é expressa como o curinga
 * `url__ CONTAINS "http"`, o comportamento default quando `urlContains` é
 * omitido. Ver `src/google-ads-api/audience.ts` para o shape da MutateOperation.
 */

/** Parâmetros de entrada para criar uma lista de remarketing rule-based. */
export interface RemarketingUserListInput {
  /** Nome da lista (obrigatório, ≤255 chars). */
  name: string;
  /** Descrição opcional da lista. */
  description?: string;
  /**
   * Duração de associação em dias (`membership_life_span`): quanto tempo um
   * usuário permanece na lista após entrar. Faixa aceita: 1..540.
   */
  membershipDurationDays: number;
  /**
   * Trecho de URL que define quem entra na lista (ex.: o domínio do cliente).
   * Quando omitido, usa o curinga `http` — captura todos os visitantes do site.
   */
  urlContains?: string;
}

/** Resultado da criação de uma lista de remarketing. */
export interface RemarketingUserListResult {
  /**
   * Resource name da `user_list` criada (ex.: `customers/123/userLists/456`).
   * Em dry-run pode vir vazio — a API não devolve um resource_name real quando
   * `validate_only: true`.
   */
  resourceName: string;
  /** True quando a chamada foi apenas validação (`validate_only`), sem criação real. */
  dryRun: boolean;
}

// ============================================================================
// Story 9.2 — Aplicar público a campanha/grupo de anúncios (audience-target)
// ============================================================================

/**
 * Modo de aplicação de um público a uma campanha/ad group.
 *
 * - `observation`: a lista apenas OBSERVA (`bid_only: true`) — coleta dados e
 *   permite ajustar lances por público, mas NÃO restringe o alcance da campanha.
 *   É o default (mais seguro).
 * - `targeting`: a lista SEGMENTA (`bid_only: false`) — a campanha/ad group passa
 *   a servir SOMENTE para o público informado, RESTRINGINDO o alcance.
 */
export type AudienceTargetMode = 'observation' | 'targeting';

/**
 * Parâmetros para aplicar uma `user_list` existente a uma campanha OU a um
 * grupo de anúncios. Exatamente um entre `campaignId`/`adGroupId` deve estar
 * presente (XOR — garantido pela validação antes de chegar ao builder).
 */
export interface ApplyAudienceTargetInput {
  /** Customer ID (10 dígitos) — usado para montar os resource_names. */
  customerId: string;
  /** Resource name da lista a aplicar (`customers/{id}/userLists/{id}`). */
  userListResourceName: string;
  /** ID numérico da campanha (nível campanha). Mutuamente exclusivo com `adGroupId`. */
  campaignId?: string;
  /** ID numérico do grupo de anúncios (nível ad group). Mutuamente exclusivo com `campaignId`. */
  adGroupId?: string;
  /** Modo de aplicação (observação x segmentação). */
  mode: AudienceTargetMode;
}

/** Resultado da aplicação de um público a uma campanha/ad group. */
export interface ApplyAudienceTargetResult {
  /**
   * Resource name do criterion criado (`campaign_criterion` ou
   * `ad_group_criterion`). Em dry-run pode vir vazio — a API não devolve um
   * resource_name real quando `validate_only: true`.
   */
  criterionResourceName: string;
  /** True quando a chamada foi apenas validação (`validate_only`), sem mutação real. */
  dryRun: boolean;
}
