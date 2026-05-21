/**
 * GAQL (Google Ads Query Language) builder.
 *
 * Internal module. Knowledge of GAQL syntax is encapsulated here so
 * the adapter and the rest of the codebase don't have to learn it.
 */

import type { InsightsLevel, InsightsParams } from '../types/insights.js';
import { AppError } from '../errors/types.js';

interface EntityShape {
  resource: string;
  idField: string;
  nameField: string;
}

const ENTITY_BY_LEVEL: Record<InsightsLevel, EntityShape> = {
  account: {
    resource: 'customer',
    idField: 'customer.id',
    nameField: 'customer.descriptive_name',
  },
  campaign: {
    resource: 'campaign',
    idField: 'campaign.id',
    nameField: 'campaign.name',
  },
  ad_group: {
    resource: 'ad_group',
    idField: 'ad_group.id',
    nameField: 'ad_group.name',
  },
  ad: {
    resource: 'ad_group_ad',
    idField: 'ad_group_ad.ad.id',
    nameField: 'ad_group_ad.ad.name',
  },
  keyword: {
    resource: 'ad_group_criterion',
    idField: 'ad_group_criterion.criterion_id',
    nameField: 'ad_group_criterion.keyword.text',
  },
};

const PERIOD_DURING: Record<Exclude<InsightsParams['period'], 'custom'>, string> = {
  '7d': 'LAST_7_DAYS',
  '14d': 'LAST_14_DAYS',
  '30d': 'LAST_30_DAYS',
};

const COMMON_METRICS = [
  'metrics.cost_micros',
  'metrics.impressions',
  'metrics.clicks',
  'metrics.ctr',
  'metrics.average_cpc',
  'metrics.conversions',
  'metrics.conversions_value',
];

export interface GaqlBuildOutput {
  query: string;
  resource: string;
}

export function buildGaql(params: InsightsParams): GaqlBuildOutput {
  const entity = ENTITY_BY_LEVEL[params.level];
  if (!entity) {
    throw new AppError('VALIDATION', `Level inválido: ${params.level}`);
  }

  const isCustom = params.period === 'custom';
  if (isCustom && (!params.from || !params.to)) {
    throw new AppError(
      'VALIDATION',
      'Período custom requer --from e --to (YYYY-MM-DD).',
    );
  }

  const selectFields = [entity.idField, entity.nameField, ...COMMON_METRICS, 'segments.date'];

  const whereClauses: string[] = [];

  if (isCustom) {
    whereClauses.push(`segments.date BETWEEN '${params.from}' AND '${params.to}'`);
  } else {
    whereClauses.push(
      `segments.date DURING ${PERIOD_DURING[params.period as keyof typeof PERIOD_DURING]}`,
    );
  }

  if (params.filter?.campaignId && params.level !== 'account') {
    whereClauses.push(`campaign.id = ${params.filter.campaignId}`);
  }

  if (params.level === 'keyword') {
    whereClauses.push("ad_group_criterion.type = 'KEYWORD'");
  }

  const query = [
    `SELECT ${selectFields.join(', ')}`,
    `FROM ${entity.resource}`,
    `WHERE ${whereClauses.join(' AND ')}`,
  ].join(' ');

  return { query, resource: entity.resource };
}

export function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export { ENTITY_BY_LEVEL };
