/**
 * Pure builders for Google Ads campaign mutation operations (Story 6.3a).
 *
 * No SDK runtime imports — only types. These helpers produce the operation
 * arrays consumed by `customer.mutateResources()` in mutations.ts.
 */

import type { resources, MutateOperation } from 'google-ads-api';

export type BiddingStrategy =
  | 'maximize_conversions'
  | 'target_cpa'
  | 'target_roas'
  | 'manual_cpc'
  | 'maximize_conversion_value';

export interface BuildSearchCampaignOperationsInput {
  customerId: string;
  name: string;
  dailyMicros: number;
  bidding: BiddingStrategy;
  targetMicros?: number;
  targetRoas?: number;
  startDateYYYYMMDD: string;
}

export interface BiddingValidation {
  ok: boolean;
  error?: string;
}

/**
 * Validates that bidding strategy + target arguments are coherent.
 *
 *   target_cpa requires targetMicros (number > 0)
 *   target_roas requires targetRoas (number, decimal 0.0-100.0)
 *   others REJECT target arguments (must be undefined)
 */
export function validateBiddingStrategy(
  strategy: BiddingStrategy,
  targetMicros?: number,
  targetRoas?: number,
): BiddingValidation {
  if (strategy === 'target_cpa') {
    if (targetMicros === undefined) {
      return { ok: false, error: 'Estratégia target_cpa exige --target (CPA em moeda da conta).' };
    }
    if (targetMicros <= 0) {
      return { ok: false, error: 'target_cpa --target deve ser maior que zero.' };
    }
    return { ok: true };
  }

  if (strategy === 'target_roas') {
    if (targetRoas === undefined) {
      return { ok: false, error: 'Estratégia target_roas exige --target (ROAS decimal, ex: 2.5).' };
    }
    if (targetRoas <= 0) {
      return { ok: false, error: 'target_roas --target deve ser decimal maior que zero.' };
    }
    return { ok: true };
  }

  // maximize_conversions, manual_cpc, maximize_conversion_value reject targets
  if (targetMicros !== undefined || targetRoas !== undefined) {
    return {
      ok: false,
      error: `Estratégia ${strategy} NÃO aceita --target. Use apenas com target_cpa ou target_roas.`,
    };
  }
  return { ok: true };
}

/**
 * Resolves a start_date to the Google YYYYMMDD format.
 *
 * If `input` is undefined, returns today in the supplied timeZone.
 * Validates input format YYYY-MM-DD and converts to YYYYMMDD.
 *
 * Throws if input is malformed.
 */
export function parseStartDate(input: string | undefined, timeZone: string): string {
  if (input === undefined || input.trim() === '') {
    // Today in the given timeZone, formatted as YYYYMMDD
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = fmt.formatToParts(now);
    const year = parts.find((p) => p.type === 'year')?.value ?? '2026';
    const month = parts.find((p) => p.type === 'month')?.value ?? '01';
    const day = parts.find((p) => p.type === 'day')?.value ?? '01';
    return `${year}${month}${day}`;
  }

  const trimmed = input.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`Data inválida: '${input}'. Use YYYY-MM-DD (ex: 2026-05-22).`);
  }
  const [, year, month, day] = match;

  // Sanity check
  const dateObj = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (Number.isNaN(dateObj.getTime())) {
    throw new Error(`Data inválida: '${input}'.`);
  }

  return `${year}${month}${day}`;
}

/**
 * Builds the bidding-strategy-specific fields for the Campaign resource.
 *
 * Exactly one of these mutually exclusive fields is returned:
 *   { maximize_conversions: {} }
 *   { target_cpa: { target_cpa_micros } }
 *   { target_roas: { target_roas } }
 *   { manual_cpc: { enhanced_cpc_enabled: false } }
 *   { maximize_conversion_value: {} }
 */
export function buildBiddingFields(
  strategy: BiddingStrategy,
  targetMicros?: number,
  targetRoas?: number,
): Record<string, unknown> {
  switch (strategy) {
    case 'maximize_conversions':
      return { maximize_conversions: {} };
    case 'target_cpa':
      return {
        target_cpa: {
          target_cpa_micros: targetMicros ?? 0,
        },
      };
    case 'target_roas':
      return {
        target_roas: {
          target_roas: targetRoas ?? 0,
        },
      };
    case 'manual_cpc':
      return { manual_cpc: { enhanced_cpc_enabled: false } };
    case 'maximize_conversion_value':
      return { maximize_conversion_value: {} };
    default: {
      const exhaustive: never = strategy;
      throw new Error(`Estratégia de bidding desconhecida: ${exhaustive as string}`);
    }
  }
}

/**
 * Builds the atomic mutateResources operations for creating a Search
 * campaign (CampaignBudget + Campaign).
 *
 * Uses temporary resource_names (-1) so the Google API resolves both
 * atomically. If anything fails, neither entity is created.
 *
 * **Status is ALWAYS PAUSED** — anti-burn-protection (Story 6.3a R6 veto).
 */
export function buildSearchCampaignOperations(
  input: BuildSearchCampaignOperationsInput,
): MutateOperation<resources.ICampaignBudget | resources.ICampaign>[] {
  const { customerId, name, dailyMicros, bidding, targetMicros, targetRoas, startDateYYYYMMDD } = input;
  const cidStripped = customerId.replace(/-/g, '');
  const budgetResourceName = `customers/${cidStripped}/campaignBudgets/-1`;

  const operations: MutateOperation<resources.ICampaignBudget | resources.ICampaign>[] = [
    {
      entity: 'campaign_budget',
      operation: 'create',
      resource: {
        resource_name: budgetResourceName,
        name: `${name} Budget`,
        amount_micros: dailyMicros,
        delivery_method: 'STANDARD',
        explicitly_shared: false,
      } as resources.ICampaignBudget,
    } as MutateOperation<resources.ICampaignBudget>,
    {
      entity: 'campaign',
      operation: 'create',
      resource: {
        name,
        advertising_channel_type: 'SEARCH',
        status: 'PAUSED', // NUNCA ENABLED nesta story (R6 veto)
        campaign_budget: budgetResourceName,
        network_settings: {
          target_google_search: true,
          target_search_network: true,
          target_content_network: false,
          target_partner_search_network: false,
        },
        start_date: startDateYYYYMMDD,
        // EU Digital Services Act compliance (required since 2023)
        contains_eu_political_advertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
        ...buildBiddingFields(bidding, targetMicros, targetRoas),
      } as resources.ICampaign,
    } as MutateOperation<resources.ICampaign>,
  ];

  return operations;
}
