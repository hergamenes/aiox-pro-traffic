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
  buildDisplayCampaignOperations,
  buildPmaxCampaignOperations,
  type BiddingStrategy,
  type DisplayBiddingStrategy,
  type PmaxBiddingStrategy,
} from './campaign-builder.js';
import type { KeywordMatchType } from './keyword-validator.js';

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

// ============================================================================
// Story 6.3b — Campaign create (Display)
// ============================================================================

export interface CreateDisplayCampaignInput {
  customerId: string;
  name: string;
  dailyMicros: number;
  bidding: DisplayBiddingStrategy;
  targetMicros?: number;
  startDateYYYYMMDD: string;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

/**
 * Atomic create of CampaignBudget + Campaign (Display type).
 *
 * Same pattern as createSearchCampaign but Display-specific:
 *   advertising_channel_type = DISPLAY
 *   network_settings = content only
 *   Bidding restricted (no target_roas)
 *
 * Status is **always** PAUSED.
 */
export async function createDisplayCampaign(
  client: GoogleAdsApi,
  input: CreateDisplayCampaignInput,
): Promise<CreateCampaignResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const operations = buildDisplayCampaignOperations({
    customerId: input.customerId,
    name: input.name,
    dailyMicros: input.dailyMicros,
    bidding: input.bidding,
    ...(input.targetMicros !== undefined ? { targetMicros: input.targetMicros } : {}),
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
    { customerId: input.customerId, campaignId, budgetId, dryRun: input.dryRun },
    'createDisplayCampaign completed',
  );

  return {
    campaignResourceName,
    campaignId,
    budgetResourceName,
    budgetId,
    dryRun: Boolean(input.dryRun),
  };
}

// ============================================================================
// Story 6.3c — Campaign create (Performance Max)
// ============================================================================

export interface CreatePmaxCampaignInput {
  customerId: string;
  name: string;
  dailyMicros: number;
  finalUrl: string;
  bidding: PmaxBiddingStrategy;
  targetRoas?: number;
  startDateYYYYMMDD: string;
  endDateYYYYMMDD?: string;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface CreatePmaxResult extends CreateCampaignResult {
  assetGroupResourceName: string;
  assetGroupId: string;
}

/**
 * Counts ENABLED conversion actions in the customer.
 *
 * PMax requires at least 1 to be valid. Returns 0 if none found,
 * which the caller uses as a hard veto.
 */
export async function checkConversionActionsEnabled(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  loginCustomerId?: string,
): Promise<number> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT conversion_action.id
    FROM conversion_action
    WHERE conversion_action.status = 'ENABLED'
  `)) as unknown as Array<{ conversion_action?: { id?: string | number } }>;

  return Array.isArray(rows) ? rows.length : 0;
}

/**
 * Atomic create of CampaignBudget + Campaign + AssetGroup (PMax).
 *
 * All 3 entities created in PAUSED status. AssetGroup is empty skeleton —
 * actual assets attached via Story 6.6.
 *
 * **Prerequisite:** customer must have at least 1 conversion_action ENABLED
 * (checked separately by `checkConversionActionsEnabled` before calling).
 */
export async function createPmaxCampaign(
  client: GoogleAdsApi,
  input: CreatePmaxCampaignInput,
): Promise<CreatePmaxResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const operations = buildPmaxCampaignOperations({
    customerId: input.customerId,
    name: input.name,
    dailyMicros: input.dailyMicros,
    finalUrl: input.finalUrl,
    bidding: input.bidding,
    ...(input.targetRoas !== undefined ? { targetRoas: input.targetRoas } : {}),
    startDateYYYYMMDD: input.startDateYYYYMMDD,
    ...(input.endDateYYYYMMDD ? { endDateYYYYMMDD: input.endDateYYYYMMDD } : {}),
  });

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
    partial_failure: false,
  });

  const budgetResult = response.mutate_operation_responses?.[0];
  const campaignResult = response.mutate_operation_responses?.[1];
  const assetGroupResult = response.mutate_operation_responses?.[2];
  const cidStripped = input.customerId.replace(/-/g, '');

  const budgetResourceName =
    (budgetResult?.campaign_budget as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/campaignBudgets/-1`;
  const campaignResourceName =
    (campaignResult?.campaign as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/campaigns/-2`;
  const assetGroupResourceName =
    (assetGroupResult?.asset_group as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/assetGroups/-3`;

  const budgetId = budgetResourceName.split('/').pop() ?? '';
  const campaignId = campaignResourceName.split('/').pop() ?? '';
  const assetGroupId = assetGroupResourceName.split('/').pop() ?? '';

  logger.debug(
    {
      customerId: input.customerId,
      campaignId,
      budgetId,
      assetGroupId,
      dryRun: input.dryRun,
    },
    'createPmaxCampaign completed (atomic 3-entity)',
  );

  return {
    campaignResourceName,
    campaignId,
    budgetResourceName,
    budgetId,
    assetGroupResourceName,
    assetGroupId,
    dryRun: Boolean(input.dryRun),
  };
}

// ============================================================================
// Story 6.4 — Ad group + keyword management
// ============================================================================

export interface CampaignContext {
  campaignId: string;
  campaignName: string;
  advertisingChannelType: string;  // 'SEARCH' | 'DISPLAY' | 'PERFORMANCE_MAX' | etc
  status: EntityStatus;
  biddingStrategyType?: string;
}

export interface AdGroupContext {
  adGroupId: string;
  adGroupName: string;
  status: EntityStatus;
  campaign: CampaignContext;
}

export interface KeywordSnapshot {
  criterionId: string;
  adGroupId: string;
  keywordText: string;
  matchType: KeywordMatchType;
  cpcBidMicros: number;
  status: EntityStatus;
  campaign: CampaignContext;
}

export interface CreateAdGroupInput {
  customerId: string;
  campaignId: string;
  name: string;
  cpcBidMicros?: number;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface CreateAdGroupResult {
  adGroupResourceName: string;
  adGroupId: string;
  dryRun: boolean;
}

export interface AddKeywordInput {
  customerId: string;
  adGroupId: string;
  keywordText: string;
  matchType: KeywordMatchType;
  cpcBidMicros?: number;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface KeywordMutateResult {
  criterionResourceName: string;
  criterionId: string;
  dryRun: boolean;
}

/**
 * Reads campaign context for pre-fetch on ad-group/keyword mutations.
 */
export async function readCampaignContext(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  campaignId: string,
  loginCustomerId?: string,
): Promise<CampaignContext> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.advertising_channel_type,
      campaign.status,
      campaign.bidding_strategy_type
    FROM campaign
    WHERE campaign.id = ${campaignId}
    LIMIT 1
  `)) as unknown as Array<{
    campaign?: {
      id?: string | number;
      name?: string;
      advertising_channel_type?: string | number;
      status?: string | number;
      bidding_strategy_type?: string | number;
    };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.campaign) {
    throw new Error(`Campanha ${campaignId} não encontrada na conta ${customerId}.`);
  }

  return {
    campaignId: String(first.campaign.id ?? campaignId),
    campaignName: String(first.campaign.name ?? ''),
    advertisingChannelType: String(first.campaign.advertising_channel_type ?? ''),
    status: normalizeStatus(first.campaign.status),
    ...(first.campaign.bidding_strategy_type !== undefined
      ? { biddingStrategyType: String(first.campaign.bidding_strategy_type) }
      : {}),
  };
}

/**
 * Reads ad_group context including parent campaign — for keyword mutations.
 */
export async function readAdGroupContext(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  adGroupId: string,
  loginCustomerId?: string,
): Promise<AdGroupContext> {
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
      campaign.name,
      campaign.advertising_channel_type,
      campaign.status,
      campaign.bidding_strategy_type
    FROM ad_group
    WHERE ad_group.id = ${adGroupId}
    LIMIT 1
  `)) as unknown as Array<{
    ad_group?: { id?: string | number; name?: string; status?: string | number };
    campaign?: {
      id?: string | number;
      name?: string;
      advertising_channel_type?: string | number;
      status?: string | number;
      bidding_strategy_type?: string | number;
    };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.ad_group || !first.campaign) {
    throw new Error(`Ad group ${adGroupId} não encontrado na conta ${customerId}.`);
  }

