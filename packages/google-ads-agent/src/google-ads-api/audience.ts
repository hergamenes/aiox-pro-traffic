/**
 * Adapter de audiences para o SDK google-ads-api (Story 9.1 — Epic 9).
 *
 * BOUNDARY RULE (Artigo VI): este é o ÚNICO arquivo da feature de audiences
 * que importa 'google-ads-api'. `src/cli/commands/audience.ts` consome apenas
 * os types/funções exportados aqui — nunca o SDK diretamente (mesma regra de
 * `client.ts`, `mutations.ts`, `adapter.ts`, `accounts.ts`).
 *
 * Esta story cobre a lista de remarketing rule-based mais simples: "todos os
 * visitantes do site". O Google exige que toda rule-based user list tenha uma
 * regra de URL (variável reservada `url__`) — não existe "sem filtro". Portanto
 * "todos os visitantes" = curinga `url__ CONTAINS "http"` (default quando
 * `urlContains` é omitido).
 */

import type { GoogleAdsApi, resources, MutateOperation } from 'google-ads-api';
import { getCustomer } from './client.js';
import { logger } from '../cli/logger.js';
import type { RemarketingUserListInput, RemarketingUserListResult } from '../types/audience.js';

/**
 * Type helper: a resposta de `mutateResources` não expõe estaticamente os
 * campos por entidade. Lemos `user_list.resource_name` via este shape — mesmo
 * padrão de `asMutateEntry` em `mutations.ts`.
 */
type MutateResponseEntry = {
  user_list?: { resource_name?: string };
};
const asMutateEntry = (r: unknown): MutateResponseEntry => (r ?? {}) as MutateResponseEntry;

export interface CreateRemarketingUserListInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  operation: MutateOperation<resources.IUserList>;
  dryRun: boolean;
}

/**
 * Builder PURO — monta a MutateOperation<IUserList> para uma lista de
 * remarketing rule-based. Sem I/O, sem chamada de rede: apenas transforma o
 * input no shape que `customer.mutateResources` espera.
 *
 * - `membership_life_span`: dias que um usuário permanece na lista após entrar.
 * - Regra "todos os visitantes": `url__ CONTAINS <urlContains>`, usando o
 *   curinga `http` quando `urlContains` é omitido (captura qualquer visitante).
 * - Enums como STRING LITERAL (ex.: `'OPEN'`, `'REQUESTED'`, `'AND'`,
 *   `'OR_OF_ANDS'`, `'CONTAINS'`) — mesma convenção de `campaign-builder.ts`.
 */
export function buildRemarketingUserListOperation(
  input: RemarketingUserListInput,
): MutateOperation<resources.IUserList> {
  // MNT-001: `--url-contains ""` (ou só espaços) cai no curinga, igual a omitir.
  // `?.trim() || 'http'` cobre nullish E string vazia/whitespace (o `??` cobria só nullish).
  const value = input.urlContains?.trim() || 'http';

  const resource: resources.IUserList = {
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    membership_status: 'OPEN',
    membership_life_span: input.membershipDurationDays,
    rule_based_user_list: {
      prepopulation_status: 'REQUESTED',
      flexible_rule_user_list: {
        inclusive_rule_operator: 'AND',
        inclusive_operands: [
          {
            rule: {
              rule_type: 'OR_OF_ANDS',
              rule_item_groups: [
                {
                  rule_items: [
                    {
                      name: 'url__',
                      string_rule_item: { operator: 'CONTAINS', value },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  };

  return {
    entity: 'user_list',
    operation: 'create',
    resource,
  } as MutateOperation<resources.IUserList>;
}

/**
 * Executor — cria a user_list na conta via `customer.mutateResources`.
 *
 * Em dry-run (`validate_only: true`) o Google valida a operação mas NÃO cria
 * nada e NÃO devolve um resource_name real; nesse caso `resourceName` volta
 * como string vazia (documentado, não inventado).
 */
export async function createRemarketingUserList(
  client: GoogleAdsApi,
  input: CreateRemarketingUserListInput,
): Promise<RemarketingUserListResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const response = await customer.mutateResources([input.operation], {
    validate_only: input.dryRun,
    partial_failure: false,
  });

  const resultEntry = response.mutate_operation_responses?.[0];
  const resourceName = asMutateEntry(resultEntry).user_list?.resource_name ?? '';

  logger.debug(
    { customerId: input.customerId, dryRun: input.dryRun, resourceName },
    'createRemarketingUserList completed',
  );

  return { resourceName, dryRun: input.dryRun };
}
