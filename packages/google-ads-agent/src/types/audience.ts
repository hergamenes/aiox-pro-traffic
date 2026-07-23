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
