/**
 * Adapter de custom segments para o SDK google-ads-api (Story 9.3 — Epic 9).
 *
 * BOUNDARY RULE (Artigo VI): este é o ÚNICO arquivo da feature de custom segment
 * que importa 'google-ads-api'. `src/cli/commands/audience.ts` consome apenas os
 * types/funções exportados aqui — nunca o SDK diretamente (mesma regra de
 * `audience.ts`, `audience-target.ts`, `client.ts`).
 *
 * `custom_audience` vs `user_list` (diferença central desta story):
 *  - `user_list` (Story 9.1): definida por COMPORTAMENTO no site do cliente
 *    (quem visitou, coletado pela tag). É remarketing.
 *  - `custom_audience` (esta story): definida por SINAIS DE INTERESSE/INTENÇÃO
 *    declarados — palavras-chave que a pessoa pesquisa (`KEYWORD`), URLs que ela
 *    navega (`URL`) — via `CustomAudienceService`, independente de qualquer tag.
 *    É o substituto moderno do antigo "custom affinity/custom intent audience".
 *
 * Shape confirmado (SDK v23, `node_modules/google-ads-node/build/protos/protos.d.ts`,
 * Artigo IV — No Invention):
 *  - `ICustomAudience { resource_name?, id?, status?, name?, type?, description?,
 *    members?: ICustomAudienceMember[] }` — SEM campos condicionais por `type`,
 *    logo os quatro tipos (AUTO/INTEREST/PURCHASE_INTENT/SEARCH) usam o MESMO
 *    shape (qualquer restrição de elegibilidade de conta surge como erro de API).
 *  - `ICustomAudienceMember { member_type?, keyword?, url?, place_category?, app? }`
 *    — "oneof" plano: cada member preenche `member_type` + UM campo de valor
 *    (`keyword` OU `url` nesta story). Sem aninhamento (mais simples que a regra
 *    de `user_list` da Story 9.1).
 *  - Enums como STRING LITERAL (`'KEYWORD'`, `'URL'`, `'INTEREST'`, `'ENABLED'`)
 *    — mesma convenção de `audience.ts`/`campaign-builder.ts`.
 */

import type { GoogleAdsApi, resources, MutateOperation } from 'google-ads-api';
import { getCustomer } from './client.js';
import { logger } from '../cli/logger.js';
import type { CustomSegmentInput, CustomSegmentResult } from '../types/audience.js';

/**
 * Type helper: a resposta de `mutateResources` não expõe estaticamente os
 * campos por entidade. Lemos `custom_audience.resource_name` via este shape —
 * mesmo padrão de `asMutateEntry` em `audience.ts`/`mutations.ts`.
 */
type MutateResponseEntry = {
  custom_audience?: { resource_name?: string };
};
const asMutateEntry = (r: unknown): MutateResponseEntry => (r ?? {}) as MutateResponseEntry;

/** Parâmetros do executor `createCustomSegment`. */
export interface CreateCustomSegmentInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  operation: MutateOperation<resources.ICustomAudience>;
  dryRun: boolean;
}

/**
 * Builder PURO de members — transforma as listas já parseadas de keywords e
 * urls num array plano de `ICustomAudienceMember`. Um member por item, na ordem
 * keywords → urls. Sem I/O, sem validação (a validação — pelo menos um member —
 * acontece antes, no comando).
 */
export function buildCustomSegmentMembers(
  keywords: string[],
  urls: string[],
): resources.ICustomAudienceMember[] {
  const members: resources.ICustomAudienceMember[] = [];
  for (const keyword of keywords) {
    members.push({ member_type: 'KEYWORD', keyword });
  }
  for (const url of urls) {
    members.push({ member_type: 'URL', url });
  }
  return members;
}

/**
 * Builder PURO — monta a `MutateOperation<ICustomAudience>` para o custom
 * segment. Sem I/O, sem rede: apenas transforma o input no shape que
 * `customer.mutateResources` espera.
 *
 * `status: 'ENABLED'` é setado explicitamente para que o segmento nasça ativo
 * (é a intenção de quem o cria) — mesmo espírito do `membership_status: 'OPEN'`
 * explícito da Story 9.1. Valor confirmado no enum `CustomAudienceStatus`.
 */
export function buildCustomSegmentOperation(
  input: CustomSegmentInput,
): MutateOperation<resources.ICustomAudience> {
  const resource: resources.ICustomAudience = {
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    type: input.type,
    status: 'ENABLED',
    members: buildCustomSegmentMembers(input.keywords, input.urls),
  };

  return {
    entity: 'custom_audience',
    operation: 'create',
    resource,
  } as MutateOperation<resources.ICustomAudience>;
}

/**
 * Executor — cria o `custom_audience` na conta via `customer.mutateResources`.
 *
 * Em dry-run (`validate_only: true`) o Google valida a operação mas NÃO cria
 * nada e NÃO devolve um resource_name real; nesse caso `resourceName` volta
 * como string vazia (documentado, não inventado — mesmo comportamento de 9.1).
 */
export async function createCustomSegment(
  client: GoogleAdsApi,
  input: CreateCustomSegmentInput,
): Promise<CustomSegmentResult> {
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
  const resourceName = asMutateEntry(resultEntry).custom_audience?.resource_name ?? '';

  logger.debug(
    { customerId: input.customerId, dryRun: input.dryRun, resourceName },
    'createCustomSegment completed',
  );

  return { resourceName, dryRun: input.dryRun };
}