  return {
    adGroupId: String(first.ad_group.id ?? adGroupId),
    adGroupName: String(first.ad_group.name ?? ''),
    status: normalizeStatus(first.ad_group.status),
    campaign: {
      campaignId: String(first.campaign.id ?? ''),
      campaignName: String(first.campaign.name ?? ''),
      advertisingChannelType: String(first.campaign.advertising_channel_type ?? ''),
      status: normalizeStatus(first.campaign.status),
      ...(first.campaign.bidding_strategy_type !== undefined
        ? { biddingStrategyType: String(first.campaign.bidding_strategy_type) }
        : {}),
    },
  };
}

/**
 * Reads a keyword (ad_group_criterion) snapshot for remove/update operations.
 */
export async function readKeywordSnapshot(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  criterionId: string,
  loginCustomerId?: string,
): Promise<KeywordSnapshot> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const rows = (await customer.query(`
    SELECT
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.cpc_bid_micros,
      ad_group_criterion.status,
      ad_group.id,
      ad_group.name,
      campaign.id,
      campaign.name,
      campaign.advertising_channel_type,
      campaign.status,
      campaign.bidding_strategy_type
    FROM ad_group_criterion
    WHERE ad_group_criterion.criterion_id = ${criterionId}
      AND ad_group_criterion.type = 'KEYWORD'
    LIMIT 1
  `)) as unknown as Array<{
    ad_group_criterion?: {
      criterion_id?: string | number;
      keyword?: { text?: string; match_type?: string };
      cpc_bid_micros?: string | number;
      status?: string | number;
    };
    ad_group?: { id?: string | number; name?: string };
    campaign?: {
      id?: string | number;
      name?: string;
      advertising_channel_type?: string | number;
      status?: string | number;
      bidding_strategy_type?: string | number;
    };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.ad_group_criterion) {
    throw new Error(`Keyword ${criterionId} não encontrada na conta ${customerId}.`);
  }

