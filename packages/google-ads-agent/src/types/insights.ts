/**
 * Canonical insights types for google-ads-agent.
 *
 * Schema declared by architecture spec §8 (docs/architecture/google-ads-agent.md).
 * Squad consumers (traffic-google) should treat this as the authoritative shape.
 *
 * Note on Meta parity: meta-ads-agent uses level-nominal keys (campaignName,
 * adsetId, etc) and 22+ metrics. Our shape uses a flatter, level-agnostic
 * shape ({ id, name, level, ...metrics }) so that 5 levels (account/campaign/
 * ad_group/ad/keyword) can share the same emitted structure. Squad consumers
 * needing cross-platform comparison should normalize via an adapter.
 */

import { z } from 'zod';

export type InsightsPeriod = '7d' | '14d' | '30d' | 'custom';

export type InsightsLevel = 'account' | 'campaign' | 'ad_group' | 'ad' | 'keyword';

export interface InsightsFilter {
  campaignId?: string;
  tag?: string;
}

export interface InsightsParams {
  customerId: string;
  period: InsightsPeriod;
  from?: string;
  to?: string;
  level: InsightsLevel;
  filter?: InsightsFilter;
  loginCustomerId?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

/**
 * Canonical per-row output. Keys conform to architecture spec §8.
 *
 * Omitted keys mean the metric is not applicable for that row (e.g. `cpa`
 * is omitted when `conversions === 0`, `roas` when conversions_value is
 * absent). Parser MUST NOT emit nulls — omit instead, for parity with
 * meta-ads parser behavior.
 */
export interface ParsedMetrics {
  id: string;
  name: string;
  level: InsightsLevel;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa?: number;
  roas?: number;
  date_range: DateRange;
  currencyCode?: string;
}

// Zod schemas

export const dateRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const insightsParamsSchema = z.object({
  customerId: z.string().min(10),
  period: z.enum(['7d', '14d', '30d', 'custom']).default('7d'),
  from: z.string().optional(),
  to: z.string().optional(),
  level: z.enum(['account', 'campaign', 'ad_group', 'ad', 'keyword']).default('campaign'),
  filter: z
    .object({
      campaignId: z.string().optional(),
      tag: z.string().optional(),
    })
    .optional(),
  loginCustomerId: z.string().optional(),
});

export const parsedMetricsSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['account', 'campaign', 'ad_group', 'ad', 'keyword']),
  spend: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  ctr: z.number(),
  cpc: z.number(),
  conversions: z.number(),
  cpa: z.number().optional(),
  roas: z.number().optional(),
  date_range: dateRangeSchema,
  currencyCode: z.string().optional(),
});

/** Keys required in every ParsedMetrics output — used for schema parity test. */
export const REQUIRED_PARSED_METRICS_KEYS = [
  'id',
  'name',
  'level',
  'spend',
  'impressions',
  'clicks',
  'ctr',
  'cpc',
  'conversions',
  'date_range',
] as const;

/** Optional keys (omitted when not applicable). */
export const OPTIONAL_PARSED_METRICS_KEYS = ['cpa', 'roas', 'currencyCode'] as const;
