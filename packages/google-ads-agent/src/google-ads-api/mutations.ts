/**
 * Mutation operations for the google-ads-api SDK.
 *
 * BOUNDARY RULE: This file is allowed to import 'google-ads-api'
 * because it lives in src/google-ads-api/. All CLI commands and
 * helpers must talk to functions exported here — never the SDK
 * directly.
 *
 * Story 6.1 introduces the FIRST mutations (update budget + bidding).
 * Subsequent stories in Epic 6 extend this module with create/pause/
 * delete operations.
 */

import type { GoogleAdsApi, resources, MutateOperation } from 'google-ads-api';
import { getCustomer } from './client.js';
import { logger } from '../cli/logger.js';
import {
  buildSearchCampaignOperations,
  type BiddingStrategy,
} from './campaign-builder.js';

export interface CampaignBudgetSnapshot {
  campaignId: string;
  campaignName: string;
  campaignStatus: string;
  budgetResourceName: string;
  budgetAmountMicros: number;
  currencyCode?: string;
}

export interface CampaignBiddingSnapshot {
  campaignId: string;
  campaignName: string;
  campaignStatus: string;
  biddingStrategyType: string;
  targetCpaMicros?: number;
  targetRoas?: number;
}

export type BiddingStrategyKind =
  | 'maximize_conversions'
  | 'target_cpa'
  | 'target_roas'
  | 'manual_cpc'
  | 'maximize_conversion_value';