  return {
    criterionId: String(first.ad_group_criterion.criterion_id ?? criterionId),
    adGroupId: String(first.ad_group?.id ?? ''),
    keywordText: String(first.ad_group_criterion.keyword?.text ?? ''),
    matchType: (String(first.ad_group_criterion.keyword?.match_type ?? 'BROAD').toUpperCase() as KeywordMatchType),
    cpcBidMicros: Number(first.ad_group_criterion.cpc_bid_micros ?? 0),
    status: normalizeStatus(first.ad_group_criterion.status),
    campaign: {
      campaignId: String(first.campaign?.id ?? ''),
      campaignName: String(first.campaign?.name ?? ''),
      advertisingChannelType: String(first.campaign?.advertising_channel_type ?? ''),
      status: normalizeStatus(first.campaign?.status),
      ...(first.campaign?.bidding_strategy_type !== undefined
        ? { biddingStrategyType: String(first.campaign.bidding_strategy_type) }
        : {}),
    },
  };
}

/**
 * Creates a new ad_group inside an existing campaign (status PAUSED).
 */
export async function createAdGroup(
  client: GoogleAdsApi,
  input: CreateAdGroupInput,
): Promise<CreateAdGroupResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const cidStripped = input.customerId.replace(/-/g, '');
  const campaignResourceName = `customers/${cidStripped}/campaigns/${input.campaignId}`;

  const resource: Record<string, unknown> = {
    name: input.name,
    campaign: campaignResourceName,
    status: 'PAUSED',
    type: 'SEARCH_STANDARD',
  };
  if (input.cpcBidMicros !== undefined) {
    resource['cpc_bid_micros'] = input.cpcBidMicros;
  }

  const operations: MutateOperation<resources.IAdGroup>[] = [
    {
      entity: 'ad_group',
      operation: 'create',
      resource: resource as resources.IAdGroup,
    } as MutateOperation<resources.IAdGroup>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const result = response.mutate_operation_responses?.[0];
  const adGroupResourceName =
    (result?.ad_group as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/adGroups/-1`;
  const adGroupId = adGroupResourceName.split('/').pop() ?? '';

  return {
    adGroupResourceName,
    adGroupId,
    dryRun: Boolean(input.dryRun),
  };
}

/**
 * Adds a keyword to an existing ad_group via ad_group_criterion create.
 */
export async function addKeyword(
  client: GoogleAdsApi,
  input: AddKeywordInput,
): Promise<KeywordMutateResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const cidStripped = input.customerId.replace(/-/g, '');
  const adGroupResourceName = `customers/${cidStripped}/adGroups/${input.adGroupId}`;

  const resource: Record<string, unknown> = {
    ad_group: adGroupResourceName,
    status: 'ENABLED',
    keyword: {
      text: input.keywordText,
      match_type: input.matchType,
    },
  };
  if (input.cpcBidMicros !== undefined) {
    resource['cpc_bid_micros'] = input.cpcBidMicros;
  }

  const operations: MutateOperation<resources.IAdGroupCriterion>[] = [
    {
      entity: 'ad_group_criterion',
      operation: 'create',
      resource: resource as resources.IAdGroupCriterion,
    } as MutateOperation<resources.IAdGroupCriterion>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const result = response.mutate_operation_responses?.[0];
  const criterionResourceName =
    (result?.ad_group_criterion as { resource_name?: string } | undefined)?.resource_name ??
    `${adGroupResourceName}/criteria/-1`;
  // criterion resource_name format: customers/{cid}/adGroupCriteria/{adGroupId}~{criterionId}
  const tail = criterionResourceName.split('/').pop() ?? '';
  const criterionId = tail.includes('~') ? tail.split('~')[1] : tail;

  return {
    criterionResourceName,
    criterionId,
    dryRun: Boolean(input.dryRun),
  };
}

/**
 * Removes a keyword (ad_group_criterion) via 'remove' operation.
 */
export async function removeKeyword(
  client: GoogleAdsApi,
  customerId: string,
  adGroupId: string,
  criterionId: string,
  refreshToken: string,
  loginCustomerId?: string,
  dryRun?: boolean,
): Promise<KeywordMutateResult> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const cidStripped = customerId.replace(/-/g, '');
  const criterionResourceName = `customers/${cidStripped}/adGroupCriteria/${adGroupId}~${criterionId}`;

  const operations: MutateOperation<resources.IAdGroupCriterion>[] = [
    {
      entity: 'ad_group_criterion',
      operation: 'remove',
      resource: { resource_name: criterionResourceName } as resources.IAdGroupCriterion,
    } as MutateOperation<resources.IAdGroupCriterion>,
  ];

  await customer.mutateResources(operations, { validate_only: Boolean(dryRun) });

  return {
    criterionResourceName,
    criterionId,
    dryRun: Boolean(dryRun),
  };
}

/**
 * Updates a keyword's cpc_bid_micros.
 */
export async function updateKeywordBid(
  client: GoogleAdsApi,
  customerId: string,
  adGroupId: string,
  criterionId: string,
  newCpcBidMicros: number,
  refreshToken: string,
  loginCustomerId?: string,
  dryRun?: boolean,
): Promise<KeywordMutateResult> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const cidStripped = customerId.replace(/-/g, '');
  const criterionResourceName = `customers/${cidStripped}/adGroupCriteria/${adGroupId}~${criterionId}`;

  const operations: MutateOperation<resources.IAdGroupCriterion>[] = [
    {
      entity: 'ad_group_criterion',
      operation: 'update',
      resource: {
        resource_name: criterionResourceName,
        cpc_bid_micros: newCpcBidMicros,
      } as resources.IAdGroupCriterion,
      update_mask: { paths: ['cpc_bid_micros'] },
    } as MutateOperation<resources.IAdGroupCriterion>,
  ];

  await customer.mutateResources(operations, { validate_only: Boolean(dryRun) });

  return {
    criterionResourceName,
    criterionId,
    dryRun: Boolean(dryRun),
  };
}

// ============================================================================
// Story 6.5 — Ad create (RSA + RDA)
// ============================================================================

export interface CreateRsaInput {
  customerId: string;
  adGroupId: string;
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  path1?: string;
  path2?: string;
  pinnedHeadline1?: string;
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface CreateRdaInput {
  customerId: string;
  adGroupId: string;
  headlines: string[];
  longHeadline: string;
  descriptions: string[];
  businessName: string;
  finalUrl: string;
  logoAssetId: string;
  marketingImageAssetIds: string[];
  squareMarketingImageAssetIds?: string[];
  refreshToken: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

export interface CreateAdResult {
  adResourceName: string;
  adId: string;
  dryRun: boolean;
}

/**
 * Creates a Responsive Search Ad in an existing ad_group (PAUSED status).
 */
export async function createRsa(
  client: GoogleAdsApi,
  input: CreateRsaInput,
): Promise<CreateAdResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const cidStripped = input.customerId.replace(/-/g, '');
  const adGroupResourceName = `customers/${cidStripped}/adGroups/${input.adGroupId}`;

  const headlineAssets = input.headlines.map((text) => {
    const asset: Record<string, unknown> = { text };
    if (input.pinnedHeadline1 && text === input.pinnedHeadline1) {
      asset['pinned_field'] = 'HEADLINE_1';
    }
    return asset;
  });

  const descriptionAssets = input.descriptions.map((text) => ({ text }));

  const responsiveSearchAd: Record<string, unknown> = {
    headlines: headlineAssets,
    descriptions: descriptionAssets,
  };
  if (input.path1) responsiveSearchAd['path1'] = input.path1;
  if (input.path2) responsiveSearchAd['path2'] = input.path2;

  const resource: Record<string, unknown> = {
    ad_group: adGroupResourceName,
    status: 'PAUSED',
    ad: {
      final_urls: [input.finalUrl],
      responsive_search_ad: responsiveSearchAd,
    },
  };

  const operations: MutateOperation<resources.IAdGroupAd>[] = [
    {
      entity: 'ad_group_ad',
      operation: 'create',
      resource: resource as resources.IAdGroupAd,
    } as MutateOperation<resources.IAdGroupAd>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const result = response.mutate_operation_responses?.[0];
  const adResourceName =
    (result?.ad_group_ad as { resource_name?: string } | undefined)?.resource_name ??
    `${adGroupResourceName}/ads/-1`;
  const adId = adResourceName.split('/').pop() ?? '';

  logger.debug(
    { customerId: input.customerId, adGroupId: input.adGroupId, adId, dryRun: input.dryRun },
    'createRsa completed',
  );

  return { adResourceName, adId, dryRun: Boolean(input.dryRun) };
}

/**
 * Creates a Responsive Display Ad in an existing ad_group (PAUSED).
 * Requires asset IDs (upload via Story 6.6 first).
 */
export async function createRda(
  client: GoogleAdsApi,
  input: CreateRdaInput,
): Promise<CreateAdResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const cidStripped = input.customerId.replace(/-/g, '');
  const adGroupResourceName = `customers/${cidStripped}/adGroups/${input.adGroupId}`;

  // Asset references in RDA format: { asset: "customers/{cid}/assets/{id}" }
  const assetRef = (id: string): { asset: string } => ({
    asset: `customers/${cidStripped}/assets/${id}`,
  });

  const responsiveDisplayAd: Record<string, unknown> = {
    headlines: input.headlines.map((text) => ({ text })),
    long_headline: { text: input.longHeadline },
    descriptions: input.descriptions.map((text) => ({ text })),
    business_name: input.businessName,
    logo_images: [assetRef(input.logoAssetId)],
    marketing_images: input.marketingImageAssetIds.map(assetRef),
  };

  if (input.squareMarketingImageAssetIds && input.squareMarketingImageAssetIds.length > 0) {
    responsiveDisplayAd['square_marketing_images'] =
      input.squareMarketingImageAssetIds.map(assetRef);
  }

  const resource: Record<string, unknown> = {
    ad_group: adGroupResourceName,
    status: 'PAUSED',
    ad: {
      final_urls: [input.finalUrl],
      responsive_display_ad: responsiveDisplayAd,
    },
  };

  const operations: MutateOperation<resources.IAdGroupAd>[] = [
    {
      entity: 'ad_group_ad',
      operation: 'create',
      resource: resource as resources.IAdGroupAd,
    } as MutateOperation<resources.IAdGroupAd>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const result = response.mutate_operation_responses?.[0];
  const adResourceName =
    (result?.ad_group_ad as { resource_name?: string } | undefined)?.resource_name ??
    `${adGroupResourceName}/ads/-1`;
  const adId = adResourceName.split('/').pop() ?? '';

  logger.debug(
    { customerId: input.customerId, adGroupId: input.adGroupId, adId, dryRun: input.dryRun },
    'createRda completed',
  );

  return { adResourceName, adId, dryRun: Boolean(input.dryRun) };
}

/**
 * Checks that the given asset IDs all exist in the customer account.
 * Returns the list of MISSING IDs (empty if all present).
 */
export async function findMissingAssetIds(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  assetIds: string[],
  loginCustomerId?: string,
): Promise<string[]> {
  if (assetIds.length === 0) return [];

  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const inList = assetIds.map((id) => Number(id)).filter((n) => Number.isFinite(n)).join(',');
  if (!inList) return assetIds;

  const rows = (await customer.query(`
    SELECT asset.id
    FROM asset
    WHERE asset.id IN (${inList})
  `)) as unknown as Array<{ asset?: { id?: string | number } }>;

  const found = new Set<string>(
    (rows ?? []).map((r) => String(r.asset?.id ?? '')).filter((id) => id !== ''),
  );
  return assetIds.filter((id) => !found.has(id));
}

// ============================================================================
// Story 6.6 — Asset upload (image / video / text)
// ============================================================================

export interface UploadImageAssetInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  name: string;
  type: 'IMAGE' | 'LOGO_IMAGE';
  imageBuffer: Buffer;
  mimeType: 'IMAGE_PNG' | 'IMAGE_JPEG';
  width: number;
  height: number;
  dryRun?: boolean;
}

export interface UploadVideoAssetInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  name: string;
  youtubeVideoId: string;
  dryRun?: boolean;
}

export interface UploadTextAssetInput {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
  name: string;
  text: string;
  dryRun?: boolean;
}

export interface UploadAssetResult {
  resourceName: string;
  assetId: string;
  dryRun: boolean;
}

/**
 * Uploads an image asset (IMAGE or LOGO_IMAGE) to the Google Ads account.
 * Image binary is base64-encoded in the request.
 */
export async function uploadImageAsset(
  client: GoogleAdsApi,
  input: UploadImageAssetInput,
): Promise<UploadAssetResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const resource: Record<string, unknown> = {
    type: input.type,
    name: input.name,
    image_asset: {
      data: input.imageBuffer.toString('base64'),
      file_size: input.imageBuffer.length,
      mime_type: input.mimeType,
      full_size: {
        width_pixels: input.width,
        height_pixels: input.height,
      },
    },
  };

  const operations: MutateOperation<resources.IAsset>[] = [
    {
      entity: 'asset',
      operation: 'create',
      resource: resource as resources.IAsset,
    } as MutateOperation<resources.IAsset>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const result = response.mutate_operation_responses?.[0];
  const cidStripped = input.customerId.replace(/-/g, '');
  const resourceName =
    (result?.asset as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/assets/-1`;
  const assetId = resourceName.split('/').pop() ?? '';

  logger.debug(
    { customerId: input.customerId, assetId, name: input.name, dryRun: input.dryRun },
    'uploadImageAsset completed',
  );

  return { resourceName, assetId, dryRun: Boolean(input.dryRun) };
}

/**
 * Creates a YouTube video asset (references an existing YT video; does
 * NOT upload video bytes — Google requires the video to be public on YT).
 */
export async function uploadVideoAsset(
  client: GoogleAdsApi,
  input: UploadVideoAssetInput,
): Promise<UploadAssetResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const resource: Record<string, unknown> = {
    type: 'YOUTUBE_VIDEO',
    name: input.name,
    youtube_video_asset: {
      youtube_video_id: input.youtubeVideoId,
    },
  };

  const operations: MutateOperation<resources.IAsset>[] = [
    {
      entity: 'asset',
      operation: 'create',
      resource: resource as resources.IAsset,
    } as MutateOperation<resources.IAsset>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const result = response.mutate_operation_responses?.[0];
  const cidStripped = input.customerId.replace(/-/g, '');
  const resourceName =
    (result?.asset as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/assets/-1`;
  const assetId = resourceName.split('/').pop() ?? '';

  return { resourceName, assetId, dryRun: Boolean(input.dryRun) };
}

/**
 * Creates a TEXT asset for use in ad copy library.
 */
export async function uploadTextAsset(
  client: GoogleAdsApi,
  input: UploadTextAssetInput,
): Promise<UploadAssetResult> {
  const customer = getCustomer(client, {
    customerId: input.customerId,
    refreshToken: input.refreshToken,
    ...(input.loginCustomerId ? { loginCustomerId: input.loginCustomerId } : {}),
  });

  const resource: Record<string, unknown> = {
    type: 'TEXT',
    name: input.name,
    text_asset: { text: input.text },
  };

  const operations: MutateOperation<resources.IAsset>[] = [
    {
      entity: 'asset',
      operation: 'create',
      resource: resource as resources.IAsset,
    } as MutateOperation<resources.IAsset>,
  ];

  const response = await customer.mutateResources(operations, {
    validate_only: Boolean(input.dryRun),
  });

  const result = response.mutate_operation_responses?.[0];
  const cidStripped = input.customerId.replace(/-/g, '');
  const resourceName =
    (result?.asset as { resource_name?: string } | undefined)?.resource_name ??
    `customers/${cidStripped}/assets/-1`;
  const assetId = resourceName.split('/').pop() ?? '';

  return { resourceName, assetId, dryRun: Boolean(input.dryRun) };
}

export interface AssetListInfo {
  assetId: string;
  resourceName: string;
  type: string;
  name?: string;
  width?: number;
  height?: number;
  youtubeVideoId?: string;
  text?: string;
}

/**
 * Lists assets in the customer account (read-only).
 * Filter by type or pass 'ALL'.
 */
export async function listAssets(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  type: 'IMAGE' | 'VIDEO' | 'TEXT' | 'ALL',
  loginCustomerId?: string,
): Promise<AssetListInfo[]> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  let typeFilter = '';
  if (type === 'IMAGE') typeFilter = "WHERE asset.type IN ('IMAGE', 'LOGO_IMAGE')";
  else if (type === 'VIDEO') typeFilter = "WHERE asset.type = 'YOUTUBE_VIDEO'";
  else if (type === 'TEXT') typeFilter = "WHERE asset.type = 'TEXT'";

  const rows = (await customer.query(`
    SELECT
      asset.id,
      asset.resource_name,
      asset.type,
      asset.name,
      asset.image_asset.full_size.width_pixels,
      asset.image_asset.full_size.height_pixels,
      asset.youtube_video_asset.youtube_video_id,
      asset.text_asset.text
    FROM asset
    ${typeFilter}
    LIMIT 500
  `)) as unknown as Array<{
    asset?: {
      id?: string | number;
      resource_name?: string;
      type?: string | number;
      name?: string;
      image_asset?: {
        full_size?: { width_pixels?: number; height_pixels?: number };
      };
      youtube_video_asset?: { youtube_video_id?: string };
      text_asset?: { text?: string };
    };
  }>;

  return (rows ?? []).map((r) => {
    const a = r.asset ?? {};
    const info: AssetListInfo = {
      assetId: String(a.id ?? ''),
      resourceName: String(a.resource_name ?? ''),
      type: String(a.type ?? ''),
    };
    if (a.name) info.name = String(a.name);
    const w = a.image_asset?.full_size?.width_pixels;
    const h = a.image_asset?.full_size?.height_pixels;
    if (w) info.width = Number(w);
    if (h) info.height = Number(h);
    if (a.youtube_video_asset?.youtube_video_id) {
      info.youtubeVideoId = String(a.youtube_video_asset.youtube_video_id);
    }
    if (a.text_asset?.text) info.text = String(a.text_asset.text);
    return info;
  });
}

// ============================================================================
// Story 6.7 — Campaign delete (REMOVE — IRREVERSIBLE)
// ============================================================================

export interface CampaignRemovalSnapshot {
  campaignId: string;
  campaignName: string;
  status: EntityStatus;
  budgetMicros: number;
  biddingStrategy: string;
  adGroupCount: number;
  adCount: number;
  spend90dMicros: number;
  spend7dMicros: number;
  spend24hMicros: number;
  currencyCode: string;
}

export interface AdGroupRemovalSnapshot {
  adGroupId: string;
  adGroupName: string;
  status: EntityStatus;
  campaignId: string;
  campaignName: string;
  adCount: number;
  keywordCount: number;
  currencyCode: string;
}

export interface RemoveResult {
  resourceName: string;
  cascade: { adGroupCount: number; adCount: number };
  dryRun: boolean;
}

/**
 * Pre-removal snapshot — reads everything needed for the triple-confirm
 * UX and the forensic audit log.
 *
 * Throws if campaign is already REMOVED (idempotent veto handled by caller).
 */
export async function readCampaignRemovalSnapshot(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  campaignId: string,
  loginCustomerId?: string,
): Promise<CampaignRemovalSnapshot> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  // Main snapshot (campaign + budget + bidding)
  const mainRows = (await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.bidding_strategy_type,
      campaign_budget.amount_micros,
      customer.currency_code
    FROM campaign
    WHERE campaign.id = ${campaignId}
    LIMIT 1
  `)) as unknown as Array<{
    campaign?: {
      id?: string | number;
      name?: string;
      status?: string | number;
      bidding_strategy_type?: string | number;
    };
    campaign_budget?: { amount_micros?: string | number };
    customer?: { currency_code?: string };
  }>;

  const first = Array.isArray(mainRows) && mainRows.length > 0 ? mainRows[0] : null;
  if (!first?.campaign) {
    throw new Error(`Campanha ${campaignId} não encontrada na conta ${customerId}.`);
  }

  // Ad group + ad counts (cascade-aware) — use ad_group + ad_group_ad queries
  const adGroupRows = (await customer.query(`
    SELECT ad_group.id
    FROM ad_group
    WHERE ad_group.campaign = 'customers/${customerId.replace(/-/g, '')}/campaigns/${campaignId}'
      AND ad_group.status != 'REMOVED'
  `)) as unknown as Array<{ ad_group?: { id?: string | number } }>;
  const adGroupCount = Array.isArray(adGroupRows) ? adGroupRows.length : 0;

  const adRows = (await customer.query(`
    SELECT ad_group_ad.ad.id
    FROM ad_group_ad
    WHERE ad_group_ad.ad_group IN (
      SELECT ad_group.resource_name FROM ad_group
      WHERE ad_group.campaign = 'customers/${customerId.replace(/-/g, '')}/campaigns/${campaignId}'
    )
      AND ad_group_ad.status != 'REMOVED'
  `).catch(() => [])) as unknown as Array<unknown>;
  const adCount = Array.isArray(adRows) ? adRows.length : 0;

  // Spend windows — 3 GAQL queries for 90d, 7d, 24h
  const spend = async (days: number): Promise<number> => {
    try {
      const rows = (await customer.query(`
        SELECT metrics.cost_micros
        FROM campaign
        WHERE campaign.id = ${campaignId}
          AND segments.date DURING LAST_${days === 1 ? '24_HOURS' : `${days}_DAYS`}
      `)) as unknown as Array<{ metrics?: { cost_micros?: string | number } }>;
      const total = (rows ?? []).reduce(
        (acc, r) => acc + Number(r.metrics?.cost_micros ?? 0),
        0,
      );
      return total;
    } catch {
      return 0;
    }
  };

  const [spend90d, spend7d, spend24h] = await Promise.all([
    spend(90),
    spend(7),
    spend(1), // mapped to LAST_24_HOURS
  ]);

  return {
    campaignId: String(first.campaign.id ?? campaignId),
    campaignName: String(first.campaign.name ?? ''),
    status: normalizeStatus(first.campaign.status),
    budgetMicros: Number(first.campaign_budget?.amount_micros ?? 0),
    biddingStrategy: String(first.campaign.bidding_strategy_type ?? ''),
    adGroupCount,
    adCount,
    spend90dMicros: spend90d,
    spend7dMicros: spend7d,
    spend24hMicros: spend24h,
    currencyCode: String(first.customer?.currency_code ?? 'BRL'),
  };
}

