/**
 * Adapter de "aplicar público" para o SDK google-ads-api (Story 9.2 — Epic 9).
 *
 * BOUNDARY RULE (Artigo VI): este arquivo importa 'google-ads-api'.
 * `src/cli/commands/audience.ts` consome apenas os types/funções exportados
 * aqui — nunca o SDK diretamente (mesma regra de `audience.ts`, `mutations.ts`).
 *
 * O que esta feature faz: liga uma `user_list` já existente (criada pela Story
 * 9.1) a uma campanha OU a um grupo de anúncios, definindo se a lista apenas
 * OBSERVA ou SEGMENTA (restringe o alcance).
 *
 * Mecanismo (confirmado contra `node_modules/google-ads-node/build/protos/protos.d.ts`,
 * SDK v23 — Artigo IV, No Invention):
 *  1. CREATE de `campaign_criterion` (ou `ad_group_criterion`) com
 *     `user_list.user_list = <resourceName>` — é o que LIGA a lista à entidade
 *     (`IUserListInfo { user_list: string }`, confirmado).
 *  2. UPDATE do `targeting_setting` da MESMA entidade (campaign/ad_group)
 *     adicionando — de forma INCREMENTAL — uma restrição na dimensão AUDIENCE
 *     com `bid_only` conforme o modo (`ITargetRestrictionOperation { operator,
 *     value: ITargetRestriction { targeting_dimension, bid_only } }`, confirmado).
 *
 * Observação (`observation`) => `bid_only: true`  => NÃO restringe alcance.
 * Segmentação (`targeting`)   => `bid_only: false` => RESTRINGE o alcance.
 *
 * POR QUE `target_restriction_operations` (operador ADD) e NÃO sobrescrever o
 * array `target_restrictions` inteiro: substituir o array completo apagaria
 * TODAS as restrições da entidade — inclusive as de OUTRAS dimensões
 * (KEYWORD/TOPIC/etc.) — o que poderia quebrar segmentações já configuradas
 * pelo cliente. A operação incremental ADD mexe SÓ na dimensão AUDIENCE,
 * preservando as demais. É a abordagem segura exigida pela Story 9.2 (R1/R3).
 *
 * As duas operações vão no MESMO batch com `partial_failure: false`, ou seja,
 * são ATÔMICAS: se o ajuste de `targeting_setting` falhar, o criterion também
 * NÃO é criado (não fica um estado meio-aplicado).
 */

import type { GoogleAdsApi, resources, MutateOperation } from 'google-ads-api';
import { getCustomer } from './client.js';
import { logger } from '../cli/logger.js';
import type {
  ApplyAudienceTargetResult,
  AudienceTargetMode,
} from '../types/audience.js';

/**
 * Type helper: a resposta de `mutateResources` não expõe estaticamente os
 * campos por entidade. Lemos o resource_name do criterion criado (índice 0 do
 * batch) via este shape — mesmo padrão de `asMutateEntry` em `mutations.ts`.
 */
type MutateResponseEntry = {
  campaign_criterion?: { resource_name?: string };
  ad_group_criterion?: { resource_name?: string };
};
const asMutateEntry = (r: unknown): MutateResponseEntry => (r ?? {}) as MutateResponseEntry;

/** Remove traços de um customer ID (`123-456-7890` → `1234567890`). */
function stripDashes(id: string): string {
  return id.replace(/-/g, '');
}

/**
 * União dos tipos de recurso que o builder emite num único batch. Cada operação
 * é individualmente montada e afirmada; o `mutateResources<T>` genérico do SDK
 * aceita um array heterogêneo desta forma.
 */
export type AudienceTargetOperation = MutateOperation<
  | resources.ICampaignCriterion
  | resources.IAdGroupCriterion
  | resources.ICampaign
  | resources.IAdGroup
>;

/** Parâmetros do builder puro `buildApplyAudienceTargetOperations`. */
export interface BuildApplyAudienceTargetInput {
  /** Customer ID (com ou sem traços) — usado para montar os resource_names. */
  customerId: string;
  /** Resource name da lista a aplicar (`customers/{id}/userLists/{id}`). */
  userListResourceName: string;
  /** ID da campanha (nível campanha). Mutuamente exclusivo com `adGroupId`. */
  campaignId?: string;
  /** ID do grupo de anúncios (nível ad group). Mutuamente exclusivo com `campaignId`. */
  adGroupId?: string;
  /** Modo de aplicação (observação x segmentação). */
  mode: AudienceTargetMode;
}