export interface UpdateBudgetInput {
  customerId: string;
  campaignId: string;
  newAmountMicros: number;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface UpdateBudgetResult {
  before: { amountMicros: number };
  after: { amountMicros: number };
  resourceName: string;
  dryRun: boolean;
}

export interface UpdateBiddingInput {
  customerId: string;
  campaignId: string;
  strategy: BiddingStrategyKind;
  targetMicros?: number;
  targetRoas?: number;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface UpdateBiddingResult {
  before: { strategy: string; targetMicros?: number; targetRoas?: number };
  after: { strategy: string; targetMicros?: number; targetRoas?: number };
  resourceName: string;
  dryRun: boolean;
}

/**
 * Reads a campaign + its linked budget. Used as pre-fetch before
 * any budget mutation so the operator can see before/after diff.
 *
 * Throws if the campaign does not exist or is REMOVED.
 */
export async function readCampaignBudgetSnapshot(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  campaignId: string,
  loginCustomerId?: string,
): Promise<CampaignBudgetSnapshot> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.campaign_budget,
      campaign_budget.amount_micros,
      campaign_budget.resource_name,
      customer.currency_code
    FROM campaign
    WHERE campaign.id = ${campaignId}
    LIMIT 1
  `)) as unknown as Array<{
    campaign?: { id?: string | number; name?: string; status?: string; campaign_budget?: string };
    campaign_budget?: { amount_micros?: string | number; resource_name?: string };
    customer?: { currency_code?: string };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.campaign || !first.campaign_budget) {
    throw new Error(`Campanha ${campaignId} não encontrada na conta ${customerId}.`);
  }

  const status = String(first.campaign.status ?? '');
  if (status === 'REMOVED' || status === '3') {
    throw new Error(`Campanha ${campaignId} está REMOVED — não é possível mutar.`);
  }

  const budgetResourceName =
    first.campaign_budget.resource_name ?? first.campaign.campaign_budget;
  if (!budgetResourceName) {
    throw new Error(`Não foi possível resolver o resource_name do budget para campanha ${campaignId}.`);
  }

  return {
    campaignId: String(first.campaign.id ?? campaignId),
    campaignName: String(first.campaign.name ?? ''),
    campaignStatus: status,
    budgetResourceName,
    budgetAmountMicros: Number(first.campaign_budget.amount_micros ?? 0),
    ...(first.customer?.currency_code ? { currencyCode: String(first.customer.currency_code) } : {}),
  };
}

/**
 * Updates the daily budget for the given campaign. Mutates the
 * campaign_budget entity (Google separates budget from campaign).
 *
 * If `dryRun=true`, sends with `validate_only` so the API returns
 * the same response without actually applying the change.
 */
export async function updateCampaignBudget(
  client: GoogleAdsApi,
  input: UpdateBudgetInput,
): Promise<UpdateBudgetResult> {
  const snapshot = await readCampaignBudgetSnapshot(
    client,
    input.refreshToken,
    input.customerId,
    input.campaignId,
    input.loginCustomerId,
  );

  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const operations: MutateOperation<resources.ICampaignBudget>[] = [
    {
      entity: 'campaign_budget',
      operation: 'update',
      resource: {
        resource_name: snapshot.budgetResourceName,
        amount_micros: input.newAmountMicros,
      },
      update_mask: { paths: ['amount_micros'] },
    } as MutateOperation<resources.ICampaignBudget>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const resultEntry = response.mutate_operation_responses?.[0];
  const resourceName =
    (resultEntry?.campaign_budget as { resource_name?: string } | undefined)?.resource_name ??
    snapshot.budgetResourceName;

  logger.debug(
    {
      campaignId: input.campaignId,
      customerId: input.customerId,
      dryRun: input.dryRun,
      before: snapshot.budgetAmountMicros,
      after: input.newAmountMicros,
    },
    'updateCampaignBudget completed',
  );

  return {
    before: { amountMicros: snapshot.budgetAmountMicros },
    after: { amountMicros: input.dryRun ? snapshot.budgetAmountMicros : input.newAmountMicros },
    resourceName,
    dryRun: Boolean(input.dryRun),
  };
}

/**
 * Reads bidding strategy snapshot for a campaign. Pre-fetch helper
 * used before bidding mutations.
 */
export async function readCampaignBiddingSnapshot(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  campaignId: string,
  loginCustomerId?: string,
): Promise<CampaignBiddingSnapshot> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.bidding_strategy_type,
      campaign.target_cpa.target_cpa_micros,
      campaign.target_roas.target_roas
    FROM campaign
    WHERE campaign.id = ${campaignId}
    LIMIT 1
  `)) as unknown as Array<{
    campaign?: {
      id?: string | number;
      name?: string;
      status?: string;
      bidding_strategy_type?: string;
      target_cpa?: { target_cpa_micros?: string | number };
      target_roas?: { target_roas?: string | number };
    };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.campaign) {
    throw new Error(`Campanha ${campaignId} não encontrada na conta ${customerId}.`);
  }

  const status = String(first.campaign.status ?? '');
  if (status === 'REMOVED' || status === '3') {
    throw new Error(`Campanha ${campaignId} está REMOVED — não é possível mutar.`);
  }

  const snapshot: CampaignBiddingSnapshot = {
    campaignId: String(first.campaign.id ?? campaignId),
    campaignName: String(first.campaign.name ?? ''),
    campaignStatus: status,
    biddingStrategyType: String(first.campaign.bidding_strategy_type ?? 'UNSPECIFIED'),
  };

  const tcpa = first.campaign.target_cpa?.target_cpa_micros;
  if (tcpa !== undefined && tcpa !== null) {
    snapshot.targetCpaMicros = Number(tcpa);
  }
  const troas = first.campaign.target_roas?.target_roas;
  if (troas !== undefined && troas !== null) {
    snapshot.targetRoas = Number(troas);
  }

  return snapshot;
}

/**
 * Updates the bidding strategy of a campaign.
 *
 * Strategy-specific fields (target_cpa, target_roas, manual_cpc, etc)
 * are mutually exclusive per Google Ads schema. We set ONE based on
 * the requested strategy and let the SDK handle the rest.
 */
