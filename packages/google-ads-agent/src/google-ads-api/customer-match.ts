/**
 * Adapter de Customer Match para o SDK google-ads-api (Story 9.4 — Epic 9).
 *
 * BOUNDARY RULE (Artigo VI): este é o ÚNICO arquivo da feature de Customer Match
 * que importa 'google-ads-api'. `src/cli/commands/audience.ts` consome apenas os
 * types/funções exportados aqui — nunca o SDK diretamente (mesma regra de
 * `audience.ts`, `custom-segment.ts`, `client.ts`).
 *
 * ⚠️ SEGURANÇA/PII (R2, NÃO NEGOCIÁVEL): nenhuma função aqui recebe, loga ou
 * serializa e-mail/telefone em claro. As operações chegam já como
 * `HashedIdentifier[]` (SHA-256 hex). Os logs (`logger.debug`) só registram
 * contagens e resource_names — nunca o array de identificadores.
 *
 * Duas fases (shapes confirmados no SDK v23 — Artigo IV, No Invention):
 *  - Fase 1: cria uma `user_list` com `crm_based_user_list_info.upload_key_type`
 *    via `customer.mutateResources` (mesmo padrão da Story 9.1, campo irmão de
 *    `rule_based_user_list`).
 *  - Fase 2: `OfflineUserDataJobService` (confirmado em
 *    `node_modules/google-ads-api/build/src/protos/autogen/serviceFactory.d.ts`):
 *      1. `createOfflineUserDataJob({ customer_id, job })` → resource_name do job
 *      2. `addOfflineUserDataJobOperations({ resource_name, operations })`
 *      3. `runOfflineUserDataJob({ resource_name })` → longrunning.Operation
 *    O `run` dispara um processamento ASSÍNCRONO no lado do Google (pode levar
 *    horas). Esta story NÃO faz polling: dispara e reporta o job/operation
 *    (R3, documentado em Completion Notes).
 */

import type {
  GoogleAdsApi,
  resources,
  services,
  common,
  MutateOperation,
} from 'google-ads-api';
import { getCustomer } from './client.js';
import { logger } from '../cli/logger.js';
import type {
  HashedIdentifier,
  CrmUserListResult,
  CustomerMatchUploadResult,
} from '../types/audience.js';

/**
 * Type helper: a resposta de `mutateResources` não expõe estaticamente os
 * campos por entidade. Lemos `user_list.resource_name` via este shape — mesmo
 * padrão de `asMutateEntry` em `audience.ts`/`custom-segment.ts`.
 */
type MutateResponseEntry = {
  user_list?: { resource_name?: string };
};
const asMutateEntry = (r: unknown): MutateResponseEntry => (r ?? {}) as MutateResponseEntry;

/** Remove traços de um customer-id (`123-456-7890` → `1234567890`). */
function stripDashes(id: string): string {
  return id.replace(/-/g, '');
}

// ============================================================================
// Fase 1 — criação da crm_based_user_list
// ============================================================================

/** Parâmetros do builder da lista CRM (Fase 1). */
export interface BuildCrmUserListInput {
  /** Nome da lista (obrigatório). */
  name: string;
  /** Descrição opcional. */
  description?: string;
  /**
   * `upload_key_type` da lista. Esta story cobre apenas `CONTACT_INFO`
   * (e-mail/telefone). Valor confirmado no enum `CustomerMatchUploadKeyType`.
   */
  uploadKeyType: 'CONTACT_INFO';
}

/** Parâmetros do executor `createCrmUserList` (Fase 1). */
export interface CreateCrmUserListInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  operation: MutateOperation<resources.IUserList>;
}

/**
 * Builder PURO (Fase 1) — monta a `MutateOperation<IUserList>` para uma lista
 * Customer Match `crm_based`. Sem I/O, sem rede.
 *
 * `data_source_type` é OMITIDO de propósito: o default da API é `FIRST_PARTY`
 * (dado próprio do anunciante), que é exatamente o caso desta story — não
 * inventamos um valor (Artigo IV). Enum como STRING LITERAL (`'CONTACT_INFO'`,
 * `'OPEN'`) — mesma convenção de `audience.ts`.
 */
export function buildCrmUserListOperation(
  input: BuildCrmUserListInput,
): MutateOperation<resources.IUserList> {
  const resource: resources.IUserList = {
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    membership_status: 'OPEN',
    crm_based_user_list: {
      upload_key_type: input.uploadKeyType,
    },
  };

  return {
    entity: 'user_list',
    operation: 'create',
    resource,
  } as MutateOperation<resources.IUserList>;
}

/**
 * Executor (Fase 1) — cria a `crm_based_user_list` via `customer.mutateResources`
 * e devolve o resource_name. Só é chamado em execução REAL (o modo dry-run do
 * comando é resolvido no cliente, sem tocar a API — ver Completion Notes).
 */