/**
 * Builder PURO — monta as (duas) `MutateOperation` para aplicar um público.
 * Sem I/O, sem rede: apenas transforma o input no shape que
 * `customer.mutateResources` espera.
 *
 * Assume que exatamente um entre `campaignId`/`adGroupId` está presente (a
 * validação XOR acontece antes, no comando). Quando `campaignId` está presente,
 * opera no nível campanha; caso contrário, no nível ad group.
 *
 * Enums como STRING LITERAL (`'ADD'`, `'AUDIENCE'`) — mesma convenção de
 * `audience.ts`/`campaign-builder.ts`.
 */
export function buildApplyAudienceTargetOperations(
  input: BuildApplyAudienceTargetInput,
): AudienceTargetOperation[] {
  const cid = stripDashes(input.customerId);
  // observação = bid_only:true (não restringe) ; segmentação = bid_only:false.
  const bidOnly = input.mode === 'observation';

  const targetingSetting = {
    targeting_setting: {
      target_restriction_operations: [
        {
          operator: 'ADD',
          value: { targeting_dimension: 'AUDIENCE', bid_only: bidOnly },
        },
      ],
    },
  };

  if (input.campaignId !== undefined) {
    const campaignRn = `customers/${cid}/campaigns/${input.campaignId}`;

    const criterionOp = {
      entity: 'campaign_criterion',
      operation: 'create',
      resource: {
        campaign: campaignRn,
        user_list: { user_list: input.userListResourceName },
      },
    } as unknown as AudienceTargetOperation;

    const targetingOp = {
      entity: 'campaign',
      operation: 'update',
      resource: {
        resource_name: campaignRn,
        ...targetingSetting,
      },
      update_mask: { paths: ['targeting_setting.target_restriction_operations'] },
    } as unknown as AudienceTargetOperation;

    return [criterionOp, targetingOp];
  }

  const adGroupRn = `customers/${cid}/adGroups/${input.adGroupId}`;

  const criterionOp = {
    entity: 'ad_group_criterion',
    operation: 'create',
    resource: {
      ad_group: adGroupRn,
      user_list: { user_list: input.userListResourceName },
    },
  } as unknown as AudienceTargetOperation;

  const targetingOp = {
    entity: 'ad_group',
    operation: 'update',
    resource: {
      resource_name: adGroupRn,
      ...targetingSetting,
    },
    update_mask: { paths: ['targeting_setting.target_restriction_operations'] },
  } as unknown as AudienceTargetOperation;

  return [criterionOp, targetingOp];
}

/** Parâmetros do executor `applyAudienceTarget`. */
export interface ApplyAudienceTargetExecInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  /** Operações já montadas pelo builder puro (criterion create + targeting update). */
  operations: AudienceTargetOperation[];
  dryRun: boolean;
}

/**
 * Executor — aplica o público via `customer.mutateResources` (batch atômico).
 *
 * Em dry-run (`validate_only: true`) o Google valida as operações mas NÃO
 * aplica nada e NÃO devolve um resource_name real; nesse caso
 * `criterionResourceName` volta como string vazia (documentado, não inventado).
 */
export async function applyAudienceTarget(
  client: GoogleAdsApi,
  input: ApplyAudienceTargetExecInput,
): Promise<ApplyAudienceTargetResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const response = await customer.mutateResources(input.operations, {
    validate_only: input.dryRun,
    partial_failure: false,
  });

  // O criterion create é a operação [0] do batch; lemos o resource_name dele.
  const resultEntry = response.mutate_operation_responses?.[0];
  const entry = asMutateEntry(resultEntry);
  const criterionResourceName =
    entry.campaign_criterion?.resource_name ??
    entry.ad_group_criterion?.resource_name ??
    '';

  logger.debug(
    { customerId: input.customerId, dryRun: input.dryRun, criterionResourceName },
    'applyAudienceTarget completed',
  );

  return { criterionResourceName, dryRun: input.dryRun };
}