export async function updateCampaignBidding(
  client: GoogleAdsApi,
  input: UpdateBiddingInput,
): Promise<UpdateBiddingResult> {
  const snapshot = await readCampaignBiddingSnapshot(
    client,
    input.refreshToken,
    input.customerId,
    input.campaignId,
    input.loginCustomerId,
  );

  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const resourceName = `customers/${stripDashes(input.customerId)}/campaigns/${input.campaignId}`;
  const paths: string[] = ['bidding_strategy_type'];
  const resource: Record<string, unknown> = {
    resource_name: resourceName,
    bidding_strategy_type: input.strategy.toUpperCase(),
  };

  if (input.strategy === 'target_cpa' && input.targetMicros !== undefined) {
    resource['target_cpa'] = { target_cpa_micros: input.targetMicros };
    paths.push('target_cpa.target_cpa_micros');
  } else if (input.strategy === 'target_roas' && input.targetRoas !== undefined) {
    resource['target_roas'] = { target_roas: input.targetRoas };
    paths.push('target_roas.target_roas');
  } else if (input.strategy === 'manual_cpc') {
    resource['manual_cpc'] = { enhanced_cpc_enabled: false };
    paths.push('manual_cpc.enhanced_cpc_enabled');
  }

  const operations: MutateOperation<resources.ICampaign>[] = [
    {
      entity: 'campaign',
      operation: 'update',
      resource: resource as resources.ICampaign,
      update_mask: { paths },
    } as MutateOperation<resources.ICampaign>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const resultEntry = response.mutate_operation_responses?.[0];
  const returnedResourceName =
    (resultEntry?.campaign as { resource_name?: string } | undefined)?.resource_name ?? resourceName;

  logger.debug(
    {
      campaignId: input.campaignId,
      customerId: input.customerId,
      dryRun: input.dryRun,
      beforeStrategy: snapshot.biddingStrategyType,
      afterStrategy: input.strategy,
    },
    'updateCampaignBidding completed',
  );

  const after = {
    strategy: input.strategy.toUpperCase(),
    ...(input.targetMicros !== undefined ? { targetMicros: input.targetMicros } : {}),
    ...(input.targetRoas !== undefined ? { targetRoas: input.targetRoas } : {}),
  };

  return {
    before: {
      strategy: snapshot.biddingStrategyType,
      ...(snapshot.targetCpaMicros !== undefined ? { targetMicros: snapshot.targetCpaMicros } : {}),
      ...(snapshot.targetRoas !== undefined ? { targetRoas: snapshot.targetRoas } : {}),
    },
    after: input.dryRun
      ? {
          strategy: snapshot.biddingStrategyType,
          ...(snapshot.targetCpaMicros !== undefined ? { targetMicros: snapshot.targetCpaMicros } : {}),
          ...(snapshot.targetRoas !== undefined ? { targetRoas: snapshot.targetRoas } : {}),
        }
      : after,
    resourceName: returnedResourceName,
    dryRun: Boolean(input.dryRun),
  };
}

function stripDashes(id: string): string {
  return id.replace(/-/g, '');
}

// ============================================================================
// Story 6.2 — Pause / Enable (campaign + ad_group status mutations)
// ============================================================================

export type EntityStatus = 'ENABLED' | 'PAUSED' | 'REMOVED' | 'UNKNOWN';

export interface CampaignStatusSnapshot {
  campaignId: string;
  campaignName: string;
  status: EntityStatus;
  biddingStrategyType?: string;
  startDate?: string;
}

export interface AdGroupStatusSnapshot {
  adGroupId: string;
  adGroupName: string;
  campaignId: string;
  campaignName: string;
  status: EntityStatus;
}

export interface SetStatusInput {
  customerId: string;
  targetId: string;
  newStatus: 'ENABLED' | 'PAUSED';
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface SetStatusResult {
  before: { status: EntityStatus };
  after: { status: EntityStatus };
  resourceName: string;
  dryRun: boolean;
}

function normalizeStatus(raw: unknown): EntityStatus {
  if (raw === undefined || raw === null) return 'UNKNOWN';
  const s = String(raw).toUpperCase();
  // Google Ads CampaignStatus enum: 2=ENABLED, 3=PAUSED, 4=REMOVED
  if (s === '2' || s === 'ENABLED') return 'ENABLED';
  if (s === '3' || s === 'PAUSED') return 'PAUSED';
  if (s === '4' || s === 'REMOVED') return 'REMOVED';
  return 'UNKNOWN';
}

/**
 * Reads campaign metadata for status mutation pre-fetch:
 * id, name, status, bidding_strategy_type, start_date.
 *
 * Throws if campaign not found.
 */
export async function readCampaignStatusSnapshot(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  campaignId: string,
  loginCustomerId?: string,
): Promise<CampaignStatusSnapshot> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.bidding_strategy_type
    FROM campaign
    WHERE campaign.id = ${campaignId}
    LIMIT 1
  `)) as unknown as Array<{
    campaign?: {
      id?: string | number;
      name?: string;
      status?: string | number;
      bidding_strategy_type?: string;
    };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.campaign) {
    throw new Error(`Campanha ${campaignId} não encontrada na conta ${customerId}.`);
  }

  const snapshot: CampaignStatusSnapshot = {
    campaignId: String(first.campaign.id ?? campaignId),
    campaignName: String(first.campaign.name ?? ''),
    status: normalizeStatus(first.campaign.status),
  };
  if (first.campaign.bidding_strategy_type) {
    snapshot.biddingStrategyType = String(first.campaign.bidding_strategy_type);
  }
  return snapshot;
}

/**
 * Reads ad_group metadata for status mutation pre-fetch.
 */
export async function readAdGroupStatusSnapshot(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  adGroupId: string,
  loginCustomerId?: string,
): Promise<AdGroupStatusSnapshot> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT
      ad_group.id,
      ad_group.name,
      ad_group.status,
      campaign.id,
      campaign.name
    FROM ad_group
    WHERE ad_group.id = ${adGroupId}
    LIMIT 1
  `)) as unknown as Array<{
    ad_group?: { id?: string | number; name?: string; status?: string | number };
    campaign?: { id?: string | number; name?: string };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.ad_group) {
    throw new Error(`Ad group ${adGroupId} não encontrado na conta ${customerId}.`);
  }

  return {
    adGroupId: String(first.ad_group.id ?? adGroupId),
    adGroupName: String(first.ad_group.name ?? ''),
    campaignId: String(first.campaign?.id ?? ''),
    campaignName: String(first.campaign?.name ?? ''),
    status: normalizeStatus(first.ad_group.status),
  };
}