export async function createCrmUserList(
  client: GoogleAdsApi,
  input: CreateCrmUserListInput,
): Promise<CrmUserListResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const response = await customer.mutateResources([input.operation], {
    validate_only: false,
    partial_failure: false,
  });

  const resultEntry = response.mutate_operation_responses?.[0];
  const resourceName = asMutateEntry(resultEntry).user_list?.resource_name ?? '';

  logger.debug(
    { customerId: input.customerId, resourceName },
    'createCrmUserList completed',
  );

  return { resourceName };
}

// ============================================================================
// Fase 2 — upload dos contatos via OfflineUserDataJob
// ============================================================================

/**
 * Builder PURO (Fase 2) — transforma os identificadores hasheados num array de
 * `OfflineUserDataJobOperation`. Um contato = uma operação `create` com um
 * `UserData` que agrupa os `UserIdentifier` (e-mail e/ou telefone) daquela
 * pessoa. Sem I/O, sem rede.
 *
 * ⚠️ Recebe SÓ hashes (`HashedIdentifier`) — nunca dado em claro (R2).
 */
export function buildUserDataOperations(
  identifiers: HashedIdentifier[],
): services.IOfflineUserDataJobOperation[] {
  return identifiers.map((id) => {
    const userIdentifiers: common.IUserIdentifier[] = [];
    if (id.hashedEmail) {
      userIdentifiers.push({ hashed_email: id.hashedEmail });
    }
    if (id.hashedPhoneNumber) {
      userIdentifiers.push({ hashed_phone_number: id.hashedPhoneNumber });
    }
    return { create: { user_identifiers: userIdentifiers } };
  });
}

/** Parâmetros do executor `runCustomerMatchUpload` (Fase 2). */
export interface RunCustomerMatchUploadInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  /** Resource name da lista criada na Fase 1. */
  userListResourceName: string;
  /** Operações já construídas por `buildUserDataOperations` (só hashes). */
  operations: services.IOfflineUserDataJobOperation[];
}

/**
 * Executor (Fase 2) — cria o `offline_user_data_job` (tipo
 * `CUSTOMER_MATCH_USER_LIST`), adiciona as operações hasheadas e dispara o
 * `run`. Só é chamado em execução REAL (dry-run é resolvido no cliente).
 *
 * ACOMPANHAMENTO ASSÍNCRONO (R3): `runOfflineUserDataJob` devolve uma
 * `longrunning.Operation`. Esta story NÃO faz polling até o job terminar de
 * processar (isso pode levar horas no lado do Google). Reportamos o
 * `jobResourceName` (e o `operationName` quando disponível) para o operador
 * consultar depois — o status é consultável via GAQL em `offline_user_data_job`,
 * fora do escopo desta story.
 *
 * LIMITE DE BATCH (R6): o limite documentado da API v23 para operações por
 * chamada de `addOfflineUserDataJobOperations` (100k) está muito acima do
 * tamanho realista de um CSV de lista de contatos de um gestor de tráfego, então
 * enviamos as operações numa única chamada. Chunking fica como evolução futura
 * se um caso real exceder o limite.
 */
export async function runCustomerMatchUpload(
  client: GoogleAdsApi,
  input: RunCustomerMatchUploadInput,
): Promise<CustomerMatchUploadResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const svc = customer.offlineUserDataJobs;

  // 1) Cria o job referenciando a lista da Fase 1.
  const createRequest = {
    customer_id: stripDashes(input.customerId),
    job: {
      type: 'CUSTOMER_MATCH_USER_LIST',
      customer_match_user_list_metadata: {
        user_list: input.userListResourceName,
      },
    },
  };
  const createResponse = await svc.createOfflineUserDataJob(
    createRequest as Parameters<typeof svc.createOfflineUserDataJob>[0],
  );
  const jobResourceName = (createResponse as { resource_name?: string }).resource_name ?? '';
  if (!jobResourceName) {
    throw new Error('Falha ao criar o job de upload: a API não retornou o resource_name do job.');
  }

  // 2) Adiciona as operações hasheadas ao job.
  const addRequest = {
    resource_name: jobResourceName,
    operations: input.operations,
    enable_partial_failure: true,
  };
  await svc.addOfflineUserDataJobOperations(
    addRequest as Parameters<typeof svc.addOfflineUserDataJobOperations>[0],
  );

  // 3) Dispara o processamento (assíncrono no lado do Google — sem polling).
  const runRequest = { resource_name: jobResourceName };
  const runOperation = await svc.runOfflineUserDataJob(
    runRequest as Parameters<typeof svc.runOfflineUserDataJob>[0],
  );
  const operationName = (runOperation as { name?: string })?.name;

  logger.debug(
    { customerId: input.customerId, jobResourceName, uploadedCount: input.operations.length },
    'runCustomerMatchUpload dispatched (async processing on Google side)',
  );

  return {
    jobResourceName,
    uploadedCount: input.operations.length,
    ...(operationName ? { operationName } : {}),
  };
}