/**
 * Pre-removal snapshot for ad_group — simpler than campaign.
 */
export async function readAdGroupRemovalSnapshot(
  client: GoogleAdsApi,
  refreshToken: string,
  customerId: string,
  adGroupId: string,
  loginCustomerId?: string,
): Promise<AdGroupRemovalSnapshot> {
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
      campaign.name,
      customer.currency_code
    FROM ad_group
    WHERE ad_group.id = ${adGroupId}
    LIMIT 1
  `)) as unknown as Array<{
    ad_group?: { id?: string | number; name?: string; status?: string | number };
    campaign?: { id?: string | number; name?: string };
    customer?: { currency_code?: string };
  }>;

  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first?.ad_group) {
    throw new Error(`Ad group ${adGroupId} não encontrado na conta ${customerId}.`);
  }

  // Ad + keyword counts
  const adRows = (await customer.query(`
    SELECT ad_group_ad.ad.id
    FROM ad_group_ad
    WHERE ad_group_ad.ad_group = 'customers/${customerId.replace(/-/g, '')}/adGroups/${adGroupId}'
      AND ad_group_ad.status != 'REMOVED'
  `).catch(() => [])) as unknown as Array<unknown>;
  const keywordRows = (await customer.query(`
    SELECT ad_group_criterion.criterion_id
    FROM ad_group_criterion
    WHERE ad_group_criterion.ad_group = 'customers/${customerId.replace(/-/g, '')}/adGroups/${adGroupId}'
      AND ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.status != 'REMOVED'
  `).catch(() => [])) as unknown as Array<unknown>;

  return {
    adGroupId: String(first.ad_group.id ?? adGroupId),
    adGroupName: String(first.ad_group.name ?? ''),
    status: normalizeStatus(first.ad_group.status),
    campaignId: String(first.campaign?.id ?? ''),
    campaignName: String(first.campaign?.name ?? ''),
    adCount: Array.isArray(adRows) ? adRows.length : 0,
    keywordCount: Array.isArray(keywordRows) ? keywordRows.length : 0,
    currencyCode: String(first.customer?.currency_code ?? 'BRL'),
  };
}

/**
 * Removes a campaign (status → REMOVED).
 * IRREVERSIBLE — Google does not support restore from removed state.
 * Caller MUST have shown triple-confirm UX before invoking.
 */
export async function removeCampaign(
  client: GoogleAdsApi,
  customerId: string,
  campaignId: string,
  refreshToken: string,
  loginCustomerId?: string,
  dryRun?: boolean,
): Promise<RemoveResult> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const cidStripped = customerId.replace(/-/g, '');
  const resourceName = `customers/${cidStripped}/campaigns/${campaignId}`;

  const operations: MutateOperation<resources.ICampaign>[] = [
    {
      entity: 'campaign',
      operation: 'remove',
      resource: { resource_name: resourceName } as resources.ICampaign,
    } as MutateOperation<resources.ICampaign>,
  ];

  await customer.mutateResources(operations, { validate_only: Boolean(dryRun) });

  logger.debug(
    { customerId, campaignId, dryRun },
    'removeCampaign completed (campaign + cascade REMOVED)',
  );

  // Cascade counts come from the snapshot (read separately by caller)
  return {
    resourceName,
    cascade: { adGroupCount: 0, adCount: 0 },
    dryRun: Boolean(dryRun),
  };
}

/**
 * Removes an ad_group (status → REMOVED). Irreversible.
 */
export async function removeAdGroup(
  client: GoogleAdsApi,
  customerId: string,
  adGroupId: string,
  refreshToken: string,
  loginCustomerId?: string,
  dryRun?: boolean,
): Promise<RemoveResult> {
  const customer = getCustomer(client, {
    customerId,
    refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const cidStripped = customerId.replace(/-/g, '');
  const resourceName = `customers/${cidStripped}/adGroups/${adGroupId}`;

  const operations: MutateOperation<resources.IAdGroup>[] = [
    {
      entity: 'ad_group',
      operation: 'remove',
      resource: { resource_name: resourceName } as resources.IAdGroup,
    } as MutateOperation<resources.IAdGroup>,
  ];

  await customer.mutateResources(operations, { validate_only: Boolean(dryRun) });

  return {
    resourceName,
    cascade: { adGroupCount: 0, adCount: 0 },
    dryRun: Boolean(dryRun),
  };
}