/**
 * Sets campaign.status to ENABLED or PAUSED via mutateResources.
 *
 * Does NOT validate transitions (caller should check REMOVED + idempotency).
 * If dryRun=true, sends validate_only=true.
 */
export async function setCampaignStatus(
  client: GoogleAdsApi,
  input: SetStatusInput,
): Promise<SetStatusResult> {
  const snapshot = await readCampaignStatusSnapshot(
    client,
    input.refreshToken,
    input.customerId,
    input.targetId,
    input.loginCustomerId,
  );

  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const resourceName = `customers/${stripDashes(input.customerId)}/campaigns/${input.targetId}`;
  const operations: MutateOperation<resources.ICampaign>[] = [
    {
      entity: 'campaign',
      operation: 'update',
      resource: {
        resource_name: resourceName,
        status: input.newStatus,
      } as resources.ICampaign,
      update_mask: { paths: ['status'] },
    } as MutateOperation<resources.ICampaign>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const resultEntry = response.mutate_operation_responses?.[0];
  const returnedResourceName =
    (resultEntry?.campaign as { resource_name?: string } | undefined)?.resource_name ??
    resourceName;

  logger.debug(
    {
      campaignId: input.targetId,
      customerId: input.customerId,
      dryRun: input.dryRun,
      before: snapshot.status,
      after: input.newStatus,
    },
    'setCampaignStatus completed',
  );

  return {
    before: { status: snapshot.status },
    after: { status: input.dryRun ? snapshot.status : input.newStatus },
    resourceName: returnedResourceName,
    dryRun: Boolean(input.dryRun),
  };
}

/**
 * Sets ad_group.status to ENABLED or PAUSED via mutateResources.
 */
export async function setAdGroupStatus(
  client: GoogleAdsApi,
  input: SetStatusInput,
): Promise<SetStatusResult> {
  const snapshot = await readAdGroupStatusSnapshot(
    client,
    input.refreshToken,
    input.customerId,
    input.targetId,
    input.loginCustomerId,
  );

  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const resourceName = `customers/${stripDashes(input.customerId)}/adGroups/${input.targetId}`;
  const operations: MutateOperation<resources.IAdGroup>[] = [
    {
      entity: 'ad_group',
      operation: 'update',
      resource: {
        resource_name: resourceName,
        status: input.newStatus,
      } as resources.IAdGroup,
      update_mask: { paths: ['status'] },
    } as MutateOperation<resources.IAdGroup>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const resultEntry = response.mutate_operation_responses?.[0];
  const returnedResourceName =
    (resultEntry?.ad_group as { resource_name?: string } | undefined)?.resource_name ??
    resourceName;

  logger.debug(
    {
      adGroupId: input.targetId,
      customerId: input.customerId,
      dryRun: input.dryRun,
      before: snapshot.status,
      after: input.newStatus,
    },
    'setAdGroupStatus completed',
  );

  return {
    before: { status: snapshot.status },
    after: { status: input.dryRun ? snapshot.status : input.newStatus },
    resourceName: returnedResourceName,
    dryRun: Boolean(input.dryRun),
  };
}

// ============================================================================
// Story 6.3a — Campaign create (Search)
// ============================================================================

export interface CustomerContext {
  currencyCode: string;
  timeZone: string;
  isManager: boolean;
}

export interface CreateSearchCampaignInput {
  customerId: string;
  name: string;
  dailyMicros: number;
  bidding: BiddingStrategy;
  targetMicros?: number;
  targetRoas?: number;
  startDateYYYYMMDD: string;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface CreateCampaignResult {
  campaignResourceName: string;
  campaignId: string;
  budgetResourceName: string;
  budgetId: string;
  dryRun: boolean;
}

/**
 * Reads customer metadata (currency, timezone, manager flag) for the
 * pre-flight check before any campaign create.
 */
export async function readCustomerCurrencyAndTz(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  loginCustomerId?: string,
): Promise<CustomerContext> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT
      customer.currency_code,
      customer.time_zone,
      customer.manager
    FROM customer
    LIMIT 1
  `)) as unknown as Array<{
    customer?: { currency_code?: string; time_zone?: string; manager?: boolean };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.customer) {
    throw new Error(`Não foi possível ler metadata da conta ${customerId}.`);
  }

  return {
    currencyCode: String(first.customer.currency_code ?? 'BRL'),
    timeZone: String(first.customer.time_zone ?? 'America/Sao_Paulo'),
    isManager: Boolean(first.customer.manager),
  };
}

/**
 * Checks whether a campaign with the exact given name exists in the
 * account. Pre-create veto so operator gets a friendly error.
 */
export async function checkCampaignNameExists(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  name: string,
  loginCustomerId?: string,
): Promise<boolean> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const escaped = name.replace(/'/g, "\\'");
  const rows = (await customer.query(`
    SELECT campaign.id
    FROM campaign
    WHERE campaign.name = '${escaped}'
    LIMIT 1
  `)) as unknown as Array<{ campaign?: { id?: string | number } }>;

  return Array.isArray(rows) && rows.length > 0 && Boolean(rows[0]?.campaign?.id);
}

/**
 * Atomic create of CampaignBudget + Campaign (Search type).
 *
 * Uses temporary resource_name `.../campaignBudgets/-1` so Google resolves
 * the cross-reference atomically. Status is **always** PAUSED.
 */
export async function createSearchCampaign(
  client: GoogleAdsApi,
  input: CreateSearchCampaignInput,
): Promise<CreateCampaignResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const operations = buildSearchCampaignOperations({
    customerId: input.customerId,
    name: input.name,
    dailyMicros: input.dailyMicros,
    bidding: input.bidding,
    ...(input.targetMicros !== undefined ? { targetMicros: input.targetMicros } : {}),
    ...(input.targetRoas !== undefined ? { targetRoas: input.targetRoas } : {}),
    startDateYYYYMMDD: input.startDateYYYYMMDD,
  });

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
    partial_failure: false,
  });

  const budgetResult = response.mutate_operation_responses?.[0];
  const campaignResult = response.mutate_operation_responses?.[1];
  const cidStripped = input.customerId.replace(/-/g, '');

  const budgetResourceName =
    (budgetResult?.campaign_budget as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/campaignBudgets/-1`;
  const campaignResourceName =
    (campaignResult?.campaign as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/campaigns/-2`;

  const budgetId = budgetResourceName.split('/').pop() ?? '';
  const campaignId = campaignResourceName.split('/').pop() ?? '';

  logger.debug(
    {
      customerId: input.customerId,
      campaignId,
      budgetId,
      dryRun: input.dryRun,
    },
    'createSearchCampaign completed',
  );

  return {
    campaignResourceName,
    campaignId,
    budgetResourceName,
    budgetId,
    dryRun: Boolean(input.dryRun),
  };
}
