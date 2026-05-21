import type { InsightsLevel, ParsedMetrics, DateRange } from '../types/insights.js';

interface RawRow {
  customer?: { id?: string | number; descriptive_name?: string };
  campaign?: { id?: string | number; name?: string };
  ad_group?: { id?: string | number; name?: string };
  ad_group_ad?: { ad?: { id?: string | number; name?: string } };
  ad_group_criterion?: {
    criterion_id?: string | number;
    keyword?: { text?: string };
  };
  metrics?: {
    cost_micros?: string | number;
    impressions?: string | number;
    clicks?: string | number;
    ctr?: string | number;
    average_cpc?: string | number;
    conversions?: string | number;
    conversions_value?: string | number;
  };
  segments?: { date?: string };
}

function toNumber(value: string | number | undefined): number {
  if (value === undefined || value === null || value === '') return 0;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function microsToCurrency(micros: string | number | undefined): number {
  return toNumber(micros) / 1_000_000;
}

interface ExtractedIdentity {
  id: string;
  name: string;
}

function extractIdentity(row: RawRow, level: InsightsLevel): ExtractedIdentity {
  switch (level) {
    case 'account':
      return {
        id: String(row.customer?.id ?? ''),
        name: String(row.customer?.descriptive_name ?? ''),
      };
    case 'campaign':
      return {
        id: String(row.campaign?.id ?? ''),
        name: String(row.campaign?.name ?? ''),
      };
    case 'ad_group':
      return {
        id: String(row.ad_group?.id ?? ''),
        name: String(row.ad_group?.name ?? ''),
      };
    case 'ad':
      return {
        id: String(row.ad_group_ad?.ad?.id ?? ''),
        name: String(row.ad_group_ad?.ad?.name ?? ''),
      };
    case 'keyword':
      return {
        id: String(row.ad_group_criterion?.criterion_id ?? ''),
        name: String(row.ad_group_criterion?.keyword?.text ?? ''),
      };
  }
}

export interface ParseRowContext {
  level: InsightsLevel;
  dateRange: DateRange;
  currencyCode?: string;
}

export function parseRow(row: unknown, ctx: ParseRowContext): ParsedMetrics {
  const raw = (row ?? {}) as RawRow;
  const identity = extractIdentity(raw, ctx.level);
  const metrics = raw.metrics ?? {};

  const spend = microsToCurrency(metrics.cost_micros);
  const impressions = toNumber(metrics.impressions);
  const clicks = toNumber(metrics.clicks);
  const ctr = toNumber(metrics.ctr);
  const cpc = microsToCurrency(metrics.average_cpc);
  const conversions = toNumber(metrics.conversions);
  const conversionsValue = toNumber(metrics.conversions_value);

  const base: ParsedMetrics = {
    id: identity.id,
    name: identity.name,
    level: ctx.level,
    spend,
    impressions,
    clicks,
    ctr,
    cpc,
    conversions,
    date_range: ctx.dateRange,
  };

  if (conversions > 0 && spend > 0) {
    base.cpa = spend / conversions;
  }
  if (conversionsValue > 0 && spend > 0) {
    base.roas = conversionsValue / spend;
  }
  if (ctx.currencyCode) {
    base.currencyCode = ctx.currencyCode;
  }

  return base;
}

export function parseRows(rows: unknown[], ctx: ParseRowContext): ParsedMetrics[] {
  return rows.map((r) => parseRow(r, ctx));
}
